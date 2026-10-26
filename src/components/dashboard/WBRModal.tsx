import { X, Printer, FileText } from "lucide-react";
import { appConfig } from "@/config/app";
import type { Issue } from "./TriageTable";

interface WBRModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
}

const WBRModal = ({ issue, isOpen, onClose }: WBRModalProps) => {
  if (!isOpen) return null;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div
        className="bg-card w-[820px] max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl border border-border scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-amazon-orange" />
            <span className="text-sm font-bold text-foreground tracking-tight">Weekly Business Review</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="h-8 px-4 rounded bg-squid-ink text-secondary-foreground text-sm font-semibold flex items-center gap-2 hover:bg-squid-ink-light transition-colors"
            >
              <Printer size={14} />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* A4-Style Content */}
        <div className="px-10 py-8 space-y-8">
          {/* Header Block */}
          <div className="border-b-2 border-amazon-orange pb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider mb-4">
              <span>{appConfig.workspace.name}</span>
              <span>Weekly Business Review (WBR)</span>
              <span>Date: {today}</span>
              <span>Owner: {appConfig.workspace.user}</span>
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Friction Triage: {issue.name}
            </h1>
          </div>

          {/* Section 1: Revenue Impact */}
          <div>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-risk-red/10 text-risk-red text-xs font-bold flex items-center justify-center">1</span>
              Revenue Impact Assessment
            </h2>
            <div className="bg-surface-critical/50 border border-risk-red/20 rounded-lg p-5">
              <p className="text-2xl font-bold text-risk-red mb-2">{issue.risk} / week</p>
              <p className="text-sm text-foreground leading-relaxed">
                <span className="font-semibold">Impact Sizing:</span> Based on deterministic telemetry calculation
                [Traffic × Conversion Drop % × AOV]. This figure represents the weekly revenue leakage
                attributable to this friction theme across the affected user segment.
              </p>
              <div className="mt-3 flex items-center gap-6 text-xs text-muted-foreground font-mono">
                <span>Traffic: {issue.traffic}</span>
                <span>Conv Drop: {issue.drop}</span>
                <span>AOV: {issue.aov}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Root Cause */}
          <div>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-amazon-orange/10 text-amazon-orange text-xs font-bold flex items-center justify-center">2</span>
              Root Cause Analysis
            </h2>
            <div className="bg-muted/30 border border-border rounded-lg p-5">
              <p className="text-sm text-foreground leading-relaxed">
                {issue.rootCause || "No root cause analysis available."}
              </p>
            </div>
          </div>

          {/* Section 3: Voice of Customer */}
          <div>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center">3</span>
              Voice of Customer — Verbatim Quotes
            </h2>
            <div className="bg-muted/30 border border-border rounded-lg p-5">
              {issue.quotes.length > 0 ? (
                <ul className="space-y-3">
                  {issue.quotes.map((q, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-amazon-orange font-bold text-sm mt-0.5">•</span>
                      <p className="text-sm text-foreground italic leading-relaxed">"{q}"</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No customer quotes available.</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border pt-4 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
            <span>Prototype. Sample data. Not for distribution.</span>
            <span>Discovery Engine</span>
            <span>{today}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WBRModal;
