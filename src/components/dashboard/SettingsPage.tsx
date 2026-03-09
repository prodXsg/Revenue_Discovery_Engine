import { useState } from "react";
import { Shield, Brain, BellRing, Link2, Database, Lock, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const SettingsPage = () => {
  const [dpdpEnabled, setDpdpEnabled] = useState(true);
  const [llmProvider, setLlmProvider] = useState("ollama");
  const [emailNotif, setEmailNotif] = useState(true);
  const [slackNotif, setSlackNotif] = useState(true);
  const [jiraProject, setJiraProject] = useState("E-COMMERCE");
  const [jiraIssueType, setJiraIssueType] = useState("Epic");
  const [retentionPolicy, setRetentionPolicy] = useState("90");
  const [ssoRequired, setSsoRequired] = useState(false);
  const { theme, setTheme } = useTheme();

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? "bg-success-green" : "bg-muted"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${enabled ? "translate-x-5" : ""}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your enterprise configuration</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Col 1 */}
        <div className="space-y-6">
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
              <Toggle enabled={dpdpEnabled} onToggle={() => setDpdpEnabled(!dpdpEnabled)} />
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
                  <input type="radio" name="llm" checked={llmProvider === opt.id} onChange={() => setLlmProvider(opt.id)} className="accent-amazon-orange" />
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
                  <Toggle enabled={n.enabled} onToggle={() => n.toggle(!n.enabled)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2 */}
        <div className="space-y-6">
          {/* Jira Integration Defaults */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <Link2 size={18} className="text-amazon-orange" />
              <h3 className="text-sm font-bold text-foreground">Jira Integration Defaults</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Default Project</label>
                <select
                  value={jiraProject}
                  onChange={(e) => setJiraProject(e.target.value)}
                  className="w-full h-9 rounded border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="E-COMMERCE">E-COMMERCE</option>
                  <option value="PAYMENTS">PAYMENTS</option>
                  <option value="LOGISTICS">LOGISTICS</option>
                  <option value="CUSTOMER-EXP">CUSTOMER-EXP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Default Issue Type</label>
                <select
                  value={jiraIssueType}
                  onChange={(e) => setJiraIssueType(e.target.value)}
                  className="w-full h-9 rounded border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="Epic">Epic</option>
                  <option value="Story">Story</option>
                  <option value="Bug">Bug</option>
                  <option value="Task">Task</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Retention Policy */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <Database size={18} className="text-amazon-orange" />
              <h3 className="text-sm font-bold text-foreground">Data Retention Policy</h3>
            </div>
            <div className="space-y-2">
              {[
                { value: "30", label: "30 Days", desc: "Minimal storage footprint" },
                { value: "90", label: "90 Days", desc: "Recommended for quarterly reviews" },
                { value: "365", label: "1 Year", desc: "Full annual audit trail" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    retentionPolicy === opt.value ? "border-amazon-orange bg-primary/5" : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <input type="radio" name="retention" checked={retentionPolicy === opt.value} onChange={() => setRetentionPolicy(opt.value)} className="accent-amazon-orange" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Access Control */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={18} className="text-amazon-orange" />
              <h3 className="text-sm font-bold text-foreground">Access Control</h3>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Require SSO / SAML</p>
                <p className="text-xs text-muted-foreground">Enforce single sign-on for all PM access</p>
              </div>
              <Toggle enabled={ssoRequired} onToggle={() => setSsoRequired(!ssoRequired)} />
            </div>
          </div>

          {/* Theme / Dark Mode */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              {theme === "dark" ? <Moon size={18} className="text-amazon-orange" /> : <Sun size={18} className="text-amazon-orange" />}
              <h3 className="text-sm font-bold text-foreground">Appearance</h3>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
              </div>
              <Toggle enabled={theme === "dark"} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
