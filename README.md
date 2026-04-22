# GreenLoop - Sustainable Waste Management

AI-powered waste detection and recycling rewards platform.

## Tech Stack Summary

### 1. Frontend
- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS + ShadCN UI (Custom Green/Orange theme)
- **Icons:** Lucide-React
- **State Management:** React Hooks (useState, useEffect)

### 2. Backend & AI
- **Server Environment:** Node.js Runtime
- **Server Actions:** Next.js Native Actions (Backend logic defined in `.ts` files with `'use server'`)
- **AI Framework:** Genkit (Manages AI workflows and prompts)
- **AI Model:** Gemini 2.5 Flash (Analyzes photos and calculates recycling points)
- **Error Handling:** Exponential Backoff & Retry (Handles 503/429 AI service errors)

### 3. Infrastructure & Services
- **Platform:** Firebase App Hosting (Scalable production hosting)
- **Database/Auth:** Firebase SDK (Ready for user management and point tracking)
- **Secrets Management:** `.env` (Secure handling of API Keys)

## Project Structure
- `src/app/`: Screen definitions and main application layout.
- `src/ai/flows/`: AI processing logic (Backend flows for waste analysis).
- `src/components/`: Reusable UI components and the Camera Scanner system.
- `src/lib/`: Mock data and utility functions.
