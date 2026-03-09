import { useState } from "react";
import { User, Bell, Sliders, Shield, Save, Check } from "lucide-react";

const SettingsPage = () => {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "Surya Ganesh",
    email: "surya.g@company.com",
    role: "Sr. Product Manager",
    team: "E-Commerce Platform",
  });
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    highAlerts: true,
    weeklyDigest: true,
    slackNotifs: false,
    emailNotifs: true,
  });
  const [thresholds, setThresholds] = useState({
    revenueRiskMin: "100000",
    ticketVolumeMin: "10",
    convDropMin: "0.5",
    autoMuteBelow: "5",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        checked ? "bg-amazon-orange" : "bg-muted"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile, notifications, and triage thresholds.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-all ${
            saved
              ? "bg-success-green text-white"
              : "bg-amazon-orange text-primary-foreground hover:opacity-90"
          }`}
        >
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Profile Section */}
      <section className="bg-card rounded border border-border shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <User size={16} className="text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {(["name", "email", "role", "team"] as const).map((field) => (
            <div key={field}>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                {field === "name" ? "Full Name" : field === "email" ? "Email" : field === "role" ? "Role" : "Team"}
              </label>
              <input
                type="text"
                value={profile[field]}
                onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                className="w-full px-3 py-2 rounded border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amazon-orange/30 focus:border-amazon-orange transition-colors"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-card rounded border border-border shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Bell size={16} className="text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            { key: "criticalAlerts" as const, label: "Critical Risk Alerts", desc: "Get notified immediately when a P0 friction theme is detected." },
            { key: "highAlerts" as const, label: "High Risk Alerts", desc: "Get notified for P1 friction themes above revenue threshold." },
            { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "Receive a weekly summary of triage activity and trends." },
            { key: "slackNotifs" as const, label: "Slack Notifications", desc: "Push alerts to your connected Slack channels." },
            { key: "emailNotifs" as const, label: "Email Notifications", desc: "Receive alerts via email." },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Toggle
                checked={notifications[item.key]}
                onChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Triage Thresholds Section */}
      <section className="bg-card rounded border border-border shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Sliders size={16} className="text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Triage Thresholds</h2>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {[
            { key: "revenueRiskMin" as const, label: "Min Revenue Risk (₹)", placeholder: "100000" },
            { key: "ticketVolumeMin" as const, label: "Min Ticket Volume", placeholder: "10" },
            { key: "convDropMin" as const, label: "Min Conv. Drop (%)", placeholder: "0.5" },
            { key: "autoMuteBelow" as const, label: "Auto-mute below (tickets)", placeholder: "5" },
          ].map((item) => (
            <div key={item.key}>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                {item.label}
              </label>
              <input
                type="text"
                value={thresholds[item.key]}
                onChange={(e) => setThresholds({ ...thresholds, [item.key]: e.target.value })}
                placeholder={item.placeholder}
                className="w-full px-3 py-2 rounded border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amazon-orange/30 focus:border-amazon-orange transition-colors"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-card rounded border border-border shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Shield size={16} className="text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Security</h2>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security to your account.</p>
            </div>
            <button className="px-3 py-1.5 rounded text-xs font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-sm font-medium text-foreground">API Key</p>
              <p className="text-xs text-muted-foreground mt-0.5">Manage API keys for programmatic access.</p>
            </div>
            <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground font-mono">
              de-****-****-7f3a
            </code>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
