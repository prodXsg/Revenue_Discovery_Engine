import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import AppSidebar from "@/components/dashboard/AppSidebar";
import Header from "@/components/dashboard/Header";
import KPICards from "@/components/dashboard/KPICards";
import TriageTable from "@/components/dashboard/TriageTable";
import DeepDivePanel from "@/components/dashboard/DeepDivePanel";
import JiraModal from "@/components/dashboard/JiraModal";
import WBRModal from "@/components/dashboard/WBRModal";
import SkeletonLoader from "@/components/dashboard/SkeletonLoader";
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

const formatTimestamp = () => {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + ", " + new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const Index = () => {
  const [issues, setIssues] = useState<Issue[]>(() => {
    try {
      const saved = localStorage.getItem("discovery-engine-issues");
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultIssues;
  });
  const [isFetching, setIsFetching] = useState(false);
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue>(() => {
    try {
      const saved = localStorage.getItem("discovery-engine-issues");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch {}
    return defaultIssues[0];
  });
  const [activeTab, setActiveTab] = useState("Correlation Overview");
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);
  const [isWBRModalOpen, setIsWBRModalOpen] = useState(false);
  const [sidebarItem, setSidebarItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(formatTimestamp());

  const handleFetchData = async () => {
    setIsFetching(true);
    setIsSkeletonVisible(true);
    console.log("1. Starting API call...");

    try {
      const response = await fetch('https://pristine-liane-noncontemplatively.ngrok-free.dev/webhook-test/triage-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ action: "fetch_triage" })
      });

      if (!response.ok) {
        throw new Error(`API failed with status: ${response.status}`);
      }

      const liveData = await response.json();
      console.log("2. Raw data from n8n:", liveData);

      const rawArray = liveData.ranked_results ? liveData.ranked_results : liveData;

      if (!Array.isArray(rawArray)) {
        throw new Error("n8n did not return an array. Check the Webhook Response node.");
      }

      const formattedIssues: Issue[] = rawArray.map((item: any, index: number) => {
        const isNoise = item.total_revenue_risk_inr === 0;
        return {
          id: index + 1,
          name: item.name,
          risk: `₹${item.total_revenue_risk_inr.toLocaleString('en-IN')}`,
          riskRaw: item.total_revenue_risk_inr,
          vol: item.ticket_count,
          status: isNoise ? "Muted" : (index === 0 ? "Critical" : "High"),
          trend: isNoise ? "flat" : "up",
          traffic: "0",
          drop: "0%",
          aov: "₹0",
          quotes: item.quotes || [],
          rootCause: item.root_cause || "No root cause provided.",
          chartData: defaultIssues[0].chartData,
        };
      });

      console.log("3. Formatted data applied to UI!", formattedIssues);

      // Ensure skeleton shows for at least 2s
      await new Promise((r) => setTimeout(r, 2000));

      setIssues(formattedIssues);
      if (formattedIssues.length > 0) setSelectedIssue(formattedIssues[0]);
      setLastUpdated(formatTimestamp());
      toast.success("Data refreshed successfully", { description: `${formattedIssues.length} issues loaded from AI triage.` });

    } catch (error) {
      console.error("Connection error details:", error);
      toast.error("Failed to fetch data", { description: "Check console for details." });
      // Still show skeleton for minimum time
      await new Promise((r) => setTimeout(r, 1500));
    } finally {
      setIsFetching(false);
      setIsSkeletonVisible(false);
    }
  };

  const handleResolve = () => {
    setIssues((prev) =>
      prev.map((i) => (i.id === selectedIssue.id ? { ...i, status: "Resolved" } : i))
    );
    toast.success("Issue Resolved", { description: `"${selectedIssue.name}" marked as resolved.` });
    // Select next available issue
    const remaining = issues.filter((i) => i.id !== selectedIssue.id && (i.status === "Critical" || i.status === "High"));
    if (remaining.length > 0) setSelectedIssue(remaining[0]);
  };

  const handleMute = () => {
    setIssues((prev) =>
      prev.map((i) => (i.id === selectedIssue.id ? { ...i, status: "Muted", trend: "flat" } : i))
    );
    toast("Theme Muted", { description: `"${selectedIssue.name}" moved to Muted Noise.` });
    const remaining = issues.filter((i) => i.id !== selectedIssue.id && (i.status === "Critical" || i.status === "High"));
    if (remaining.length > 0) setSelectedIssue(remaining[0]);
  };

  const filteredIssues = useMemo(() => {
    let list = issues;
    if (sidebarItem === "active-risks") list = issues.filter((i) => i.status === "Critical" || i.status === "High");
    else if (sidebarItem === "muted-noise") list = issues.filter((i) => i.status === "Muted");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.risk.toLowerCase().includes(q) ||
          i.status.toLowerCase().includes(q) ||
          (i.rootCause && i.rootCause.toLowerCase().includes(q))
      );
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

  const renderContent = () => {
    if (showDashboard) {
      if (isSkeletonVisible) {
        return (
          <motion.div key="skeleton" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <SkeletonLoader />
          </motion.div>
        );
      }
      return (
        <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
          {sidebarItem === "dashboard" && <KPICards issues={issues} />}
          <TriageTable issues={filteredIssues} selectedId={selectedIssue.id} onSelect={setSelectedIssue} />
          {filteredIssues.length > 0 && (
            <DeepDivePanel
              issue={selectedIssue}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onCreateJira={() => setIsJiraModalOpen(true)}
              onExportWBR={() => setIsWBRModalOpen(true)}
              onResolve={handleResolve}
              onMute={handleMute}
            />
          )}
        </motion.div>
      );
    }
    if (sidebarItem === "settings") return <motion.div key="settings" variants={pageVariants} initial="initial" animate="animate" exit="exit"><SettingsPage /></motion.div>;
    if (sidebarItem === "integrations") return <motion.div key="integrations" variants={pageVariants} initial="initial" animate="animate" exit="exit"><IntegrationsPage /></motion.div>;
    if (sidebarItem === "reports") return <motion.div key="reports" variants={pageVariants} initial="initial" animate="animate" exit="exit"><ReportsPage /></motion.div>;
    return null;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeItem={sidebarItem} onItemClick={handleSidebarClick} activeRiskCount={activeCount} mutedNoiseCount={mutedCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          isFetching={isFetching}
          onFetch={handleFetchData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          lastUpdated={lastUpdated}
        />

        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>

      <JiraModal issue={selectedIssue} isOpen={isJiraModalOpen} onClose={() => setIsJiraModalOpen(false)} />
      <WBRModal issue={selectedIssue} isOpen={isWBRModalOpen} onClose={() => setIsWBRModalOpen(false)} />
    </div>
  );
};

export default Index;
