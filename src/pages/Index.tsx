import { useState } from "react";
import AppSidebar from "@/components/dashboard/AppSidebar";
import Header from "@/components/dashboard/Header";
import KPICards from "@/components/dashboard/KPICards";
import TriageTable from "@/components/dashboard/TriageTable";
import DeepDivePanel from "@/components/dashboard/DeepDivePanel";
import JiraModal from "@/components/dashboard/JiraModal";
import type { Issue } from "@/components/dashboard/TriageTable";

const issues: Issue[] = [
  { id: 1, name: "iOS 17 UPI Biometric Freeze & Core App Crashes", risk: "₹54,68,400", riskRaw: 5468400, vol: 24, status: "Critical", trend: "up", traffic: "45,000", drop: "-1.4%", aov: "₹1,200", quotes: ["App crashes when opening cart with 10+ items", "Search results not sorted properly."] },
  { id: 2, name: "Order and Payment Issues", risk: "₹44,77,880", riskRaw: 4477880, vol: 13, status: "High", trend: "up", traffic: "32,000", drop: "-1.1%", aov: "₹1,200", quotes: ["Payment failed but charged twice.", "Refund initiated but money not received."] },
  { id: 3, name: "Deprioritized Noise: Design and Visual Issues", risk: "₹0", riskRaw: 0, vol: 35, status: "Muted", trend: "flat", traffic: "50,000", drop: "0.0%", aov: "₹500", quotes: ["Homepage colors bilkul bakwas.", "Colors absolutely terrible."] },
];

const Index = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue>(issues[0]);
  const [activeTab, setActiveTab] = useState("Correlation Overview");
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);
  const [sidebarItem, setSidebarItem] = useState("dashboard");

  const handleFetch = () => {
    setIsFetching(true);
    setTimeout(() => setIsFetching(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeItem={sidebarItem} onItemClick={setSidebarItem} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header isFetching={isFetching} onFetch={handleFetch} />

        <main className="flex-1 p-6 space-y-5 overflow-auto">
          <KPICards />
          <TriageTable issues={issues} selectedId={selectedIssue.id} onSelect={setSelectedIssue} />
          <DeepDivePanel
            issue={selectedIssue}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCreateJira={() => setIsJiraModalOpen(true)}
          />
        </main>
      </div>

      <JiraModal
        issue={selectedIssue}
        isOpen={isJiraModalOpen}
        onClose={() => setIsJiraModalOpen(false)}
      />
    </div>
  );
};

export default Index;
