# GreenLoop - Sustainable Waste Management

AI-powered waste detection and recycling rewards platform.

## Tech Stack Summary

### 1. Frontend
- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS + ShadCN UI (Custom Green/Orange theme)
- **Icons:** Lucide-React
- **State Management:** React Hooks (useState, useEffect)

### 2. Backend
- **Server Environment:** Node.js Runtime
- **Logic Handling:** Next.js Server Actions (Functions defined with `'use server'` for secure, server-side execution)
- **AI Integration:** Genkit (Framework for managing AI prompts and structured output)
- **API Communication:** JSON-based communication between client and server actions

### 3. AI & Models
- **Primary Model:** Gemini 2.5 Flash (Used for image analysis, item counting, and point calculation)
- **Flow Management:** Genkit Flows (Implements retry logic with exponential backoff for 503/429 errors)

### 4. Infrastructure & Services
- **Platform:** Firebase App Hosting (Managed production hosting for Next.js)
- **Database & Auth:** Firebase Client SDK (Configured for potential user profile and transaction storage)
- **Secrets:** Environment variables (.env) for secure API key management

## Project Structure
- `src/app/`: Screen definitions and main application layout.
- `src/ai/flows/`: Backend AI processing logic and prompt definitions.
- `src/components/`: Reusable UI components and the Camera Scanner system.
- `src/lib/`: Data models, mock data, and utility functions.
