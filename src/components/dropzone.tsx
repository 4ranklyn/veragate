"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileVideo, FileText, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { UploadedFile } from "@/types/forensic";

interface DropzoneProps {
  onFilesSelected: (files: UploadedFile[]) => void;
  isUploading: boolean;
  uploadProgress: number;
}

export function Dropzone({
  onFilesSelected,
  isUploading,
  uploadProgress,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = [];

    Array.from(fileList).forEach((file) => {
      if (
        file.type.startsWith("video/") ||
        file.type === "video/mp4" ||
        file.type === "video/webm" ||
        file.type === "video/quicktime"
      ) {
        newFiles.push({
          name: file.name,
          type: "video",
          size: file.size,
          mimeType: file.type,
        });
      } else if (file.type === "application/pdf") {
        newFiles.push({
          name: file.name,
          type: "pdf",
          size: file.size,
          mimeType: file.type,
        });
      }
    });

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
    },
    [processFiles],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAnalyze = useCallback(() => {
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [files, onFilesSelected]);

  const hasVideo = files.some((f) => f.type === "video");
  const hasPdf = files.some((f) => f.type === "pdf");
  const canAnalyze = hasVideo && hasPdf && !isUploading;

  return (
    <Card className="h-full border-2 border-dashed border-zinc-700 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            Evidence Upload
          </h2>
          <div className="flex gap-2">
            <Badge
              variant={hasVideo ? "default" : "secondary"}
              className={hasVideo ? "bg-emerald-600" : ""}
            >
              Video {hasVideo ? "✓" : "Required"}
            </Badge>
            <Badge
              variant={hasPdf ? "default" : "secondary"}
              className={hasPdf ? "bg-emerald-600" : ""}
            >
              PDF {hasPdf ? "✓" : "Required"}
            </Badge>
          </div>
        </div>

        <motion.div
          className={`flex-1 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 cursor-pointer ${
            isDragging
              ? "border-emerald-400 bg-emerald-400/10"
              : "border-zinc-600 hover:border-zinc-500 hover:bg-zinc-800/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            id="file-input"
            type="file"
            multiple
            accept="video/*,application/pdf"
            onChange={handleFileInput}
            className="hidden"
          />

          <motion.div
            animate={{ y: isDragging ? -10 : 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
              <Upload
                className={`w-10 h-10 ${isDragging ? "text-emerald-400" : "text-zinc-400"}`}
              />
            </div>
            <p className="text-lg font-medium text-white mb-2">
              Drop your evidence files here
            </p>
            <p className="text-sm text-zinc-400">
              Upload a video file and PDF document for forensic analysis
            </p>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2"
            >
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    {file.type === "video" ? (
                      <FileVideo className="w-5 h-5 text-purple-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-orange-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1 rounded-md hover:bg-zinc-700 transition-colors"
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span className="text-sm text-zinc-400">
                Uploading to Gemini...
              </span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </motion.div>
        )}

        <motion.button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className={`mt-4 w-full py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
            canAnalyze
              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/25"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
          whileHover={canAnalyze ? { scale: 1.02 } : {}}
          whileTap={canAnalyze ? { scale: 0.98 } : {}}
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </span>
          ) : (
            "🔍 Begin Forensic Analysis"
          )}
        </motion.button>
      </CardContent>
    </Card>
  );
}
