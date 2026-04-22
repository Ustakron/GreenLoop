# GreenLoop - Sustainable Waste Management

AI-powered waste detection and recycling rewards platform.

## Tech Stack Summary

### 1. Frontend
- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS + ShadCN UI
- **Icons:** Lucide-React
- **State:** React Hooks (useState, useEffect)

### 2. Backend
- **Runtime:** Node.js
- **Logic:** Next.js Server Actions (Secure server-side execution)
- **AI Orchestration:** Genkit (Manages prompts and structured output)

### 3. AI & Models
- **Primary Model:** Gemini 2.5 Flash
- **Task:** Image analysis, item counting, and point calculation
- **Reliability:** Genkit Flows with exponential backoff retry logic

### 4. Infrastructure
- **Platform:** Firebase App Hosting
- **Secrets:** Secure .env management for API Keys
- **Services:** Firebase Client SDK for Auth/Firestore integration
