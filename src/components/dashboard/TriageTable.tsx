import { SearchX } from "lucide-react";

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
  dateDetected?: string;
  previousStatus?: string;
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
    Low: "bg-muted text-muted-foreground",
    Muted: "bg-muted text-muted-foreground",
    Resolved: "bg-success-green text-primary-foreground",
  };
  return map[status] || "bg-muted text-muted-foreground";
};

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    Critical: "P0",
    High: "P1",
    Low: "Low",
    Muted: "Muted",
    Resolved: "Resolved",
  };
  return map[status] || status;
};

const rowBg = (status: string, selected: boolean) => {
  if (selected) return "bg-accent border-l-[3px] border-l-amazon-orange font-semibold";
  const map: Record<string, string> = {
    Critical: "bg-surface-critical hover:bg-surface-critical/80",
    High: "bg-surface-warning hover:bg-surface-warning/80",
    Low: "bg-surface-muted-yellow hover:bg-muted/40",
    Muted: "bg-surface-muted-yellow hover:bg-muted/40",
  };
  return `border-l-[3px] border-l-transparent ${map[status] || ""}`;
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
                <th className="text-center px-5 py-2.5 font-medium">Date Detected</th>
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
                      {statusLabel(issue.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center text-foreground max-w-xs truncate">{issue.name}</td>
                  <td className="px-5 py-3 text-center font-mono text-foreground">{issue.vol}</td>
                  <td className="px-5 py-3 text-center font-mono font-bold text-amazon-orange text-base">
                    {issue.risk}
                  </td>
                  <td className="px-5 py-3 text-center text-muted-foreground text-xs">
                    {issue.dateDetected || "—"}
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
