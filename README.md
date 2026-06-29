# 🇳🇵 Smart NID Nepal — स्मार्ट दर्ता

> 🚧 **Work in Progress / Under Construction** 🚧  
> *This project is currently under active development. Features, UI, and APIs are subject to change.*

**Smart NID Nepal** is an AI-powered National ID (NID) pre-enrollment assistant designed to streamline the complex citizenship registration process in Nepal. 

By leveraging the cutting-edge Google Gemini Vision API, this application completely automates data entry. Users simply upload a photo of their physical Nepali Citizenship Certificate (नागरिकता प्रमाणपत्र), and the AI instantly reads, translates, and extracts all the necessary fields (both in Nepali and English) to pre-fill the official NID enrollment form.

### Key Features:
- **Instant OCR Extraction**: Accurately extracts complex bilingual data (Devanagari and Latin) directly from citizenship cards.
- **Smart Data Conversion**: Automatically converts dates from Bikram Sambat (BS) to Anno Domini (AD).
- **Premium User Interface**: A beautifully crafted, responsive Light Mode UI that feels official and trustworthy.
- **Privacy First**: Built as a secure prototype where image processing happens temporarily in memory—no files or personal data are ever persisted or logged.

## Quick Start

### 1. Set up your API key

```bash
# In the server directory
cp .env.example .env
# Edit .env and add your Gemini API key from https://aistudio.google.com/apikey
```

### 2. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Start both servers

```bash
# Terminal 1 — Server (port 3001)
cd server
npm run dev

# Terminal 2 — Client (port 5173)
cd client
npm run dev
```

### 4. Open in browser

Navigate to [http://localhost:5173](http://localhost:5173)

## Tech Stack

| Layer     | Tech                                |
| --------- | ----------------------------------- |
| Frontend  | React 18 + Vite + TypeScript        |
| Styling   | Tailwind CSS v4                     |
| State     | Zustand                             |
| Backend   | Express + TypeScript                |
| AI        | Google Gemini (gemini-2.5-flash)    |
| OCR       | Gemini Vision API                   |

## Project Structure

```
nid auto/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/   # DropZone, JsonViewer
│   │   ├── pages/        # UploadPage
│   │   ├── store/        # Zustand enrollment store
│   │   └── types/        # Shared TypeScript types
│   └── ...
│
├── server/          # Express backend
│   ├── src/
│   │   ├── ai/           # Gemini API integration
│   │   ├── prompts/      # System prompts for AI
│   │   ├── routes/       # API endpoints
│   │   └── types/        # Shared types
│   └── ...
│
└── README.md
```

## Phases

- [x] **Phase 1** — Project scaffold + citizenship OCR
- [ ] **Phase 2** — Multi-tab enrollment form
- [ ] **Phase 3** — AI review gate
- [ ] **Phase 4** — AI appointment suggestion
- [ ] **Phase 5** — Submission + receipt
- [ ] **Phase 6** — Polish & accessibility
