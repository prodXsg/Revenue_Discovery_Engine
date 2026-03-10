import { TrendingUp, AlertCircle, Filter } from "lucide-react";
import type { Issue } from "./TriageTable";

interface KPICardsProps {
  issues: Issue[];
}

const KPICards = ({ issues }: KPICardsProps) => {
  const activeIssues = issues.filter((i) => i.status === "Critical" || i.status === "High");
  const mutedIssues = issues.filter((i) => i.status === "Muted");

  const totalRisk = activeIssues.reduce((sum, i) => sum + i.riskRaw, 0);
  const activeCount = activeIssues.length;
  const noiseTickets = mutedIssues.reduce((sum, i) => sum + i.vol, 0);

  // Estimate PM hours saved (~30 min per noise ticket)
  const pmHoursSaved = Math.round(noiseTickets * 0.5);

  const cards = [
    {
      title: "Total Revenue at Risk",
      value: `₹${totalRisk.toLocaleString("en-IN")}`,
      valueClass: "text-risk-red",
      sub: "+12% WoW",
      subIcon: TrendingUp,
      subClass: "text-risk-red",
      icon: TrendingUp,
    },
    {
      title: "Active Friction Themes",
      value: String(activeCount),
      valueClass: "text-amazon-orange",
      sub: activeCount > 0 ? "Needs triage" : "All clear",
      subIcon: AlertCircle,
      subClass: "text-amazon-orange",
      icon: AlertCircle,
    },
    {
      title: "Noise Tickets Filtered",
      value: String(noiseTickets),
      valueClass: "text-success-green",
      sub: `Saved ${pmHoursSaved} PM hours`,
      subIcon: Filter,
      subClass: "text-success-green",
      icon: Filter,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className="bg-card rounded border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{c.title}</p>
            <c.icon size={16} className={c.subClass} />
          </div>
          <p className={`text-2xl font-bold ${c.valueClass}`}>{c.value}</p>
          <div className="flex items-center gap-1 mt-2">
            <c.subIcon size={12} className={c.subClass} />
            <span className={`text-xs font-medium ${c.subClass}`}>{c.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
