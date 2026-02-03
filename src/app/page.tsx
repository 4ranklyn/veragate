"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Brain } from "lucide-react";
import { Dropzone } from "@/components/dropzone";
import { ThinkingLog } from "@/components/thinking-log";
import { ContradictionFeed } from "@/components/contradiction-feed";
import { ReasoningReplay } from "@/components/reasoning-replay";
import type {
  UploadedFile,
  ThinkingEntry,
  Contradiction,
  VerifiedFact,
  AnalysisState,
} from "@/types/forensic";

export default function Home() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: "idle",
    progress: 0,
    currentAgent: null,
  });
  const [thinkingLog, setThinkingLog] = useState<ThinkingEntry[]>([]);
  const [contradictions, setContradictions] = useState<Contradiction[]>([]);
  const [verifiedFacts, setVerifiedFacts] = useState<VerifiedFact[]>([]);
  const [selectedContradiction, setSelectedContradiction] =
    useState<Contradiction | null>(null);
  const [isReplayOpen, setIsReplayOpen] = useState(false);

  const handleFilesSelected = useCallback(async (files: UploadedFile[]) => {
    const videoFile = files.find((f) => f.type === "video");
    const pdfFile = files.find((f) => f.type === "pdf");

    if (!videoFile || !pdfFile) return;

    // Reset state
    setThinkingLog([]);
    setContradictions([]);
    setVerifiedFacts([]);
    setAnalysisState({ status: "uploading", progress: 0, currentAgent: null });

    try {
      // Create FormData with actual files
      const fileInput = document.getElementById(
        "file-input",
      ) as HTMLInputElement;
      if (!fileInput?.files) return;

      const formData = new FormData();
      Array.from(fileInput.files).forEach((file) => {
        if (file.type.startsWith("video/")) {
          formData.append("video", file);
        } else if (file.type === "application/pdf") {
          formData.append("pdf", file);
        }
      });

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text
          .split("\n")
          .filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));

            switch (data.event) {
              case "status":
                setAnalysisState((prev) => ({
                  ...prev,
                  status: "analyzing",
                  progress: data.data.progress,
                }));
                break;

              case "thinking":
                setAnalysisState((prev) => ({
                  ...prev,
                  currentAgent: data.data.agent,
                }));
                setThinkingLog((prev) => [
                  ...prev,
                  {
                    agent: data.data.agent,
                    content: data.data.content,
                    timestamp: new Date(),
                    phase: data.data.phase,
                  },
                ]);
                break;

              case "result":
                setContradictions(data.data.contradictions || []);
                setVerifiedFacts(data.data.verifiedFacts || []);
                setAnalysisState({
                  status: "complete",
                  progress: 100,
                  currentAgent: null,
                });
                break;

              case "error":
                setAnalysisState({
                  status: "error",
                  progress: 0,
                  currentAgent: null,
                  error: data.data.message,
                });
                break;
            }
          } catch {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    } catch (error) {
      setAnalysisState({
        status: "error",
        progress: 0,
        currentAgent: null,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, []);

  const handleContradictionClick = useCallback(
    (contradiction: Contradiction) => {
      setSelectedContradiction(contradiction);
      setIsReplayOpen(true);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-zinc-950 to-cyan-900/20 pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  VeraGate
                </h1>
                <p className="text-sm text-zinc-500">
                  Multimodal Forensic Audit Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Gemini 3 Flash</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>Gemini 3 Pro (Thinking)</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {/* Left Column - Dropzone */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Dropzone
              onFilesSelected={handleFilesSelected}
              isUploading={
                analysisState.status === "uploading" ||
                analysisState.status === "analyzing"
              }
              uploadProgress={analysisState.progress}
            />
          </motion.div>

          {/* Middle Column - Thinking Log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <ThinkingLog
              entries={thinkingLog}
              isActive={analysisState.status === "analyzing"}
              currentAgent={analysisState.currentAgent}
            />
          </motion.div>

          {/* Right Column - Contradiction Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <ContradictionFeed
              contradictions={contradictions}
              verifiedFacts={verifiedFacts}
              onContradictionClick={handleContradictionClick}
            />
          </motion.div>
        </div>

        {/* Status Bar */}
        {analysisState.status !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-zinc-900/90 border border-zinc-700 backdrop-blur-sm shadow-xl"
          >
            <div className="flex items-center gap-4">
              {analysisState.status === "analyzing" && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-3 h-3 rounded-full bg-emerald-400"
                  />
                  <span className="text-sm text-zinc-300">
                    Analyzing... {analysisState.progress}%
                  </span>
                </>
              )}
              {analysisState.status === "complete" && (
                <>
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-sm text-zinc-300">
                    Analysis complete • {contradictions.length} contradictions
                    found
                  </span>
                </>
              )}
              {analysisState.status === "error" && (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="text-sm text-red-400">
                    Error: {analysisState.error}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Reasoning Replay Modal */}
      <ReasoningReplay
        contradiction={selectedContradiction}
        isOpen={isReplayOpen}
        onClose={() => setIsReplayOpen(false)}
      />
    </div>
  );
}
