import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Lazy-initialize AI client to avoid build-time API key requirement
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
}

// Prompts for each agent
const WATCHER_PROMPT = `You are "The Watcher" - a forensic video analysis agent.

Analyze this video thoroughly and extract:
1. All visible text (signs, documents, labels, screens)
2. Spoken words and dialogue (transcription)
3. Timestamps of significant events
4. Spatial details (locations, positions of objects, lighting, shadows)
5. Physical characteristics of objects and environments
6. Any measurements, quantities, or specifications visible

For each observation, provide:
- Exact timestamp (format: HH:MM:SS)
- Detailed description
- Confidence level (0-1)

Output as JSON:
{
  "observations": [
    {
      "timestamp": "00:00:00",
      "type": "text|speech|spatial|object|measurement",
      "description": "detailed observation",
      "confidence": 0.95
    }
  ],
  "summary": "overall video summary"
}`;

const AUDITOR_PROMPT = `You are "The Auditor" - a forensic cross-reference analysis agent.

You have received:
1. A PDF document containing technical specifications, requirements, or claims
2. Video analysis results from "The Watcher"

Your task is to perform a DEEP forensic audit:

CRITICAL: Detect ALL contradictions between the video evidence and the PDF document, including:
- SPATIAL errors: Physical positions, dimensions, or layouts that don't match specs
- TEMPORAL errors: Shadows, lighting, or time indicators that contradict claimed times
- FACTUAL errors: Claims in the PDF that are contradicted by video evidence
- SPECIFICATION errors: Components or measurements that violate technical specs

For EACH contradiction found:
1. Cite the EXACT video timestamp
2. Cite the EXACT PDF page number and clause text
3. Explain the reasoning chain that proves the contradiction
4. Rate severity (critical/major/minor)
5. Provide confidence score (0-1)

Also identify facts that are VERIFIED (PDF claims that ARE supported by video evidence).

Output as JSON:
{
  "summary": "overall audit summary",
  "contradictions": [
    {
      "id": "C001",
      "severity": "critical|major|minor",
      "type": "spatial|temporal|factual|specification",
      "videoTimestamp": "00:00:00",
      "pdfPage": 1,
      "pdfClause": "exact text from PDF",
      "videoObservation": "what was observed in video",
      "reasoning": "detailed reasoning chain explaining the contradiction",
      "confidence": 0.95
    }
  ],
  "verifiedFacts": [
    {
      "id": "V001",
      "videoTimestamp": "00:00:00",
      "pdfPage": 1,
      "description": "what was verified",
      "evidence": "supporting evidence"
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get("video") as File | null;
    const pdfFile = formData.get("pdf") as File | null;

    if (!videoFile || !pdfFile) {
      return NextResponse.json(
        { error: "Both video and PDF files are required" },
        { status: 400 },
      );
    }

    // Create readable stream for response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ event, data })}\n\n`),
          );
        };

        try {
          // Initialize AI client
          const ai = getAIClient();

          // Upload files to Gemini
          sendEvent("status", {
            message: "Uploading files to Gemini...",
            progress: 10,
          });

          const videoBuffer = await videoFile.arrayBuffer();
          const pdfBuffer = await pdfFile.arrayBuffer();

          const uploadedVideo = await ai.files.upload({
            file: new Blob([videoBuffer], { type: videoFile.type }),
            config: { mimeType: videoFile.type },
          });

          sendEvent("status", { message: "Video uploaded", progress: 30 });

          const uploadedPdf = await ai.files.upload({
            file: new Blob([pdfBuffer], { type: pdfFile.type }),
            config: { mimeType: pdfFile.type },
          });

          sendEvent("status", { message: "PDF uploaded", progress: 50 });

          // Wait for files to be processed
          let videoFileState = await ai.files.get({
            name: uploadedVideo.name!,
          });
          while (videoFileState.state === "PROCESSING") {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            videoFileState = await ai.files.get({ name: uploadedVideo.name! });
          }

          let pdfFileState = await ai.files.get({ name: uploadedPdf.name! });
          while (pdfFileState.state === "PROCESSING") {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            pdfFileState = await ai.files.get({ name: uploadedPdf.name! });
          }

          sendEvent("status", { message: "Files processed", progress: 60 });

          // Agent 1: The Watcher - Video Analysis with Gemini Flash
          sendEvent("thinking", {
            agent: "watcher",
            phase: "analyzing",
            content: "Initializing video analysis with Gemini 3 Flash...",
          });

          const watcherResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
              {
                role: "user",
                parts: [
                  {
                    fileData: {
                      fileUri: uploadedVideo.uri!,
                      mimeType: videoFile.type,
                    },
                  },
                  { text: WATCHER_PROMPT },
                ],
              },
            ],
          });

          const videoAnalysis = watcherResponse.text || "";

          sendEvent("thinking", {
            agent: "watcher",
            phase: "concluding",
            content: `Video analysis complete. Extracted observations from the video evidence.`,
          });

          sendEvent("status", {
            message: "Video analysis complete",
            progress: 75,
          });

          // Agent 2: The Auditor - Cross-Reference with Gemini Pro (Thinking)
          sendEvent("thinking", {
            agent: "auditor",
            phase: "analyzing",
            content:
              "Initializing forensic audit with Gemini 3 Pro (thinking: high)...",
          });

          const auditorResponse = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: [
              {
                role: "user",
                parts: [
                  {
                    fileData: {
                      fileUri: uploadedPdf.uri!,
                      mimeType: pdfFile.type,
                    },
                  },
                  {
                    text: `VIDEO ANALYSIS RESULTS:\n${videoAnalysis}\n\n---\n\n${AUDITOR_PROMPT}`,
                  },
                ],
              },
            ],
            config: {
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.HIGH,
              },
              responseMimeType: "application/json",
            },
          });

          sendEvent("thinking", {
            agent: "auditor",
            phase: "cross-referencing",
            content: "Comparing video evidence against PDF documentation...",
          });

          const auditResultText = auditorResponse.text || "{}";
          let auditResult;

          try {
            auditResult = JSON.parse(auditResultText);
          } catch {
            auditResult = {
              summary: "Analysis complete",
              contradictions: [],
              verifiedFacts: [],
            };
          }

          sendEvent("thinking", {
            agent: "auditor",
            phase: "concluding",
            content: `Forensic audit complete. Found ${auditResult.contradictions?.length || 0} contradictions and ${auditResult.verifiedFacts?.length || 0} verified facts.`,
          });

          sendEvent("status", {
            message: "Forensic audit complete",
            progress: 100,
          });

          // Send final results
          sendEvent("result", auditResult);

          controller.close();
        } catch (error) {
          console.error("Analysis error:", error);
          sendEvent("error", {
            message:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
