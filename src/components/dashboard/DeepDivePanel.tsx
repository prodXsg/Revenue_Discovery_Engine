import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { MessageSquareQuote, Sparkles, Check, VolumeX, Info, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Issue } from "./TriageTable";

interface DeepDivePanelProps {
  issue: Issue;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateJira: () => void;
  onExportWBR: () => void;
  onResolve: () => void;
  onMute: () => void;
}

const generateChartData = (issueId: number) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const seed = issueId * 7;
  return days.map((day, i) => {
    const noise = ((seed + i * 13) % 7) - 3;
    const tickets = Math.max(1, Math.round(3 + i * (2 + (seed % 4)) + noise));
    const conversion = Math.max(0.5, parseFloat((4.2 - i * (0.3 + (seed % 3) * 0.1) + noise * 0.1).toFixed(1)));
    return { day, tickets, conversion };
  });
};

const DeepDivePanel = ({ issue, activeTab, onTabChange, onCreateJira, onExportWBR, onResolve, onMute }: DeepDivePanelProps) => {
  const tabs = ["Correlation Overview", "Voice of Customer"];
  const chartData = issue.chartData || generateChartData(issue.id);

  const trafficNum = parseInt(issue.traffic?.replace(/,/g, "") || "0");
  const dropNum = Math.abs(parseFloat(issue.drop || "0"));
  const aovNum = parseInt(issue.aov?.replace(/[₹,]/g, "") || "0");

  const isResolved = issue.status === "Resolved";

  return (
    <div className="bg-card rounded border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-foreground tracking-tight">{issue.name}</h2>
          <span className="inline-block px-2.5 py-1 rounded text-xs font-bold bg-amazon-orange text-primary-foreground">
            {issue.risk} / week
          </span>
        </div>
      </div>

      <div className="px-5 border-b border-border flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amazon-orange rounded-t" />
            )}
          </button>
        ))}
      </div>

      <div className="p-5">
        {activeTab === "Correlation Overview" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-terminal-bg rounded-lg p-5 text-sm font-mono">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-amazon-orange font-bold text-xs mb-4 tracking-wide cursor-help border-b border-dashed border-amazon-orange/40 inline-block pb-0.5">
                        Formula Applied:
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs">
                      Deterministic math calculated securely on localhost to prevent LLM hallucination.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <p className="text-secondary-foreground text-[13px] leading-relaxed">
                  <span className="text-muted-foreground/70">[</span>Traffic<span className="text-muted-foreground/70">]</span>
                  <span className="text-amazon-orange mx-1">×</span>
                  <span className="text-muted-foreground/70">[</span>Conv. Drop %<span className="text-muted-foreground/70">]</span>
                  <span className="text-amazon-orange mx-1">×</span>
                  <span className="text-muted-foreground/70">[</span>AOV<span className="text-muted-foreground/70">]</span>
                </p>
                <div className="border-t border-squid-ink-light mt-4 pt-4 space-y-1.5 text-xs">
                  <p className="text-muted-foreground/60">Traffic: <span className="text-secondary-foreground font-medium">{issue.traffic}</span></p>
                  <p className="text-muted-foreground/60">Conv Drop: <span className="text-secondary-foreground font-medium">{dropNum}%</span></p>
                  <p className="text-muted-foreground/60">AOV: <span className="text-secondary-foreground font-medium">{issue.aov}</span></p>
                  <p className="text-amazon-orange mt-3 text-sm font-bold">
                    = {trafficNum.toLocaleString("en-IN")} × {(dropNum / 100).toFixed(4)} × {aovNum.toLocaleString("en-IN")} = ₹{issue.riskRaw.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Ticket Spike vs Conversion Drop</p>
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 4 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="tickets" fill="hsl(33, 100%, 50%)" name="Tickets" radius={[2, 2, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="hsl(0, 84%, 60%)" name="Conv %" strokeWidth={2} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-amazon-orange" />
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">Discovered Root Cause & Insights</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={13} className="text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs">
                      This is an AI-generated insight based on semantic clustering. Please verify raw quotes before execution.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {issue.rootCause || "No root cause analysis available for this issue."}
              </p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amazon-orange/10 text-amazon-orange font-semibold flex items-center gap-1">
                    <Sparkles size={10} /> AI-Generated Insight
                  </span>
                  <span className="text-[10px] text-muted-foreground">• Confidence: <span className="font-bold text-success-green bg-success-green/10 px-1.5 py-0.5 rounded">High</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onMute}
                    className="py-2 px-4 rounded text-muted-foreground font-medium text-sm hover:bg-muted/60 transition-colors flex items-center gap-1.5"
                  >
                    <VolumeX size={14} />
                    Mute Theme
                  </button>

                  {isResolved ? (
                    <button
                      onClick={onResolve}
                      className="py-2 px-4 rounded text-amazon-orange font-medium text-sm hover:bg-amazon-orange/10 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw size={14} />
                      Reopen Issue
                    </button>
                  ) : (
                    <button
                      onClick={onResolve}
                      className="py-2 px-4 rounded text-success-green font-medium text-sm hover:bg-success-green/10 transition-colors flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      Mark Resolved
                    </button>
                  )}

                  <button
                    onClick={onExportWBR}
                    className="py-2 px-4 rounded border border-squid-ink text-foreground font-semibold text-sm hover:bg-muted transition-colors"
                  >
                    📄 Export WBR 1-Pager
                  </button>
                  <button
                    onClick={onCreateJira}
                    className="py-2.5 px-5 rounded bg-squid-ink text-secondary-foreground font-semibold text-sm hover:bg-squid-ink-light transition-colors"
                  >
                    Generate Jira Epic
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {issue.quotes.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-12">
                <MessageSquareQuote size={32} className="text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No customer quotes available for this issue.</p>
              </div>
            ) : (
              issue.quotes.map((q, i) => (
                <div key={i} className="border border-border rounded-lg p-4 bg-background hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <MessageSquareQuote size={16} className="text-amazon-orange mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground italic">"{q}"</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-muted-foreground">{i === 0 ? "2 hours ago" : "5 hours ago"}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">Source: Zendesk</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepDivePanel;
