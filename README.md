# VeraGate: Multimodal Forensic Audit Engine

AI-powered forensic analysis that detects contradictions between video evidence and technical documentation using Google's Gemini 3.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Gemini](https://img.shields.io/badge/Gemini-3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- 🎥 **Video Analysis** - Upload video files for AI-powered OCR and transcription
- 📄 **PDF Cross-Reference** - Full document ingestion (up to 1M tokens, no RAG)
- 🔍 **Forensic Audit** - Detect spatial, temporal, factual, and specification errors
- 🧠 **AI Reasoning** - Real-time thinking log shows AI decision process
- 📊 **Contradiction Feed** - Timestamped issues with severity indicators

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Tailwind)               │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │  Dropzone   │  │ Thinking Log │  │ Contradiction Feed│   │
│  └─────────────┘  └──────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Next.js API)                     │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │ Agent 1: The Watcher│  │ Agent 2: The Auditor        │   │
│  │ Gemini 3 Flash      │  │ Gemini 3 Pro (thinking:high)│   │
│  │ Video OCR           │──▶│ Cross-Reference Analysis    │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Google Generative AI API                    │
│         Files API  │  generateContent  │  Thinking Mode      │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

> Get your API key at [Google AI Studio](https://aistudio.google.com/apikey)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Usage

1. **Upload Evidence** - Drag a video file and PDF document to the dropzone
2. **Start Analysis** - Click "Begin Forensic Analysis"
3. **Watch AI Thinking** - See real-time reasoning in the Thinking Log
4. **Review Contradictions** - Click any issue for detailed reasoning

## Gemini Models Used

| Agent       | Model                      | Purpose                              |
| ----------- | -------------------------- | ------------------------------------ |
| The Watcher | `gemini-2.0-flash`         | Fast video OCR and transcription     |
| The Auditor | `gemini-2.0-pro-exp-02-05` | Deep forensic analysis with thinking |

### Thinking Configuration

```typescript
config: {
  thinkingConfig: {
    thinkingLevel: ThinkingLevel.HIGH,
  },
  responseMimeType: "application/json",
}
```

## Contradiction Types

| Type             | Description                          |
| ---------------- | ------------------------------------ |
| 🗺️ Spatial       | Physical positions don't match specs |
| ⏰ Temporal      | Time indicators contradict claims    |
| 📋 Factual       | Information directly conflicts       |
| 📐 Specification | Technical specs violated             |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **AI SDK**: @google/genai

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # SSE streaming API
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Dashboard page
├── components/
│   ├── dropzone.tsx           # File upload
│   ├── thinking-log.tsx       # AI reasoning display
│   ├── contradiction-feed.tsx # Issue list
│   └── reasoning-replay.tsx   # Detail modal
└── types/
    └── forensic.ts            # TypeScript interfaces
```

## Troubleshooting

### Hydration Warning in Browser

If you see hydration errors mentioning `bis_skin_checked`, this is caused by browser extensions (like Bitdefender) modifying the DOM. Solutions:

1. Test in Incognito mode (extensions disabled)
2. Disable the browser extension for localhost
3. Use a different browser

This is not a bug in the application.

## License

MIT
