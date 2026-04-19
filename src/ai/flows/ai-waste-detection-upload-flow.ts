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
      "A photo of recyclable waste, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type AiWasteDetectionUploadInput = z.infer<typeof AiWasteDetectionUploadInputSchema>;

const AiWasteDetectionUploadOutputSchema = z.object({
  items: z.array(
    z.object({
      emoji: z.string(),
      label: z.string(),
      quantity: z.number().int(),
      unit: z.string(),
      points: z.number().int(),
    })
  ),
  totalPoints: z.number().int(),
  summary: z.string(),
});
export type AiWasteDetectionUploadOutput = z.infer<typeof AiWasteDetectionUploadOutputSchema>;

const wasteDetectionPrompt = ai.definePrompt({
  name: 'wasteDetectionPrompt',
  input: { schema: AiWasteDetectionUploadInputSchema },
  output: { schema: AiWasteDetectionUploadOutputSchema },
  model: 'gemini-1.5-flash',
  prompt: `Identify recyclable waste from the photo. Focus on Plastics, Paper, Metals, and E-Waste.
Estimate points: Plastics (10-20), Paper (5-15), Metals (20-30), E-Waste (50-100).

Photo: {{media url=photoDataUri}}`,
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
      throw new Error('AI did not return a valid output.');
    }
    return output;
  }
);

export async function aiWasteDetectionUpload(
  input: AiWasteDetectionUploadInput
): Promise<AiWasteDetectionUploadOutput> {
  return aiWasteDetectionUploadFlow(input);
}
