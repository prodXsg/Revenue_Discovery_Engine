import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import type { Issue } from "./TriageTable";

interface JiraModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
}

const JiraModal = ({ issue, isOpen, onClose }: JiraModalProps) => {
  const [pushed, setPushed] = useState(false);

  if (!isOpen) return null;

  const handlePush = () => {
    setPushed(true);
    setTimeout(() => {
      setPushed(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded border border-border shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {pushed ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <CheckCircle2 size={48} className="text-success-green mb-4" />
            <p className="text-lg font-bold text-foreground">Epic Created: ECO-4092</p>
            <p className="text-sm text-muted-foreground mt-1">Syncing with Jira...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Create Issue — Project: E-COMMERCE</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Issue Type</label>
                <select className="mt-1 w-full h-9 rounded border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  <option>Epic</option>
                  <option>Story</option>
                  <option>Bug</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Summary</label>
                <input
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
                  rows={4}
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
                onClick={handlePush}
                className="h-9 px-5 rounded bg-amazon-orange text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Push to Jira
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JiraModal;
