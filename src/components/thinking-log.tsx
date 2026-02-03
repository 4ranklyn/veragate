"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Eye, Sparkles, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { ThinkingEntry } from "@/types/forensic";

interface ThinkingLogProps {
  entries: ThinkingEntry[];
  isActive: boolean;
  currentAgent: "watcher" | "auditor" | null;
}

export function ThinkingLog({
  entries,
  isActive,
  currentAgent,
}: ThinkingLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const getAgentIcon = (agent: "watcher" | "auditor") => {
    return agent === "watcher" ? (
      <Eye className="w-4 h-4" />
    ) : (
      <Brain className="w-4 h-4" />
    );
  };

  const getAgentColor = (agent: "watcher" | "auditor") => {
    return agent === "watcher" ? "text-purple-400" : "text-cyan-400";
  };

  const getAgentBg = (agent: "watcher" | "auditor") => {
    return agent === "watcher"
      ? "bg-purple-500/10 border-purple-500/30"
      : "bg-cyan-500/10 border-cyan-500/30";
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case "analyzing":
        return "Analyzing";
      case "cross-referencing":
        return "Cross-Referencing";
      case "concluding":
        return "Concluding";
      default:
        return phase;
    }
  };

  return (
    <Card className="h-full border-zinc-700 bg-zinc-900/50 backdrop-blur-sm flex flex-col overflow-hidden">
      <CardHeader className="pb-3 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            AI Thinking Log
          </CardTitle>
          {isActive && currentAgent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <Badge
                variant="outline"
                className={`${getAgentColor(currentAgent)} border-current animate-pulse`}
              >
                {currentAgent === "watcher" ? "The Watcher" : "The Auditor"}
              </Badge>
            </motion.div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="p-4 space-y-3">
            {entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="w-12 h-12 text-zinc-600 mb-4" />
                <p className="text-zinc-500 text-sm">
                  Upload evidence files to see AI reasoning
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {entries.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${getAgentBg(entry.agent)}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={getAgentColor(entry.agent)}>
                        {getAgentIcon(entry.agent)}
                      </span>
                      <span
                        className={`text-sm font-semibold ${getAgentColor(entry.agent)}`}
                      >
                        {entry.agent === "watcher"
                          ? "The Watcher"
                          : "The Auditor"}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-zinc-800 text-zinc-400"
                      >
                        {getPhaseLabel(entry.phase)}
                      </Badge>
                      <span
                        className="text-xs text-zinc-600 ml-auto"
                        suppressHydrationWarning
                      >
                        {mounted
                          ? new Date(entry.timestamp).toLocaleTimeString()
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-zinc-500"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 rounded-full bg-emerald-400"
                />
                <span className="text-sm">Thinking...</span>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
