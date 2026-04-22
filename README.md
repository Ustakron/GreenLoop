# GreenLoop - Sustainable Waste Management

AI-powered waste detection and recycling rewards platform.

## Tech Stack (ส่วนประกอบของแอป)

1. **Framework:** Next.js 15 (App Router)
   - ไฟล์หลัก: `src/app/layout.tsx`, `src/app/page.tsx`
   - หน้าที่: จัดการโครงสร้างเว็บและส่วนติดต่อผู้ใช้ทั้งหมด

2. **Language:** TypeScript
   - ไฟล์: ทุกไฟล์นามสกุล `.ts` และ `.tsx`
   - หน้าที่: ควบคุมความถูกต้องของโค้ด

3. **Styling:** Tailwind CSS + ShadCN UI
   - ไฟล์หลัก: `src/app/globals.css`, `tailwind.config.ts`
   - หน้าที่: จัดการความสวยงาม (Green/Orange theme) และ UI Components

4. **Icons:** Lucide-React
   - การใช้งาน: เรียกใช้ใน Component ต่างๆ เช่น `Home`, `Recycle`, `Gift`

5. **Generative AI:** Genkit
   - ไฟล์หลัก: `src/ai/genkit.ts`, `src/ai/flows/`
   - หน้าที่: เชื่อมต่อและจัดการการทำงานของ AI

6. **AI Model:** Gemini 2.5 Flash
   - การใช้งาน: ระบุใน Prompt ภายในไฟล์ Flows
   - หน้าที่: วิเคราะห์ภาพถ่ายขยะ และคำนวณคะแนน (Object Detection)

7. **Platform:** Firebase App Hosting
   - ไฟล์: `apphosting.yaml`
   - หน้าที่: ใช้พับบลิชเว็บขึ้นออนไลน์
