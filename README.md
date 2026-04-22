# GreenLoop - Sustainable Waste Management

AI-powered waste detection and recycling rewards platform.

## Tech Stack Summary

### 1. Frontend
- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS + ShadCN UI
- **Icons:** Lucide-React
- **State:** React Hooks (useState, useEffect)

### 2. Backend
- **Next.js Server Actions:** Manages security and data handling (Secure Logic).
- **Genkit:** Orchestrates AI workflows and logic steps (AI Flow).
- **Node.js:** Core runtime environment for backend execution (Runtime).
- **Firebase:** Infrastructure, deployment, and secure API key management (Infrastructure).

### 3. AI & Models
- **Primary Model:** Gemini 2.5 Flash
- **Task:** Image analysis, item counting, and point calculation
- **Reliability:** Genkit Flows with exponential backoff retry logic

### 4. Infrastructure
- **Platform:** Firebase App Hosting
- **Secrets:** Secure .env management for API Keys
- **Services:** Firebase Client SDK for Auth/Firestore integration

## Reward System Features

- **AI-Powered Valuation:** Automatically calculates recycling points based on waste type and quantity detected via camera.
- **Dynamic Tiering:** Tracks user progress through achievement tiers (Silver, Gold) to encourage consistent recycling.
- **Point Redemption:** Exchange earned points for digital vouchers (shipping discounts, cash coupons) and physical eco-products.
- **Eco-Bonus Incentives:** Earn extra points by choosing "Flexible" pickup slots to help optimize low-carbon transport routes.
