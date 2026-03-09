import { useState, useMemo } from "react";
import AppSidebar from "@/components/dashboard/AppSidebar";
import Header from "@/components/dashboard/Header";
import KPICards from "@/components/dashboard/KPICards";
import TriageTable from "@/components/dashboard/TriageTable";
import DeepDivePanel from "@/components/dashboard/DeepDivePanel";
import JiraModal from "@/components/dashboard/JiraModal";
import SettingsPage from "@/components/dashboard/SettingsPage";
import IntegrationsPage from "@/components/dashboard/IntegrationsPage";
import ReportsPage from "@/components/dashboard/ReportsPage";
import type { Issue } from "@/components/dashboard/TriageTable";

const defaultIssues: Issue[] = [
  {
    id: 1, name: "iOS 17 UPI Biometric Freeze & Core App Crashes", risk: "₹54,68,400", riskRaw: 5468400, vol: 24, status: "Critical", trend: "up", traffic: "45,000", drop: "-1.4%", aov: "₹1,200",
    quotes: ["App crashes when opening cart with 10+ items", "Search results not sorted properly."],
    rootCause: "App crash when attempting UPI biometric authentication on iOS 17. Biometric SDK incompatibility with iOS 17 security sandbox causing payment flow to freeze and crash. Affects 68% of iOS 17 users attempting UPI payments.",
    chartData: [
      { day: "Mon", tickets: 2, conversion: 3.8 },
      { day: "Tue", tickets: 5, conversion: 3.5 },
      { day: "Wed", tickets: 8, conversion: 3.0 },
      { day: "Thu", tickets: 14, conversion: 2.6 },
      { day: "Fri", tickets: 20, conversion: 2.1 },
      { day: "Sat", tickets: 28, conversion: 1.7 },
      { day: "Sun", tickets: 34, conversion: 1.2 },
    ],
  },
  {
    id: 2, name: "Order and Payment Issues", risk: "₹44,77,880", riskRaw: 4477880, vol: 13, status: "High", trend: "up", traffic: "32,000", drop: "-1.1%", aov: "₹1,200",
    quotes: ["Payment failed but charged twice.", "Refund initiated but money not received."],
    rootCause: "Payment gateway timeout causing double-charge on retry. The retry logic in the payment microservice does not check idempotency keys, leading to duplicate transactions during peak load windows (6–9 PM IST).",
    chartData: [
      { day: "Mon", tickets: 1, conversion: 4.2 },
      { day: "Tue", tickets: 2, conversion: 4.0 },
      { day: "Wed", tickets: 3, conversion: 3.8 },
      { day: "Thu", tickets: 5, conversion: 3.5 },
      { day: "Fri", tickets: 7, conversion: 3.2 },
      { day: "Sat", tickets: 10, conversion: 2.9 },
      { day: "Sun", tickets: 13, conversion: 2.6 },
    ],
  },
  {
    id: 3, name: "Deprioritized Noise: Design and Visual Issues", risk: "₹0", riskRaw: 0, vol: 35, status: "Muted", trend: "flat", traffic: "50,000", drop: "0.0%", aov: "₹500",
    quotes: ["Homepage colors bilkul bakwas.", "Colors absolutely terrible."],
    rootCause: "Cosmetic complaints about color scheme and font rendering on low-DPI Android devices. No measurable conversion or revenue impact detected. Classified as noise by the AI triage engine.",
    chartData: [
      { day: "Mon", tickets: 5, conversion: 4.1 },
      { day: "Tue", tickets: 5, conversion: 4.1 },
      { day: "Wed", tickets: 6, conversion: 4.0 },
      { day: "Thu", tickets: 5, conversion: 4.1 },
      { day: "Fri", tickets: 4, conversion: 4.1 },
      { day: "Sat", tickets: 5, conversion: 4.0 },
      { day: "Sun", tickets: 5, conversion: 4.1 },
    ],
  },
];

const WEBHOOK_URL = "https://pristine-liane-noncontemplatively.ngrok-free.app/webhook/triage-manual";

const Index = () => {
  const [issues, setIssues] = useState<Issue[]>(defaultIssues);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue>(defaultIssues[0]);
  const [activeTab, setActiveTab] = useState("Correlation Overview");
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);
  const [sidebarItem, setSidebarItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFetch = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" } });
      if (response.ok) {
        const data = await response.json();
        setIssues(data);
        if (data.length > 0) setSelectedIssue(data[0]);
      }
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const filteredIssues = useMemo(() => {
    let list = issues;
    if (sidebarItem === "active-risks") list = issues.filter((i) => i.status === "Critical" || i.status === "High");
    else if (sidebarItem === "muted-noise") list = issues.filter((i) => i.status === "Muted");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.risk.toLowerCase().includes(q) || i.status.toLowerCase().includes(q));
    }
    return list;
  }, [issues, sidebarItem, searchQuery]);

  const handleSidebarClick = (item: string) => {
    setSidebarItem(item);
    setSearchQuery("");
    const filtered = item === "active-risks"
      ? issues.filter((i) => i.status === "Critical" || i.status === "High")
      : item === "muted-noise"
      ? issues.filter((i) => i.status === "Muted")
      : issues;
    if (filtered.length > 0) setSelectedIssue(filtered[0]);
  };

  const activeCount = issues.filter((i) => i.status === "Critical" || i.status === "High").length;
  const mutedCount = issues.filter((i) => i.status === "Muted").length;

  const showDashboard = sidebarItem === "dashboard" || sidebarItem === "active-risks" || sidebarItem === "muted-noise";

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeItem={sidebarItem} onItemClick={handleSidebarClick} activeRiskCount={activeCount} mutedNoiseCount={mutedCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header isFetching={isFetching} onFetch={handleFetch} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <main className="flex-1 p-6 space-y-5 overflow-auto">
          {showDashboard ? (
            <>
              {sidebarItem === "dashboard" && <KPICards />}
              <TriageTable issues={filteredIssues} selectedId={selectedIssue.id} onSelect={setSelectedIssue} />
              <DeepDivePanel issue={selectedIssue} activeTab={activeTab} onTabChange={setActiveTab} onCreateJira={() => setIsJiraModalOpen(true)} />
            </>
          ) : sidebarItem === "settings" ? (
            <SettingsPage />
          ) : sidebarItem === "integrations" ? (
            <IntegrationsPage />
          ) : sidebarItem === "reports" ? (
            <ReportsPage />
          ) : null}
        </main>
      </div>

      <JiraModal issue={selectedIssue} isOpen={isJiraModalOpen} onClose={() => setIsJiraModalOpen(false)} />
    </div>
  );
};

export default Index;
