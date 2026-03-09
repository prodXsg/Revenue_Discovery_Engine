import { CheckCircle2 } from "lucide-react";

const integrations = [
  { name: "Zendesk", desc: "Customer support ticket ingestion", icon: "🎫", status: "Connected", lastSync: "2 mins ago" },
  { name: "Mixpanel", desc: "Product analytics & funnel data", icon: "📊", status: "Connected", lastSync: "5 mins ago" },
  { name: "Jira", desc: "Issue tracking & epic creation", icon: "📋", status: "Connected", lastSync: "10 mins ago" },
  { name: "Slack", desc: "Real-time alert notifications", icon: "💬", status: "Connected", lastSync: "1 min ago" },
];

const IntegrationsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground tracking-tight">Integrations</h2>
        <p className="text-sm text-muted-foreground">Connected data sources and notification channels</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {integrations.map((int) => (
          <div key={int.name} className="bg-card border border-border rounded-lg p-5 flex items-start gap-4">
            <div className="text-3xl">{int.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">{int.name}</h3>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-success-green" />
                  <span className="text-xs font-semibold text-success-green">{int.status}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{int.desc}</p>
              <p className="text-[11px] text-muted-foreground mt-2">Last sync: {int.lastSync}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;
