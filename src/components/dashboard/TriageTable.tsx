import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface Issue {
  id: number;
  name: string;
  risk: string;
  riskRaw: number;
  vol: number;
  status: string;
  trend: string;
  traffic: string;
  drop: string;
  aov: string;
  quotes: string[];
}

interface TriageTableProps {
  issues: Issue[];
  selectedId: number;
  onSelect: (issue: Issue) => void;
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Critical: "bg-risk-red text-primary-foreground",
    High: "bg-amazon-orange text-primary-foreground",
    Muted: "bg-muted text-muted-foreground",
  };
  return map[status] || "bg-muted text-muted-foreground";
};

const rowBg = (status: string, selected: boolean) => {
  if (selected) return "bg-primary/5 ring-1 ring-inset ring-primary/20";
  const map: Record<string, string> = {
    Critical: "bg-surface-critical hover:bg-red-50",
    High: "bg-surface-warning hover:bg-orange-50",
    Muted: "bg-surface-muted hover:bg-muted",
  };
  return map[status] || "";
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp size={14} className="text-risk-red" />;
  if (trend === "down") return <TrendingDown size={14} className="text-success-green" />;
  return <Minus size={14} className="text-muted-foreground" />;
};

// Mini sparkline bars
const Sparkline = ({ trend }: { trend: string }) => {
  const heights = trend === "up" ? [20, 35, 30, 50, 70, 90] : trend === "down" ? [80, 60, 50, 40, 30, 20] : [40, 42, 38, 40, 41, 39];
  const color = trend === "up" ? "bg-risk-red" : trend === "down" ? "bg-success-green" : "bg-muted-foreground/40";
  return (
    <div className="flex items-end gap-[2px] h-5">
      {heights.map((h, i) => (
        <div key={i} className={`w-[4px] rounded-sm ${color}`} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
};

const TriageTable = ({ issues, selectedId, onSelect }: TriageTableProps) => {
  return (
    <div className="bg-card rounded border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Triage Queue</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
            <th className="text-left px-5 py-2.5 font-medium">Priority</th>
            <th className="text-left px-5 py-2.5 font-medium">Theme Name</th>
            <th className="text-right px-5 py-2.5 font-medium">Tickets</th>
            <th className="text-right px-5 py-2.5 font-medium">Revenue Risk</th>
            <th className="text-center px-5 py-2.5 font-medium">Trend</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, idx) => (
            <tr
              key={issue.id}
              onClick={() => onSelect(issue)}
              className={`cursor-pointer transition-colors border-b border-border last:border-0 ${rowBg(issue.status, selectedId === issue.id)} ${issue.status === "Muted" ? "opacity-60" : ""}`}
            >
              <td className="px-5 py-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${statusBadge(issue.status)}`}>
                  {issue.status === "Critical" ? "P0" : issue.status === "High" ? "P1" : "Muted"}
                </span>
              </td>
              <td className="px-5 py-3 font-medium text-foreground max-w-xs truncate">{issue.name}</td>
              <td className="px-5 py-3 text-right font-mono text-foreground">{issue.vol}</td>
              <td className="px-5 py-3 text-right font-mono font-semibold text-foreground">{issue.risk}</td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-center gap-2">
                  <Sparkline trend={issue.trend} />
                  <TrendIcon trend={issue.trend} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TriageTable;
