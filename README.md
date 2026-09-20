# Sahaya Co-operative Governance Advisor (ಸಹಾಯ • सहकार)

Sahaya is a high-fidelity, full-stack, and intelligent co-operative governance advisor designed for Indian rural citizens, cooperative society members, dairy producers, and administrative secretaries. It combines robust localized statutory grounding with cutting-edge real-time conversation classification to empower users with legal literacy, dispute resolution guidance, and seamless government scheme navigation.

---

## 🌟 Core Features

### 1. Multilingual Statutory AI Chatbot (Sahaya Counsel)
* **Real-time Translation & Audio Transcription**: Multi-turn dialog supporting **English, Kannada (ಕನ್ನಡ), Hindi (हिंदी), Tamil (தமிழ்), Telugu (ತೆಲುಗು), and Malayalam (മലയാളം)**.
* **Grounded Legal Advisor**: Powered by Gemini's advanced reasoning, providing specific sections and statutory citations from the *Karnataka Co-operative Societies Act, 1959*, *Multi-State Co-operative Societies Act, 2002*, and *Model PACS Bylaws, 2023*.
* **Interactive Redirection Engine**: Discovered official portals and links in chat are turned into clickable, sandbox-safe elements instantly.

### 2. Sahaya Memory Engine & Topic-Isolation
* **Dynamic Query Classifier**: Automatically tags inbound user messages into specialized functional domains:
  * `scheme_query` (Scholarships, Loans, Solar, Health)
  * `grievance_process` (Registrar Appeals, Dispute Resolution, Arbitrations)
  * `governance_bylaws` (AGM rules, Vote rights, Quorums)
  * `general_cooperative` (General query)
* **Topic-Leakage Protection**: Dynamically isolates and filters conversational history sent to the Gemini API. If a user shifts from agricultural bylaws to student scholarships, previous PACS rules are filtered out, completely preventing cross-topic context contamination while retaining perfect continuity on relative threads.
* **Transitions Terminal**: Includes a real-time monospace visual debugging dashboard displaying precise log traces of memory adjustments and state switches.

### 3. Interactive Schemes Navigator & PDF Checklist Builder
* Search and filters major rural welfare schemes including:
  * **SSP (State Scholarship Portal)**
  * **Kisan Credit Card (KCC) Subvention**
  * **PM-KUSUM Solar Pumps**
  * **Yashaswini Cooperative Healthcare**
  * **AP YSR Sunna Vaddi** & more.
* **Dynamic Document Checklist**: Automatically checks user-provided profiles to generate customized checklists and eligibility reports, exportable instantly as a structured PDF certificate.

### 4. Civic Intelligence Dashboard & Legal Draft Generator
* **Statutory Appeals Builder**: Crafts structured legal appeal templates to ARCS (Assistant Registrar of Cooperative Societies) in multiple languages.
* **PACS Compliance Audit**: Generates standard PACS bylaws compliance spreadsheets.
* **Data Exporters**: Instantly exports legal drafts and compliance logs to PDF, JSON, or CSV formats.

---

## 🛠️ Technical Stack & Architecture

* **Frontend**: React 18+, Vite, Tailwind CSS, Lucide Icons, and Motion.
* **Backend**: Express (Node.js API proxy) integrated with Vite middleware for unified single-port development.
* **AI Engine**: `@google/genai` (Google GenAI TypeScript SDK) running server-side for API key protection.
* **Model Cascade**: Multi-model resilience using primary `gemini-3.8-flash` with automatic fallback to high-throughput `gemini-3.1-flash-lite` in case of network fluctuations.
* **Port Constraint**: Set to launch exclusively on port **3000** for secure, reverse-proxy-friendly container execution.

---

## 📂 Project Structure

```bash
├── server.ts              # Unified full-stack server (Express, Vite Middleware, Gemini Client)
├── src/
│   ├── App.tsx            # Main Entry application with responsive views
│   ├── main.tsx           # React bootstrap entry
│   ├── types.ts           # Shared TypeScript interfaces (Chat, Schemes, Bylaws)
│   ├── index.css          # Tailwind CSS global entry
│   ├── components/        # Modulized UI Components
│   │   ├── MultilingualAIChat.tsx         # AI Chat with Sahaya Memory Engine terminal
│   │   ├── SchemesNavigator.tsx           # Schemes search and PDF Checklist export
│   │   ├── BylawsLibrary.tsx              # Bylaws compliance checks and CSV exporters
│   │   ├── CivicIntelligenceDashboard.tsx # Complaint drafts generator
│   │   └── SahayaLogo.tsx                 # Sleek custom SVG logo
│   └── data/
│       └── cooperativeData.ts             # Grounded statutory data, schemes details, and bylaws
├── package.json           # Dependencies and build system config
└── tsconfig.json          # TypeScript configurations
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Environment Setup
Create a `.env` file in the root directory and append your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Installation
Install all base dependencies:
```bash
npm install
```

### 4. Running the App (Development Mode)
Run the development server which binds both the Express backend and Vite frontend on port `3000`:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 5. Production Build
Build and compile the static assets and the backend bundle cleanly into `dist/`:
```bash
npm run build
```

Start the compiled production bundle:
```bash
npm run start
```

---

## 🛡️ Trust & Verification
* **Zero Mock Stubs**: Every document checklist builder, legal exporter, portal redirector, and translation switch is fully wired, interactive, and functional.
* **No Client-side Secrets**: All AI operations are proxied via server-side endpoints, keeping secret API keys fully protected.
