
'use server';
/**
 * @fileOverview This file implements a Genkit flow for real-time AI waste detection
 * using a live camera feed. Implements retry logic for 503/429 errors.
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
  - If there are multiple identical items, group them into ONE entry with the correct quantity.
  - If there are different types of items, list each type as a separate item in the list.

  Point calculation rules:
  - PET/HDPE Plastics: 5 pts per item
  - Cardboard/Paper: 10 pts per item
  - Metal Cans: 3 pts per item
  - E-Waste: 20 pts per item
  - IMPORTANT: The 'points' field for an entry should be (quantity * points_per_item).

  Summary instructions:
  - Return a list of detected items, the total points, and an encouraging summary in English.
  - Summary sentiment: "Excellent! You've made a great start in waste sorting. Let's keep protecting our planet through recycling together!"

  Image: {{media url=photoDataUri}}`,
});

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const aiWasteDetectionLiveCameraFlow = ai.defineFlow(
  {
    name: 'aiWasteDetectionLiveCameraFlow',
    inputSchema: AiWasteDetectionInputSchema,
    outputSchema: AiWasteDetectionOutputSchema,
  },
  async (input) => {
    const maxRetries = 4;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const {output} = await aiWasteDetectionPrompt(input);
        if (!output) {
          throw new Error('AI failed to return detection results.');
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

    if (lastError?.message?.includes('503') || lastError?.message?.includes('Service Unavailable')) {
      throw new Error('AI_BUSY: Gemini is temporarily busy. Please try again shortly.');
    }
    if (lastError?.message?.includes('429') || lastError?.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('QUOTA_EXHAUSTED: AI quota reached. Please check back later.');
    }
    throw lastError || new Error('Live camera analysis failed.');
  }
);

export async function aiWasteDetectionLiveCamera(input: AiWasteDetectionInput): Promise<AiWasteDetectionOutput> {
  return aiWasteDetectionLiveCameraFlow(input);
}
