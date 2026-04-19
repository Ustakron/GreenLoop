'use server';
/**
 * @fileOverview An AI agent for detecting recyclable waste from a photo and estimating points.
 *
 * - aiWasteDetectionUpload - A function that handles the waste detection process.
 * - AiWasteDetectionUploadInput - The input type for the aiWasteDetectionUpload function.
 * - AiWasteDetectionUploadOutput - The return type for the aiWasteDetectionUpload function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiWasteDetectionUploadInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of recyclable waste, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AiWasteDetectionUploadInput = z.infer<typeof AiWasteDetectionUploadInputSchema>;

const AiWasteDetectionUploadOutputSchema = z.object({
  items: z.array(
    z.object({
      emoji: z.string().describe('An emoji representing the detected item.'),
      label: z.string().describe('The name of the detected recyclable item.'),
      quantity: z.number().int().positive().describe('The estimated quantity of the item.'),
      unit: z.string().describe('The unit for the quantity (e.g., "bottles", "cans", "kg", "items").'),
      points: z.number().int().min(0).describe('The estimated points for this item.'),
    })
  ).describe('A list of detected recyclable items with their details.'),
  totalPoints: z.number().int().min(0).describe('The total estimated points for all detected items.'),
  summary: z.string().describe('A brief summary of the detected waste and its value.'),
});
export type AiWasteDetectionUploadOutput = z.infer<typeof AiWasteDetectionUploadOutputSchema>;

export async function aiWasteDetectionUpload(
  input: AiWasteDetectionUploadInput
): Promise<AiWasteDetectionUploadOutput> {
  return aiWasteDetectionUploadFlow(input);
}

const wasteDetectionPrompt = ai.definePrompt({
  name: 'wasteDetectionPrompt',
  input: { schema: AiWasteDetectionUploadInputSchema },
  output: { schema: AiWasteDetectionUploadOutputSchema },
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an expert AI waste detection and scoring assistant for GreenLoop.
Your task is to identify recyclable waste from the provided photo, estimate its quantity, and assign GreenLoop points based on its value.

Here are the high-value and easy-to-identify waste types to focus on, along with typical point guidance:
- Plastics (PET bottles, HDPE bottles): Approx 10-20 points per bottle. Use 🧴 for emoji.
- Paper/Cardboard (corrugated parcel boxes, black-and-white paper): Approx 5-15 points per item/small stack. Use 📦 for emoji.
- Metals (aluminum beverage cans): Approx 20-30 points per can. Use 🥫 for emoji.
- E-Waste (old mobile phones, charging cables, circuit boards): Approx 50-100 points per item. Use 📱 for emoji.

Instructions:
1. Analyze the provided image of waste.
2. Identify all visible recyclable items from the categories above.
3. For each identified item, estimate its quantity.
4. Assign estimated GreenLoop points based on the type and quantity, following the guidance above.
5. Calculate the total estimated points for all detected items.
6. Provide a concise summary of the detected waste and its point value.
7. Ensure the output is a valid JSON object matching the provided output schema.

Photo of waste: {{media url=photoDataUri}}`,
});

const aiWasteDetectionUploadFlow = ai.defineFlow(
  {
    name: 'aiWasteDetectionUploadFlow',
    inputSchema: AiWasteDetectionUploadInputSchema,
    outputSchema: AiWasteDetectionUploadOutputSchema,
  },
  async (input) => {
    const {output} = await wasteDetectionPrompt(input);
    if (!output) {
      throw new Error('AI did not return a valid output for waste detection.');
    }
    return output;
  }
);
