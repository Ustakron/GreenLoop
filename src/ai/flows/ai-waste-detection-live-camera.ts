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
// These are used to inform the AI model about what categories to detect and how to score them.
const acceptedWasteTypes = [
  {
    id: "plastics",
    icon: "🧴",
    title: "Plastics",
    description:
      "Focus on PET bottles such as clear water bottles, plus HDPE bottles like milk and shampoo containers. This category is high-volume and consistently in demand at recycling plants."
  },
  {
    id: "paper",
    icon: "📦",
    title: "Paper / Cardboard",
    description:
      "Corrugated parcel boxes are a strong fit for our transport business, alongside clean black-and-white paper that can be bundled for pickup."
  },
  {
    id: "metals",
    icon: "🥫",
    title: "Metals",
    description:
      "Aluminium beverage cans remain a priority material because they usually carry a relatively strong buyback value per kilogram."
  },
  {
    id: "ewaste",
    icon: "📱",
    title: "E-Waste",
    description:
      "Small electronics such as old phones, charging cables, and circuit boards can still yield valuable recovered materials like copper and gold, and many large handlers already support this stream."
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
  id: z.string().describe("A unique identifier for the detected item type (e.g., 'pet-bottle', 'hdpe-milk-jug')."),
  emoji: z.string().describe("An emoji representing the item (e.g., '🧴', '📦')."),
  label: z.string().describe("A human-readable label for the item (e.g., 'PET Plastic Bottle', 'Corrugated Cardboard Box')."),
  quantity: z.number().int().positive().describe("The estimated quantity of this item type."),
  unit: z.string().describe("The unit of quantity (e.g., 'items', 'kg')."),
  points: z.number().int().min(0).describe("The estimated points for this specific item type, based on its type and condition."),
});

const AiWasteDetectionOutputSchema = z.object({
  items: z.array(DetectedItemSchema).describe("A list of detected recyclable waste items."),
  totalPoints: z.number().int().min(0).describe("The total estimated points for all detected items."),
  summary: z.string().describe("A brief summary of the waste detection results and overall quality for recycling."),
});
export type AiWasteDetectionOutput = z.infer<typeof AiWasteDetectionOutputSchema>;

// Format the accepted waste types into a string for direct inclusion in the prompt.
const wasteTypesFormattedForPrompt = acceptedWasteTypes.map(item =>
  `- ${item.title} (${item.icon}): ${item.description}`
).join('\n');

const aiWasteDetectionPrompt = ai.definePrompt({
  name: 'aiWasteDetectionPrompt',
  input: {schema: AiWasteDetectionInputSchema},
  output: {schema: AiWasteDetectionOutputSchema},
  // Specify the multimodal model for image input.
  model: 'googleai/gemini-2.5-flash-image',
  prompt: `You are an expert waste identification and recycling point estimation AI for the GreenLoop app. Your task is to analyze an image of waste, identify recyclable items from a predefined list, estimate their quantity, assign appropriate points based on type and visible condition, and provide a summary.

Here are the accepted waste categories and their descriptions for GreenLoop:
${wasteTypesFormattedForPrompt}

Strictly adhere to the following rules:
1. Identify only items that clearly fall into the accepted categories mentioned above.
2. For each identified item, estimate a reasonable quantity (e.g., number of bottles, weight in kg for metals/paper) and assign points based on its type and visible condition. Assume a cleaner, better-sorted item will receive more points. For PET plastic bottles, assume approximately 5 points per item. For HDPE bottles, 7 points. For cardboard boxes, 10 points per box. For aluminum cans, 3 points per can. For e-waste, 20 points per small item (e.g., phone, cable). Adjust these base points slightly if condition is exceptional or poor.
3. If an item is not clearly identifiable or does not fit an accepted category, do not include it in the 'items' array.
4. Calculate 'totalPoints' by summing up the 'points' from all identified items.
5. Provide a concise 'summary' of the detection, indicating the overall quality and readiness for recycling.

Photo of waste: {{media url=photoDataUri}}`,
});

const aiWasteDetectionLiveCameraFlow = ai.defineFlow(
  {
    name: 'aiWasteDetectionLiveCameraFlow',
    inputSchema: AiWasteDetectionInputSchema,
    outputSchema: AiWasteDetectionOutputSchema,
  },
  async (input) => {
    // The prompt is configured with the static acceptedWasteTypes directly in its string template.
    // Therefore, only the dynamic input (photoDataUri) needs to be passed to the prompt function.
    const {output} = await aiWasteDetectionPrompt(input);
    return output!;
  }
);

export async function aiWasteDetectionLiveCamera(input: AiWasteDetectionInput): Promise<AiWasteDetectionOutput> {
  return aiWasteDetectionLiveCameraFlow(input);
}
