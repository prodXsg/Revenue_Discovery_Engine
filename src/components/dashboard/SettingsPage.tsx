import { useState } from "react";
import { Shield, Brain, BellRing } from "lucide-react";

const SettingsPage = () => {
  const [dpdpEnabled, setDpdpEnabled] = useState(true);
  const [llmProvider, setLlmProvider] = useState("ollama");
  const [emailNotif, setEmailNotif] = useState(true);
  const [slackNotif, setSlackNotif] = useState(true);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your enterprise configuration</p>
      </div>

      {/* Data Privacy */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={18} className="text-amazon-orange" />
          <h3 className="text-sm font-bold text-foreground">Data Privacy</h3>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-sm font-medium text-foreground">DPDP Act PII Scrubbing</p>
            <p className="text-xs text-muted-foreground">Automatically redact PII from all ingested tickets</p>
          </div>
          <button
            onClick={() => setDpdpEnabled(!dpdpEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${dpdpEnabled ? "bg-success-green" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${dpdpEnabled ? "translate-x-5" : ""}`} />
          </button>
        </div>
      </div>

      {/* LLM Provider */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <Brain size={18} className="text-amazon-orange" />
          <h3 className="text-sm font-bold text-foreground">LLM Provider</h3>
        </div>
        <div className="space-y-2">
          {[
            { id: "ollama", label: "Local Ollama / Llama 3", desc: "On-prem, zero data egress" },
            { id: "bedrock", label: "AWS Bedrock (Claude)", desc: "Managed, enterprise-grade" },
            { id: "openai", label: "OpenAI GPT-4o", desc: "Cloud-hosted, highest accuracy" },
          ].map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                llmProvider === opt.id ? "border-amazon-orange bg-primary/5" : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <input
                type="radio"
                name="llm"
                checked={llmProvider === opt.id}
                onChange={() => setLlmProvider(opt.id)}
                className="accent-amazon-orange"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4">
          <BellRing size={18} className="text-amazon-orange" />
          <h3 className="text-sm font-bold text-foreground">Notification Preferences</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "Email Alerts", desc: "P0/P1 alerts to team DL", enabled: emailNotif, toggle: setEmailNotif },
            { label: "Slack Notifications", desc: "#cx-alerts channel", enabled: slackNotif, toggle: setSlackNotif },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <button
                onClick={() => n.toggle(!n.enabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${n.enabled ? "bg-success-green" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${n.enabled ? "translate-x-5" : ""}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
