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

const formatDetectedDate = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const generateDynamicChartData = (vol: number, riskRaw: number, id: number) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const baseTickets = Math.max(1, Math.round(vol / 7));
  const riskFactor = Math.min(riskRaw / 1000000, 5);
  const seed = id * 13;
  return days.map((day, i) => {
    const noise = ((seed + i * 17) % 5) - 2;
    const growthFactor = 1 + (i * riskFactor * 0.15);
    const tickets = Math.max(1, Math.round(baseTickets * growthFactor + noise));
    const conversion = Math.max(0.3, parseFloat((4.5 - i * (0.2 + riskFactor * 0.08) + noise * 0.05).toFixed(1)));
    return { day, tickets, conversion };
  });
};

/** Rebalance priorities: active issues sorted by riskRaw desc → P0, P1, P2… Low stays Low */
const rebalancePriorities = (allIssues: Issue[]): Issue[] => {
  const activeIssues = allIssues.filter(
    (i) => i.status !== "Resolved" && i.status !== "Muted"
  );
  const sorted = [...activeIssues].sort((a, b) => b.riskRaw - a.riskRaw);

  const priorityMap = new Map<number, string>();
  sorted.forEach((issue, index) => {
    if (issue.riskRaw === 0) {
      priorityMap.set(issue.id, "Low");
    } else if (index === 0) {
      priorityMap.set(issue.id, "Critical");
    } else {
      priorityMap.set(issue.id, "High");
    }
  });

  return allIssues.map((issue) => {
    if (issue.status === "Resolved" || issue.status === "Muted") return issue;
    const newStatus = priorityMap.get(issue.id);
    return newStatus ? { ...issue, status: newStatus } : issue;
  });
};

const defaultIssues: Issue[] = [
  {
    id: 1, name: "iOS 17 UPI Biometric Freeze & Core App Crashes", risk: "₹54,68,400", riskRaw: 5468400, vol: 24, status: "Critical", trend: "up", traffic: "45,000", drop: "-1.4%", aov: "₹1,200",
    quotes: ["App crashes when opening cart with 10+ items", "Search results not sorted properly."],
    rootCause: "App crash when attempting UPI biometric authentication on iOS 17. Biometric SDK incompatibility with iOS 17 security sandbox causing payment flow to freeze and crash. Affects 68% of iOS 17 users attempting UPI payments.",
    dateDetected: formatDetectedDate(),
    chartData: [
      { day: "Mon", tickets: 2, conversion: 3.8 }, { day: "Tue", tickets: 5, conversion: 3.5 },
      { day: "Wed", tickets: 8, conversion: 3.0 }, { day: "Thu", tickets: 14, conversion: 2.6 },
      { day: "Fri", tickets: 20, conversion: 2.1 }, { day: "Sat", tickets: 28, conversion: 1.7 },
      { day: "Sun", tickets: 34, conversion: 1.2 },
    ],
  },
  {
    id: 2, name: "Order and Payment Issues", risk: "₹44,77,880", riskRaw: 4477880, vol: 13, status: "High", trend: "up", traffic: "32,000", drop: "-1.1%", aov: "₹1,200",
    quotes: ["Payment failed but charged twice.", "Refund initiated but money not received."],
    rootCause: "Payment gateway timeout causing double-charge on retry. The retry logic in the payment microservice does not check idempotency keys, leading to duplicate transactions during peak load windows (6–9 PM IST).",
    dateDetected: formatDetectedDate(),
    chartData: [
      { day: "Mon", tickets: 1, conversion: 4.2 }, { day: "Tue", tickets: 2, conversion: 4.0 },
      { day: "Wed", tickets: 3, conversion: 3.8 }, { day: "Thu", tickets: 5, conversion: 3.5 },
      { day: "Fri", tickets: 7, conversion: 3.2 }, { day: "Sat", tickets: 10, conversion: 2.9 },
      { day: "Sun", tickets: 13, conversion: 2.6 },
    ],
  },
  {
    id: 3, name: "Deprioritized Noise: Design and Visual Issues", risk: "₹0", riskRaw: 0, vol: 35, status: "Low", trend: "flat", traffic: "50,000", drop: "0.0%", aov: "₹500",
    quotes: ["Homepage colors bilkul bakwas.", "Colors absolutely terrible."],
    rootCause: "Cosmetic complaints about color scheme and font rendering on low-DPI Android devices. No measurable conversion or revenue impact detected. Classified as noise by the AI triage engine.",
    dateDetected: formatDetectedDate(),
    chartData: [
      { day: "Mon", tickets: 5, conversion: 4.1 }, { day: "Tue", tickets: 5, conversion: 4.1 },
      { day: "Wed", tickets: 6, conversion: 4.0 }, { day: "Thu", tickets: 5, conversion: 4.1 },
      { day: "Fri", tickets: 4, conversion: 4.1 }, { day: "Sat", tickets: 5, conversion: 4.0 },
      { day: "Sun", tickets: 5, conversion: 4.1 },
    ],
  },
];

const formatTimestamp = () => {
  return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    + ", " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const STORAGE_KEY = "discovery-engine-issues";

const loadPersistedIssues = (): Issue[] | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const Index = () => {
  const [issues, setIssues] = useState<Issue[]>(() => loadPersistedIssues() || defaultIssues);
  const [isFetching, setIsFetching] = useState(false);
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue>(() => {
    const persisted = loadPersistedIssues();
    return persisted && persisted.length > 0 ? persisted[0] : defaultIssues[0];
  });
  const [activeTab, setActiveTab] = useState("Correlation Overview");
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);
  const [isWBRModalOpen, setIsWBRModalOpen] = useState(false);
  const [sidebarItem, setSidebarItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(formatTimestamp());

  // Persist issues to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
  }, [issues]);

  // Keep selectedIssue in sync with issues state
  useEffect(() => {
    const updated = issues.find((i) => i.id === selectedIssue.id);
    if (updated) setSelectedIssue(updated);
  }, [issues]);

  const handleFetchData = async () => {
    setIsFetching(true);
    setIsSkeletonVisible(true);

    try {
      const response = await fetch('https://pristine-liane-noncontemplatively.ngrok-free.dev/webhook-test/triage-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ action: "fetch_triage" })
      });

      if (!response.ok) throw new Error(`API failed with status: ${response.status}`);

      const liveData = await response.json();
      const rawArray = liveData.ranked_results ? liveData.ranked_results : liveData;

      if (!Array.isArray(rawArray)) throw new Error("n8n did not return an array.");

      // Load existing persisted statuses
      const existingIssues = loadPersistedIssues() || [];
      const existingMap = new Map(existingIssues.map((i) => [i.name, i]));
      const detectedDate = formatDetectedDate();

      const formattedIssues: Issue[] = rawArray.map((item: any, index: number) => {
        const existing = existingMap.get(item.name);

        // Preserve user-defined statuses (Resolved/Muted)
        if (existing && (existing.status === "Resolved" || existing.status === "Muted")) {
          return { ...existing };
        }

        const riskRaw = item.total_revenue_risk_inr || 0;
        const vol = item.ticket_count || 0;

        return {
          id: index + 1,
          name: item.name,
          risk: `₹${riskRaw.toLocaleString('en-IN')}`,
          riskRaw,
          vol,
          status: riskRaw === 0 ? "Low" : (index === 0 ? "Critical" : "High"),
          trend: riskRaw === 0 ? "flat" : "up",
          traffic: "0",
          drop: "0%",
          aov: "₹0",
          quotes: item.quotes || [],
          rootCause: item.root_cause || "No root cause provided.",
          chartData: generateDynamicChartData(vol, riskRaw, index + 1),
          dateDetected: existing?.dateDetected || detectedDate,
        };
      });

      await new Promise((r) => setTimeout(r, 2000));

      setIssues(formattedIssues);
      if (formattedIssues.length > 0) setSelectedIssue(formattedIssues[0]);
      setLastUpdated(formatTimestamp());
      toast.success("Data refreshed successfully", { description: `${formattedIssues.length} issues loaded from AI triage.` });
    } catch (error) {
      console.error("Connection error details:", error);
      toast.error("Failed to fetch data", { description: "Check console for details." });
      await new Promise((r) => setTimeout(r, 1500));
    } finally {
      setIsFetching(false);
      setIsSkeletonVisible(false);
    }
  };

  const handleResolve = () => {
    const currentIssue = selectedIssue;
    const wasResolved = currentIssue.status === "Resolved";
    const previousStatus = currentIssue.previousStatus || "High";

    setIssues((prev) =>
      prev.map((i) =>
        i.id === currentIssue.id
          ? wasResolved
            ? { ...i, status: previousStatus, previousStatus: undefined }
            : { ...i, status: "Resolved", previousStatus: i.status }
          : i
      )
    );

    if (wasResolved) {
      toast("Issue Reopened", {
        description: `"${currentIssue.name}" moved back to Active Risks.`,
        action: {
          label: "Undo",
          onClick: () => {
            setIssues((prev) => prev.map((i) => i.id === currentIssue.id ? { ...i, status: "Resolved", previousStatus: currentIssue.previousStatus } : i));
          },
        },
      });
    } else {
      toast.success("Issue Resolved", {
        description: `"${currentIssue.name}" marked as resolved.`,
        action: {
          label: "Undo",
          onClick: () => {
            setIssues((prev) => prev.map((i) => i.id === currentIssue.id ? { ...i, status: currentIssue.status, previousStatus: undefined } : i));
          },
        },
      });
      const remaining = issues.filter((i) => i.id !== currentIssue.id && (i.status === "Critical" || i.status === "High" || i.status === "Low"));
      if (remaining.length > 0) setSelectedIssue(remaining[0]);
    }
  };

  const handleMute = () => {
    const currentIssue = selectedIssue;

    setIssues((prev) =>
      prev.map((i) => (i.id === currentIssue.id ? { ...i, status: "Muted", trend: "flat", previousStatus: i.status } : i))
    );

    toast("Theme Muted", {
      description: `"${currentIssue.name}" moved to Muted Noise.`,
      action: {
        label: "Undo",
        onClick: () => {
          setIssues((prev) => prev.map((i) => i.id === currentIssue.id ? { ...i, status: currentIssue.status, trend: currentIssue.trend, previousStatus: undefined } : i));
        },
      },
    });

    const remaining = issues.filter((i) => i.id !== currentIssue.id && (i.status === "Critical" || i.status === "High" || i.status === "Low"));
    if (remaining.length > 0) setSelectedIssue(remaining[0]);
  };

  const filteredIssues = useMemo(() => {
    let list = issues;
    if (sidebarItem === "active-risks") list = issues.filter((i) => i.status === "Critical" || i.status === "High" || i.status === "Low");
    else if (sidebarItem === "muted-noise") list = issues.filter((i) => i.status === "Muted");
    else if (sidebarItem === "resolved") list = issues.filter((i) => i.status === "Resolved");

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
    const filtered =
      item === "active-risks" ? issues.filter((i) => i.status === "Critical" || i.status === "High" || i.status === "Low")
      : item === "muted-noise" ? issues.filter((i) => i.status === "Muted")
      : item === "resolved" ? issues.filter((i) => i.status === "Resolved")
      : issues;
    if (filtered.length > 0) setSelectedIssue(filtered[0]);
  };

  const activeCount = issues.filter((i) => i.status === "Critical" || i.status === "High" || i.status === "Low").length;
  const mutedCount = issues.filter((i) => i.status === "Muted").length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;

  const showDashboard = sidebarItem === "dashboard" || sidebarItem === "active-risks" || sidebarItem === "muted-noise" || sidebarItem === "resolved";

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
      <AppSidebar activeItem={sidebarItem} onItemClick={handleSidebarClick} activeRiskCount={activeCount} mutedNoiseCount={mutedCount} resolvedCount={resolvedCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header isFetching={isFetching} onFetch={handleFetchData} searchQuery={searchQuery} onSearchChange={setSearchQuery} lastUpdated={lastUpdated} />

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
