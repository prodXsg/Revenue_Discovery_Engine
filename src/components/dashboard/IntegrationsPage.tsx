import { AlertCircle, CheckCircle2 } from "lucide-react";

const integrations = [
  { name: "Zendesk", desc: "Customer support ticket ingestion", icon: "🎫", status: "Not connected", statusType: "planned" as const },
  { name: "Mixpanel", desc: "Product analytics & funnel data", icon: "📊", status: "Not connected", statusType: "planned" as const },
  { name: "Jira", desc: "Issue tracking & draft export", icon: "📋", status: "Not connected", statusType: "planned" as const },
  { name: "Slack", desc: "Real-time alert notifications", icon: "💬", status: "Not connected", statusType: "planned" as const },
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
          <div key={int.name} className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 opacity-60">
            <div className="text-3xl">{int.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">{int.name}</h3>
                <div className="flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">{int.status}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{int.desc}</p>
              <p className="text-[11px] text-muted-foreground mt-2">Planned feature</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;
