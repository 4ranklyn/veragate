"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Video,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Contradiction, VerifiedFact } from "@/types/forensic";

interface ContradictionFeedProps {
  contradictions: Contradiction[];
  verifiedFacts: VerifiedFact[];
  onContradictionClick: (contradiction: Contradiction) => void;
}

export function ContradictionFeed({
  contradictions,
  verifiedFacts,
  onContradictionClick,
}: ContradictionFeedProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 border-red-500/50 text-red-400";
      case "major":
        return "bg-orange-500/20 border-orange-500/50 text-orange-400";
      case "minor":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
      default:
        return "bg-zinc-500/20 border-zinc-500/50 text-zinc-400";
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
        return "🗺️ Spatial";
      case "temporal":
        return "⏰ Temporal";
      case "factual":
        return "📋 Factual";
      case "specification":
        return "📐 Specification";
      default:
        return type;
    }
  };

  const totalItems = contradictions.length + verifiedFacts.length;

  return (
    <Card className="h-full border-zinc-700 bg-zinc-900/50 backdrop-blur-sm flex flex-col overflow-hidden">
      <CardHeader className="pb-3 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Contradiction Feed
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="destructive" className="bg-red-600">
              {contradictions.length} Issues
            </Badge>
            <Badge variant="secondary" className="bg-emerald-600 text-white">
              {verifiedFacts.length} Verified
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {totalItems === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="w-12 h-12 text-zinc-600 mb-4" />
                <p className="text-zinc-500 text-sm">
                  Waiting for analysis results...
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {/* Contradictions */}
                {contradictions.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onContradictionClick(item)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${getSeverityColor(
                      item.severity,
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <Badge className={getSeverityBadge(item.severity)}>
                          {item.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(item.type)}
                        </Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    </div>

                    <p className="text-sm text-zinc-200 mb-3 line-clamp-2">
                      {item.videoObservation}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {item.videoTimestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Page {item.pdfPage}
                      </span>
                      <span className="ml-auto">
                        {Math.round(item.confidence * 100)}% confidence
                      </span>
                    </div>
                  </motion.div>
                ))}

                {/* Verified Facts */}
                {verifiedFacts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: (contradictions.length + index) * 0.1,
                    }}
                    className="p-4 rounded-lg border bg-emerald-500/10 border-emerald-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <Badge className="bg-emerald-600 text-white">
                        VERIFIED
                      </Badge>
                    </div>

                    <p className="text-sm text-zinc-200 mb-3">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {item.videoTimestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Page {item.pdfPage}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
