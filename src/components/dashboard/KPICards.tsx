import { TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
import type { Issue } from "./TriageTable";
import { formatRevenueIndian } from "@/lib/revenue";

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
      caption: "Weekly leakage from active issues",
      value: formatRevenueIndian(totalRisk),
      valueClass: "text-risk-red",
      icon: TrendingUp,
      iconClass: "text-risk-red",
    },
    {
      title: "Active Friction Themes",
      caption: "Issues requiring action",
      value: String(activeCount),
      valueClass: "text-foreground",
      icon: AlertCircle,
      iconClass: "text-muted-foreground",
    },
    {
      title: "Total Complaints Analyzed",
      caption: "Customer feedback items processed",
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
          className="bg-card rounded border border-border p-6 shadow-sm hover:shadow-md transition-shadow text-center cursor-default"
        >
          <div className="flex items-center justify-center mb-3">
            <c.icon size={18} className={c.iconClass} />
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{c.title}</p>
          <p className={`text-3xl font-bold ${c.valueClass} mb-2`}>{c.value}</p>
          <p className="text-xs text-muted-foreground">{c.caption}</p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
