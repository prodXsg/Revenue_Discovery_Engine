import { TrendingUp, TrendingDown, Minus, SearchX } from "lucide-react";

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
  rootCause?: string;
  chartData?: { day: string; tickets: number; conversion: number }[];
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
    Resolved: "bg-success-green text-primary-foreground",
  };
  return map[status] || "bg-muted text-muted-foreground";
};

const rowBg = (status: string, selected: boolean) => {
  if (selected) return "bg-muted/60 border-l-[3px] border-l-amazon-orange font-semibold";
  const map: Record<string, string> = {
    Critical: "bg-surface-critical hover:bg-surface-critical/80",
    High: "bg-surface-warning hover:bg-surface-warning/80",
    Muted: "bg-surface-muted-yellow hover:bg-muted/40",
  };
  return `border-l-[3px] border-l-transparent ${map[status] || ""}`;
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp size={14} className="text-risk-red" />;
  if (trend === "down") return <TrendingDown size={14} className="text-success-green" />;
  return <Minus size={14} className="text-muted-foreground" />;
};

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
        <h3 className="text-sm font-bold text-foreground tracking-tight">Active Risk Issues</h3>
      </div>

      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <SearchX size={24} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">No friction themes match your search</p>
          <p className="text-xs text-muted-foreground">Try adjusting your search query or clearing filters.</p>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                <th className="text-center px-5 py-2.5 font-medium">Priority</th>
                <th className="text-center px-5 py-2.5 font-medium">Theme Name</th>
                <th className="text-center px-5 py-2.5 font-medium">Tickets</th>
                <th className="text-center px-5 py-2.5 font-medium text-amazon-orange font-bold">Revenue at Risk</th>
                <th className="text-center px-5 py-2.5 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => onSelect(issue)}
                  className={`cursor-pointer transition-all duration-150 border-b border-border last:border-0 ${rowBg(issue.status, selectedId === issue.id)} ${issue.status === "Muted" ? "opacity-60" : ""}`}
                >
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${statusBadge(issue.status)}`}>
                      {issue.status === "Critical" ? "P0" : issue.status === "High" ? "P1" : issue.status === "Resolved" ? "Resolved" : "Muted"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center text-foreground max-w-xs truncate">{issue.name}</td>
                  <td className="px-5 py-3 text-center font-mono text-foreground">{issue.vol}</td>
                  <td className="px-5 py-3 text-center font-mono font-bold text-amazon-orange text-base">
                    {issue.risk}
                  </td>
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
      )}
    </div>
  );
};

export default TriageTable;
