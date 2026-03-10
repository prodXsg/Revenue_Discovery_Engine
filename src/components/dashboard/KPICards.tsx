import { TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
import type { Issue } from "./TriageTable";

interface KPICardsProps {
  issues: Issue[];
}

const KPICards = ({ issues }: KPICardsProps) => {
  const safeIssues = issues || [];
  const activeIssues = safeIssues.filter((i) => i.status === "Critical" || i.status === "High");

  const totalRisk = activeIssues.reduce((sum, i) => sum + i.riskRaw, 0);
  const activeCount = activeIssues.length;
  const totalComplaints = safeIssues.reduce((sum, i) => sum + i.vol, 0);

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
      sub: null,
      subIcon: AlertCircle,
      subClass: "text-amazon-orange",
      icon: AlertCircle,
    },
    {
      title: "Total Complaints Analyzed",
      value: String(totalComplaints),
      valueClass: "text-success-green",
      sub: null,
      subIcon: BarChart3,
      subClass: "text-success-green",
      icon: BarChart3,
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
          {c.sub && (
            <div className="flex items-center gap-1 mt-2">
              <c.subIcon size={12} className={c.subClass} />
              <span className={`text-xs font-medium ${c.subClass}`}>{c.sub}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KPICards;
