import { useState, useRef } from "react";
import { X, Copy } from "lucide-react";
import { toast } from "sonner";
import type { Issue } from "./TriageTable";

interface JiraModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
}

const JiraModal = ({ issue, isOpen, onClose }: JiraModalProps) => {
  const summaryRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  const handleCopyDraft = () => {
    const summary = summaryRef.current?.value || "";
    const description = descriptionRef.current?.value || "";
    const businessValue = `${issue.risk} / week`;

    const draftText = `Summary: ${summary}\n\nBusiness Value: ${businessValue}\n\nDescription:\n${description}`;

    navigator.clipboard.writeText(draftText).then(() => {
      toast.success("Jira draft copied", { description: "Paste into Jira to create the epic." });
      onClose();
    }).catch(() => {
      toast.error("Failed to copy", { description: "Try copying manually." });
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded border border-border shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">Jira Draft - Copy and Paste</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground border border-muted">
            Copy the information below and create the epic in Jira manually. This is a prototype; automated creation is planned.
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Summary</label>
            <input
              ref={summaryRef}
              type="text"
              defaultValue={`Fix ${issue.name}`}
              className="mt-1 w-full h-9 rounded border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Business Value</label>
            <input
              type="text"
              defaultValue={`${issue.risk} / week`}
              readOnly
              className="mt-1 w-full h-9 rounded border border-border bg-muted px-3 text-sm text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
            <textarea
              ref={descriptionRef}
              rows={8}
              defaultValue={`Revenue Impact: ${issue.risk}/week\nTraffic: ${issue.traffic} | Conv Drop: ${issue.drop} | AOV: ${issue.aov}\n\nCustomer Quotes:\n${issue.quotes.map((q) => `- "${q}"`).join("\n")}`}
              className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCopyDraft}
            className="h-9 px-5 rounded bg-amazon-orange text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Copy size={14} />
            Copy Jira Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default JiraModal;
