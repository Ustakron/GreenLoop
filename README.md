# GreenLoop - Sustainable Waste Management

AI-powered waste detection and recycling rewards platform.

## Tech Stack Summary (สรุปเทคโนโลยีที่ใช้)

### 1. Frontend (หน้าบ้าน)
- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS + ShadCN UI (Green/Orange theme)
- **Icons:** Lucide-React
- **State Management:** React Hooks (useState, useEffect)

### 2. Backend & AI (หลังบ้านและปัญญาประดิษฐ์)
- **Server Environment:** Node.js (Runtime)
- **Server Actions:** Next.js Native Actions (รันโค้ดหลังบ้านผ่านไฟล์ตระกูล `.ts` ที่ระบุ `'use server'`)
- **AI Framework:** Genkit (จัดการ AI Workflow และ Prompt)
- **AI Model:** Gemini 2.5 Flash (ประมวลผลภาพถ่ายและคำนวณคะแนน)
- **Error Handling:** Exponential Backoff & Retry (สำหรับจัดการ 503/429 errors)

### 3. Infrastructure & Services (โครงสร้างพื้นฐาน)
- **Platform:** Firebase App Hosting (เซิร์ฟเวอร์สำหรับออนไลน์เว็บ)
- **Database/Auth:** Firebase SDK (เตรียมพร้อมสำหรับระบบสมาชิกและฐานข้อมูลคะแนน)
- **Environment:** `.env` (จัดการความลับ เช่น API Keys)

## Project Structure (โครงสร้างไฟล์)
- `src/app/`: จัดการหน้าจอ (Page) และโครงสร้างหลัก (Layout)
- `src/ai/flows/`: ไฟล์ประมวลผล AI (Backend logic สำหรับวิเคราะห์ขยะ)
- `src/components/`: ส่วนประกอบหน้าเว็บ (UI Components) และระบบกล้อง (Camera Scanner)
- `src/lib/`: ข้อมูลจำลองและฟังก์ชันอำนวยความสะดวกต่างๆ
