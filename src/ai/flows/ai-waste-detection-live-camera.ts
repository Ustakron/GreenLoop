
'use server';
/**
 * @fileOverview This file implements a Genkit flow for real-time AI waste detection
 * using a live camera feed. It supports identifying multiple items and counts.
 *
 * - aiWasteDetectionLiveCamera - The function that handles AI waste detection.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const acceptedWasteTypes = [
  {
    id: "plastics",
    icon: "🧴",
    title: "Plastics",
    description: "PET bottles, HDPE containers (milk, shampoo)."
  },
  {
    id: "paper",
    icon: "📦",
    title: "Paper / Cardboard",
    description: "Boxes and clean paper."
  },
  {
    id: "metals",
    icon: "🥫",
    title: "Metals",
    description: "Aluminium cans and scrap."
  },
  {
    id: "ewaste",
    icon: "📱",
    title: "E-Waste",
    description: "Small electronics and cables."
  }
];

const AiWasteDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of waste items, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AiWasteDetectionInput = z.infer<typeof AiWasteDetectionInputSchema>;

const DetectedItemSchema = z.object({
  emoji: z.string(),
  label: z.string(),
  quantity: z.number().int(),
  unit: z.string(),
  points: z.number().int(),
});

const AiWasteDetectionOutputSchema = z.object({
  items: z.array(DetectedItemSchema),
  totalPoints: z.number().int(),
  summary: z.string(),
});
export type AiWasteDetectionOutput = z.infer<typeof AiWasteDetectionOutputSchema>;

const wasteTypesFormatted = acceptedWasteTypes.map(item => `- ${item.title}: ${item.description}`).join('\n');

const aiWasteDetectionPrompt = ai.definePrompt({
  name: 'aiWasteDetectionPrompt',
  input: {schema: AiWasteDetectionInputSchema},
  output: {schema: AiWasteDetectionOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an expert waste identification AI. 
  
  Analyze the provided image carefully and identify ALL recyclable items from these categories:
  ${wasteTypesFormatted}

  Counting Rules:
  - Identify and count every single item visible.
  - If there are multiple identical items (e.g., 3 plastic bottles), group them into ONE entry with quantity set to 3.
  - If there are different items (e.g., a bottle and a box), list them as separate items in the list.

  Point calculation rules:
  - PET/HDPE Plastics: 5 pts per item
  - Cardboard/Paper: 10 pts per item
  - Metal Cans: 3 pts per item
  - E-Waste: 20 pts per item
  - IMPORTANT: The 'points' field for an item should be (quantity * points_per_item).

  Return a list of detected items, the total points (sum of all item points), and an encouraging summary in English.
  Summary sentiment: "Excellent! You've made a great start in waste sorting. Let's keep protecting our planet through recycling together!"

  Image: {{media url=photoDataUri}}`,
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
        throw new Error('AI failed to return detection results.');
      }
      return output;
    } catch (error) {
      console.error('Flow error:', error);
      throw error;
    }
  }
);

export async function aiWasteDetectionLiveCamera(input: AiWasteDetectionInput): Promise<AiWasteDetectionOutput> {
  return aiWasteDetectionLiveCameraFlow(input);
}
