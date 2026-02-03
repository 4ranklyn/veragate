// Forensic Audit Types for VeraGate

export interface ForensicAuditResult {
  summary: string;
  contradictions: Contradiction[];
  verifiedFacts: VerifiedFact[];
  thinkingLog: ThinkingEntry[];
  processingTime: number;
}

export interface Contradiction {
  id: string;
  severity: "critical" | "major" | "minor";
  videoTimestamp: string;
  pdfPage: number;
  pdfClause: string;
  videoObservation: string;
  reasoning: string;
  type: "spatial" | "temporal" | "factual" | "specification";
  confidence: number;
}

export interface VerifiedFact {
  id: string;
  videoTimestamp: string;
  pdfPage: number;
  description: string;
  evidence: string;
}

export interface ThinkingEntry {
  agent: "watcher" | "auditor";
  content: string;
  timestamp: Date;
  phase: "analyzing" | "cross-referencing" | "concluding";
}

export interface UploadedFile {
  name: string;
  type: "video" | "pdf";
  size: number;
  uri?: string;
  mimeType: string;
}

export interface AnalysisState {
  status: "idle" | "uploading" | "analyzing" | "complete" | "error";
  progress: number;
  currentAgent: "watcher" | "auditor" | null;
  error?: string;
}
