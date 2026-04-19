
'use server';
/**
 * @fileOverview This file implements a Genkit flow for real-time AI waste detection
 * using a live camera feed or uploaded photo. It identifies recyclable items,
 * estimates their quantity and assigns points, and provides a summary.
 *
 * - aiWasteDetectionLiveCamera - The function that handles AI waste detection.
 * - AiWasteDetectionInput - The input type for the aiWasteDetectionLiveCamera function.
 * - AiWasteDetectionOutput - The return type for the aiWasteDetectionLiveCamera function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define accepted waste types as they are static data relevant to the prompt context.
const acceptedWasteTypes = [
  {
    id: "plastics",
    icon: "🧴",
    title: "Plastics",
    description:
      "Focus on PET bottles such as clear water bottles, plus HDPE bottles like milk and shampoo containers."
  },
  {
    id: "paper",
    icon: "📦",
    title: "Paper / Cardboard",
    description:
      "Corrugated parcel boxes and clean white paper."
  },
  {
    id: "metals",
    icon: "🥫",
    title: "Metals",
    description:
      "Aluminium beverage cans and scrap metal."
  },
  {
    id: "ewaste",
    icon: "📱",
    title: "E-Waste",
    description:
      "Small electronics such as old phones and charging cables."
  }
];

const AiWasteDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of waste items, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type AiWasteDetectionInput = z.infer<typeof AiWasteDetectionInputSchema>;

const DetectedItemSchema = z.object({
  id: z.string().describe("A unique identifier for the detected item type."),
  emoji: z.string().describe("An emoji representing the item."),
  label: z.string().describe("A human-readable label for the item."),
  quantity: z.number().int().positive().describe("The estimated quantity."),
  unit: z.string().describe("The unit of quantity."),
  points: z.number().int().min(0).describe("The estimated points."),
});

const AiWasteDetectionOutputSchema = z.object({
  items: z.array(DetectedItemSchema).describe("A list of detected recyclable waste items."),
  totalPoints: z.number().int().min(0).describe("The total estimated points."),
  summary: z.string().describe("A brief summary of the waste detection results."),
});
export type AiWasteDetectionOutput = z.infer<typeof AiWasteDetectionOutputSchema>;

const wasteTypesFormattedForPrompt = acceptedWasteTypes.map(item =>
  `- ${item.title} (${item.icon}): ${item.description}`
).join('\n');

const aiWasteDetectionPrompt = ai.definePrompt({
  name: 'aiWasteDetectionPrompt',
  input: {schema: AiWasteDetectionInputSchema},
  output: {schema: AiWasteDetectionOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert waste identification AI. Analyze the image and identify recyclable items from the categories below:
${wasteTypesFormattedForPrompt}

Calculate points: PET bottles (5 pts), HDPE (7 pts), Cardboard (10 pts), Cans (3 pts), E-Waste (20 pts).

Photo: {{media url=photoDataUri}}`,
});

const aiWasteDetectionLiveCameraFlow = ai.defineFlow(
  {
    name: 'aiWasteDetectionLiveCameraFlow',
    inputSchema: AiWasteDetectionInputSchema,
    outputSchema: AiWasteDetectionOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await aiWasteDetectionPrompt(input);
      if (!output) {
        throw new Error('AI did not return a valid output.');
      }
      return output;
    } catch (error: any) {
      console.error('Genkit flow error:', error);
      throw error;
    }
  }
);

export async function aiWasteDetectionLiveCamera(input: AiWasteDetectionInput): Promise<AiWasteDetectionOutput> {
  return aiWasteDetectionLiveCameraFlow(input);
}
