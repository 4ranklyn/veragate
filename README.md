<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Gemini-3-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini 3" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
</p>

# VeraGate

> **AI-powered multimodal forensic analysis engine** that detects contradictions between video evidence and technical documentation using Google's Gemini 3.

VeraGate leverages a dual-agent architecture to perform deep forensic audits: **The Watcher** extracts observations from video, while **The Auditor** cross-references findings against PDF documentation to identify discrepancies.

---

## ✨ Features

| Feature                    | Description                                                                       |
| -------------------------- | --------------------------------------------------------------------------------- |
| 🎥 **Video Analysis**      | Upload video files for AI-powered OCR, speech transcription, and spatial analysis |
| 📄 **PDF Cross-Reference** | Full document ingestion using Gemini's 1M token context window (no RAG required)  |
| 🔍 **Forensic Audit**      | Detect spatial, temporal, factual, and specification contradictions               |
| 🧠 **AI Reasoning**        | Real-time thinking log shows the AI's decision-making process                     |
| 📊 **Contradiction Feed**  | Timestamped issues with severity indicators and confidence scores                 |
| ⚡ **Streaming Results**   | Server-Sent Events (SSE) for real-time analysis updates                           |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React 19 + Tailwind)               │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐   │
│  │  Dropzone   │  │ Thinking Log │  │ Contradiction Feed    │   │
│  └─────────────┘  └──────────────┘  └───────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ SSE Stream
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Next.js 16 API Routes)              │
│  ┌──────────────────────┐    ┌────────────────────────────┐     │
│  │ Agent 1: The Watcher │───▶│ Agent 2: The Auditor       │     │
│  │ gemini-3-flash       │    │ gemini-3-pro (thinking:high)│     │
│  │ Video OCR/Transcript │    │ Cross-Reference Analysis   │     │
│  └──────────────────────┘    └────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Google Generative AI API                      │
│         Files API  │  generateContent  │  Thinking Mode         │
└─────────────────────────────────────────────────────────────────┘
```

### Dual-Agent System

| Agent              | Model                    | Purpose                                             |
| ------------------ | ------------------------ | --------------------------------------------------- |
| **The Watcher** 👁️ | `gemini-3-flash-preview` | Fast video OCR, transcription, and spatial analysis |
| **The Auditor** 🧠 | `gemini-3-pro-preview`   | Deep forensic analysis with extended thinking mode  |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Google AI Studio API Key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/veragate.git
cd veragate

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

### Running the Application

```bash
# Development server
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

### 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t veragate .

# Run the container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_api_key_here veragate
```

Or use docker-compose:

```yaml
# docker-compose.yml
services:
  veragate:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
```

```bash
docker-compose up
```

---

## 📖 Usage Guide

1. **Upload Evidence** — Drag and drop a video file and PDF document to the dropzone
2. **Begin Analysis** — Click "Begin Forensic Analysis" to start the audit
3. **Watch AI Thinking** — Monitor real-time reasoning in the Thinking Log panel
4. **Review Contradictions** — Click any identified issue for detailed reasoning

---

## 🔬 Contradiction Types

| Type              | Icon | Description                          | Example                                    |
| ----------------- | ---- | ------------------------------------ | ------------------------------------------ |
| **Spatial**       | 🗺️   | Physical positions don't match specs | Component installed in wrong location      |
| **Temporal**      | ⏰   | Time indicators contradict claims    | Shadows indicate different time of day     |
| **Factual**       | 📋   | Information directly conflicts       | Different quantities in video vs. document |
| **Specification** | 📐   | Technical specs violated             | Dimensions don't match blueprint           |

---

## 🛠️ Tech Stack

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| **Framework** | Next.js 16.1.6 (App Router)         |
| **UI**        | React 19, Tailwind CSS 4, shadcn/ui |
| **Animation** | Framer Motion                       |
| **AI SDK**    | @google/genai                       |
| **Streaming** | Server-Sent Events (SSE)            |
| **Language**  | TypeScript 5                        |

---

## 📁 Project Structure

```
veragate/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts      # SSE streaming API endpoint
│   │   ├── layout.tsx            # Root layout with metadata
│   │   ├── page.tsx              # Dashboard page (bento grid)
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── dropzone.tsx          # File upload component
│   │   ├── thinking-log.tsx      # AI reasoning display
│   │   ├── contradiction-feed.tsx # Issue list with severity
│   │   ├── reasoning-replay.tsx  # Detail modal for contradictions
│   │   └── ui/                   # shadcn/ui components
│   ├── lib/
│   │   └── utils.ts              # Utility functions
│   └── types/
│       └── forensic.ts           # TypeScript interfaces
├── public/                       # Static assets
├── Dockerfile                    # Multi-stage Docker build
├── .env.example                  # Environment template
├── next.config.ts                # Next.js configuration (standalone output)
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## ⚙️ Configuration

### Thinking Mode Configuration

The Auditor agent uses Gemini 3's extended thinking capability for deep forensic analysis:

```typescript
config: {
  thinkingConfig: {
    thinkingLevel: ThinkingLevel.HIGH,
  },
  responseMimeType: "application/json",
}
```

### Supported File Types

| Type     | Formats        | Max Size            |
| -------- | -------------- | ------------------- |
| Video    | MP4, WebM, MOV | 2GB (via Files API) |
| Document | PDF            | 50MB                |

---

## 🐛 Troubleshooting

### Hydration Warning in Browser

If you see hydration errors mentioning `bis_skin_checked`, this is caused by browser extensions (like Bitdefender) modifying the DOM.

**Solutions:**

1. Test in Incognito mode (extensions disabled)
2. Disable the browser extension for localhost
3. Use a different browser

> This is not a bug in the application.

### API Key Issues

If you see "GEMINI_API_KEY environment variable is not set":

1. Ensure `.env.local` exists in the project root
2. Verify the key is correctly formatted (no quotes needed)
3. Restart the development server after changing env vars

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  Built with ❤️ using <a href="https://ai.google.dev/">Google Gemini 3</a>
</p>
