import { TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
import type { Issue } from "./TriageTable";

interface KPICardsProps {
  issues: Issue[];
}

const KPICards = ({ issues }: KPICardsProps) => {
  const safeIssues = issues || [];
  const activeIssues = safeIssues.filter((i) => i.status === "Critical" || i.status === "High" || i.status === "Low");

  const totalRisk = activeIssues.reduce((sum, i) => sum + i.riskRaw, 0);
  const activeCount = activeIssues.length;
  const totalComplaints = safeIssues.reduce((sum, i) => sum + i.vol, 0);

  const cards = [
    {
      title: "Total Revenue at Risk",
      value: `₹${totalRisk.toLocaleString("en-IN")}`,
      valueClass: "text-risk-red",
      icon: TrendingUp,
      iconClass: "text-risk-red",
    },
    {
      title: "Active Friction Themes",
      value: String(activeCount),
      valueClass: "text-amazon-orange",
      icon: AlertCircle,
      iconClass: "text-amazon-orange",
    },
    {
      title: "Total Complaints Analyzed",
      value: String(totalComplaints),
      valueClass: "text-success-green",
      icon: BarChart3,
      iconClass: "text-success-green",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className="bg-card rounded border border-border p-5 shadow-sm hover:shadow-md transition-shadow text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <c.icon size={16} className={c.iconClass} />
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{c.title}</p>
          <p className={`text-2xl font-bold ${c.valueClass}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
