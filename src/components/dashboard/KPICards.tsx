import { TrendingUp, AlertCircle, Filter } from "lucide-react";

const KPICards = () => {
  const cards = [
    {
      title: "Total Revenue at Risk",
      value: "₹99,46,280",
      valueClass: "text-risk-red",
      sub: "+12% WoW",
      subIcon: TrendingUp,
      subClass: "text-risk-red",
      icon: TrendingUp,
    },
    {
      title: "Active Friction Themes",
      value: "2",
      valueClass: "text-amazon-orange",
      sub: "Needs triage",
      subIcon: AlertCircle,
      subClass: "text-amazon-orange",
      icon: AlertCircle,
    },
    {
      title: "Noise Tickets Filtered",
      value: "35",
      valueClass: "text-success-green",
      sub: "Saved 18 PM hours",
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
          className="bg-card rounded border border-border p-5 shadow-sm"
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
