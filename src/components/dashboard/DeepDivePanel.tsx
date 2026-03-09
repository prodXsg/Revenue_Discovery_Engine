import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { MessageSquareQuote, Sparkles } from "lucide-react";
import type { Issue } from "./TriageTable";

interface DeepDivePanelProps {
  issue: Issue;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateJira: () => void;
}

const defaultChartData = [
  { day: "Mon", tickets: 2, conversion: 3.8 },
  { day: "Tue", tickets: 3, conversion: 3.6 },
  { day: "Wed", tickets: 5, conversion: 3.3 },
  { day: "Thu", tickets: 8, conversion: 2.9 },
  { day: "Fri", tickets: 12, conversion: 2.4 },
  { day: "Sat", tickets: 18, conversion: 2.0 },
  { day: "Sun", tickets: 24, conversion: 1.6 },
];

const DeepDivePanel = ({ issue, activeTab, onTabChange, onCreateJira }: DeepDivePanelProps) => {
  const tabs = ["Correlation Overview", "Voice of Customer"];
  const chartData = issue.chartData || defaultChartData;

  const trafficNum = parseInt(issue.traffic.replace(/,/g, ""));
  const dropNum = Math.abs(parseFloat(issue.drop));
  const aovNum = parseInt(issue.aov.replace(/[₹,]/g, ""));

  return (
    <div className="bg-card rounded border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-foreground tracking-tight">{issue.name}</h2>
          <span className="inline-block px-2.5 py-1 rounded text-xs font-bold bg-amazon-orange text-primary-foreground">
            {issue.risk} / week
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 border-b border-border flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amazon-orange rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5">
        {activeTab === "Correlation Overview" ? (
          <div className="grid grid-cols-3 gap-4">
            {/* Col 1: Formula */}
            <div className="bg-terminal-bg rounded-lg p-5 text-sm font-mono">
              <p className="text-amazon-orange font-bold text-xs mb-4 tracking-wide">Formula Applied:</p>
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
                  = {trafficNum.toLocaleString()} × {(dropNum / 100).toFixed(4)} × {aovNum.toLocaleString()} = ₹{issue.riskRaw.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Col 2: Chart */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Ticket Spike vs Conversion Drop</p>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="tickets" fill="hsl(33, 100%, 50%)" name="Tickets" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="hsl(0, 84%, 60%)" name="Conv %" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Col 3: Insights */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-amazon-orange" />
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide">Discovered Root Cause & Insights</p>
                </div>
                <div className="bg-background border border-border rounded-lg p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {issue.rootCause || "No root cause analysis available for this issue."}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amazon-orange/10 text-amazon-orange font-semibold">AI Generated</span>
                    <span className="text-[10px] text-muted-foreground">Confidence: High</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onCreateJira}
                className="w-full mt-4 py-3 rounded bg-squid-ink text-secondary-foreground font-semibold text-sm hover:bg-squid-ink-light transition-colors"
              >
                Generate Jira Epic
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {issue.quotes.map((q, i) => (
              <div key={i} className="border border-border rounded-lg p-4 bg-background">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepDivePanel;
