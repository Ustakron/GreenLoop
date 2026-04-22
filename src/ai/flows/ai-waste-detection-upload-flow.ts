
'use server';
/**
 * @fileOverview An AI agent for detecting and counting recyclable waste from an uploaded photo.
 * Implements retry logic with exponential backoff for 503/429 errors.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiWasteDetectionUploadInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
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
  name: 'wasteDetectionUploadPrompt',
  input: { schema: AiWasteDetectionUploadInputSchema },
  output: { schema: AiWasteDetectionUploadOutputSchema },
  model: 'googleai/gemini-2.5-flash',
  prompt: `Identify and COUNT ALL recyclable waste items from the photo. Focus on Plastics, Paper, Metals, and E-Waste.
  
  Counting Rules:
  - Scan the entire image for all recyclable materials.
  - Group identical items together (e.g., if there are 3 plastic bottles, return one entry with quantity: 3).
  - If there are different items (e.g., a bottle and a box), list them separately.
  - Calculate points based on the total quantity for each group.
  
  Point calculation rules:
  - Plastics: 5 pts per item
  - Paper: 10 pts per item
  - Metals: 3 pts per item
  - E-Waste: 20 pts per item

  Summary instructions:
  - Write an encouraging summary in English.
  - Example sentiment: "Excellent! You've made a great start in waste sorting. Let's keep protecting our planet through recycling together!"

  Photo: {{media url=photoDataUri}}`,
});

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const aiWasteDetectionUploadFlow = ai.defineFlow(
  {
    name: 'aiWasteDetectionUploadFlow',
    inputSchema: AiWasteDetectionUploadInputSchema,
    outputSchema: AiWasteDetectionUploadOutputSchema,
  },
  async (input) => {
    const maxRetries = 4;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const {output} = await wasteDetectionPrompt(input);
        if (!output) {
          throw new Error('AI could not analyze the image.');
        }
        return output;
      } catch (error: any) {
        lastError = error;
        const errorMsg = error.message || "";
        const isTemporary = errorMsg.includes('503') || errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('Service Unavailable');
        
        if (isTemporary && attempt < maxRetries) {
          const delay = Math.min(1000 * 2 ** attempt, 8000);
          await sleep(delay);
          continue;
        }
        break;
      }
    }
    
    // If we get here, it means all retries failed
    if (lastError?.message?.includes('503') || lastError?.message?.includes('Service Unavailable')) {
      throw new Error('AI_BUSY: Gemini is temporarily busy. Please try again shortly.');
    }
    if (lastError?.message?.includes('429') || lastError?.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('QUOTA_EXHAUSTED: AI quota reached. Please check back later.');
    }
    throw lastError || new Error('AI analysis failed.');
  }
);

export async function aiWasteDetectionUpload(
  input: AiWasteDetectionUploadInput
): Promise<AiWasteDetectionUploadOutput> {
  return aiWasteDetectionUploadFlow(input);
}
