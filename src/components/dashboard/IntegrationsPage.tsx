import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Plug,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: "connected" | "disconnected";
  lastSync?: string;
  category: "ticketing" | "communication" | "analytics" | "devops";
}

const initialIntegrations: Integration[] = [
  {
    id: "jira",
    name: "Jira",
    description: "Push triaged issues as Epics, Stories, or Bugs directly into your Jira board.",
    logo: "🎯",
    status: "connected",
    lastSync: "2 mins ago",
    category: "ticketing",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Ingest customer support tickets and extract friction signals automatically.",
    logo: "🎧",
    status: "connected",
    lastSync: "5 mins ago",
    category: "ticketing",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Receive real-time alerts and triage summaries in your team channels.",
    logo: "💬",
    status: "disconnected",
    category: "communication",
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    description: "Auto-escalate critical friction themes to your on-call engineering team.",
    logo: "🚨",
    status: "disconnected",
    category: "devops",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Pull conversion funnels and traffic data to correlate with ticket volume.",
    logo: "📊",
    status: "connected",
    lastSync: "1 hour ago",
    category: "analytics",
  },
  {
    id: "datadog",
    name: "Datadog",
    description: "Correlate app performance metrics with customer-reported friction themes.",
    logo: "🐕",
    status: "disconnected",
    category: "analytics",
  },
];

const categoryLabels: Record<string, string> = {
  ticketing: "Ticketing & Support",
  communication: "Communication",
  analytics: "Analytics & Monitoring",
  devops: "DevOps",
};

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [syncing, setSyncing] = useState<string | null>(null);

  const toggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: i.status === "connected" ? "disconnected" : "connected",
              lastSync: i.status === "disconnected" ? "Just now" : undefined,
            }
          : i
      )
    );
  };

  const handleSync = (id: string) => {
    setSyncing(id);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, lastSync: "Just now" } : i))
      );
      setSyncing(null);
    }, 1500);
  };

  const categories = [...new Set(integrations.map((i) => i.category))];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your tools to enrich telemetry and automate workflows.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Plug size={14} />
          <span>
            {integrations.filter((i) => i.status === "connected").length} of{" "}
            {integrations.length} connected
          </span>
        </div>
      </div>

      {/* Category Groups */}
      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {categoryLabels[category] || category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations
              .filter((i) => i.category === category)
              .map((integration) => (
                <div
                  key={integration.id}
                  className={`bg-card rounded border shadow-sm p-5 transition-all ${
                    integration.status === "connected"
                      ? "border-border"
                      : "border-border opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xl">
                        {integration.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            {integration.name}
                          </h3>
                          {integration.status === "connected" ? (
                            <span className="flex items-center gap-1 text-xs text-success-green">
                              <CheckCircle size={12} />
                              Connected
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <XCircle size={12} />
                              Not connected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      {integration.lastSync
                        ? `Last sync: ${integration.lastSync}`
                        : "Never synced"}
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.status === "connected" && (
                        <button
                          onClick={() => handleSync(integration.id)}
                          disabled={syncing === integration.id}
                          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        >
                          <RefreshCw
                            size={12}
                            className={syncing === integration.id ? "animate-spin" : ""}
                          />
                          Sync
                        </button>
                      )}
                      <button
                        onClick={() => toggleConnection(integration.id)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                          integration.status === "connected"
                            ? "bg-muted text-foreground hover:bg-muted/80"
                            : "bg-amazon-orange text-primary-foreground hover:opacity-90"
                        }`}
                      >
                        {integration.status === "connected" ? "Disconnect" : "Connect"}
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IntegrationsPage;
