"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  Video,
  FileText,
  Brain,
  Clock,
  Target,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Contradiction } from "@/types/forensic";

interface ReasoningReplayProps {
  contradiction: Contradiction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReasoningReplay({
  contradiction,
  isOpen,
  onClose,
}: ReasoningReplayProps) {
  if (!contradiction) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400";
      case "major":
        return "text-orange-400";
      case "minor":
        return "text-yellow-400";
      default:
        return "text-zinc-400";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white";
      case "major":
        return "bg-orange-600 text-white";
      case "minor":
        return "bg-yellow-600 text-black";
      default:
        return "bg-zinc-600 text-white";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "spatial":
        return {
          icon: "🗺️",
          label: "Spatial Error",
          desc: "Physical positioning or location mismatch",
        };
      case "temporal":
        return {
          icon: "⏰",
          label: "Temporal Error",
          desc: "Timeline or timestamp inconsistency",
        };
      case "factual":
        return {
          icon: "📋",
          label: "Factual Error",
          desc: "Information contradiction",
        };
      case "specification":
        return {
          icon: "📐",
          label: "Specification Error",
          desc: "Technical spec violation",
        };
      default:
        return { icon: "❓", label: type, desc: "Unknown error type" };
    }
  };

  const typeInfo = getTypeLabel(contradiction.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <AlertTriangle
              className={`w-6 h-6 ${getSeverityColor(contradiction.severity)}`}
            />
            <span>Reasoning Replay</span>
            <Badge className={getSeverityBadge(contradiction.severity)}>
              {contradiction.severity.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 p-1">
            {/* Error Type Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-800/50 border border-zinc-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{typeInfo.icon}</span>
                <div>
                  <p className="font-semibold text-lg">{typeInfo.label}</p>
                  <p className="text-sm text-zinc-400">{typeInfo.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Target className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-400">
                  Confidence: {Math.round(contradiction.confidence * 100)}%
                </span>
              </div>
            </motion.div>

            {/* Evidence Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Video Evidence */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Video className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-purple-400">
                    Video Evidence
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3 text-sm text-zinc-400">
                  <Clock className="w-4 h-4" />
                  <span>Timestamp: {contradiction.videoTimestamp}</span>
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed">
                  {contradiction.videoObservation}
                </p>
              </motion.div>

              {/* PDF Evidence */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-orange-400" />
                  <span className="font-semibold text-orange-400">
                    PDF Documentation
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3 text-sm text-zinc-400">
                  <FileText className="w-4 h-4" />
                  <span>Page {contradiction.pdfPage}</span>
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed italic">
                  &ldquo;{contradiction.pdfClause}&rdquo;
                </p>
              </motion.div>
            </div>

            {/* AI Reasoning Chain */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-cyan-400">
                  AI Reasoning Chain
                </span>
              </div>
              <div className="relative pl-4 border-l-2 border-cyan-500/30">
                <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {contradiction.reasoning}
                </p>
              </div>
            </motion.div>

            {/* Confidence Meter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">
                  Contradiction Confidence
                </span>
                <span
                  className={`text-lg font-bold ${getSeverityColor(contradiction.severity)}`}
                >
                  {Math.round(contradiction.confidence * 100)}%
                </span>
              </div>
              <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${contradiction.confidence * 100}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={`h-full rounded-full ${
                    contradiction.confidence > 0.8
                      ? "bg-red-500"
                      : contradiction.confidence > 0.5
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                  }`}
                />
              </div>
            </motion.div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
