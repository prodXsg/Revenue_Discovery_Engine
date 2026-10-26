import type { Issue } from "@/components/dashboard/TriageTable";
import { formatRevenueIndian } from "@/lib/revenue";

const formatDetectedDate = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const defaultIssues: Issue[] = [
  {
    id: 1,
    name: "Payment and Order Issues",
    risk: "₹1,83,44,756",
    riskRaw: 18344756,
    vol: 23,
    status: "Critical",
    trend: "up",
    traffic: "458,619",
    drop: "10.00%",
    aov: "₹400",
    quotes: [
      "Payment failed but charged twice.",
      "Refund initiated but money not received.",
    ],
    rootCause:
      "Payment gateway timeout causing double-charge on retry. The retry logic in the payment microservice does not check idempotency keys, leading to duplicate transactions during peak load windows (6-9 PM IST).",
    dateDetected: formatDetectedDate(),
    chartData: [
      { day: "Mon", tickets: 1, conversion: 3.8 },
      { day: "Tue", tickets: 2, conversion: 3.5 },
      { day: "Wed", tickets: 2, conversion: 3.0 },
      { day: "Thu", tickets: 3, conversion: 2.6 },
      { day: "Fri", tickets: 4, conversion: 2.1 },
      { day: "Sat", tickets: 5, conversion: 1.7 },
      { day: "Sun", tickets: 6, conversion: 1.2 },
    ],
  },
  {
    id: 2,
    name: "Design and User Interface Issues",
    risk: "₹26,60,880",
    riskRaw: 2660880,
    vol: 11,
    status: "High",
    trend: "up",
    traffic: "100,033",
    drop: "5.32%",
    aov: "₹500",
    quotes: [],
    rootCause:
      "No root cause analysis available for this issue.",
    dateDetected: formatDetectedDate(),
    chartData: [
      { day: "Mon", tickets: 1, conversion: 4.2 },
      { day: "Tue", tickets: 1, conversion: 4.0 },
      { day: "Wed", tickets: 2, conversion: 3.8 },
      { day: "Thu", tickets: 2, conversion: 3.5 },
      { day: "Fri", tickets: 3, conversion: 3.2 },
      { day: "Sat", tickets: 1, conversion: 2.9 },
      { day: "Sun", tickets: 1, conversion: 2.6 },
    ],
  },
  {
    id: 3,
    name: "User Experience Issues",
    risk: "₹26,25,810",
    riskRaw: 2625810,
    vol: 9,
    status: "High",
    trend: "up",
    traffic: "100,031",
    drop: "5.25%",
    aov: "₹500",
    quotes: [],
    rootCause:
      "No root cause analysis available for this issue.",
    dateDetected: formatDetectedDate(),
    chartData: [
      { day: "Mon", tickets: 1, conversion: 4.2 },
      { day: "Tue", tickets: 1, conversion: 4.0 },
      { day: "Wed", tickets: 1, conversion: 3.8 },
      { day: "Thu", tickets: 2, conversion: 3.5 },
      { day: "Fri", tickets: 2, conversion: 3.2 },
      { day: "Sat", tickets: 1, conversion: 2.9 },
      { day: "Sun", tickets: 1, conversion: 2.6 },
    ],
  },
  {
    id: 4,
    name: "Deprioritized Noise: Design and Visual Issues (Volume Trap)",
    risk: "₹0",
    riskRaw: 0,
    vol: 15,
    status: "Low",
    trend: "flat",
    traffic: "50,000",
    drop: "0.00%",
    aov: "₹500",
    quotes: [
      "Homepage colors bilkul bakwas.",
      "Colors absolutely terrible.",
    ],
    rootCause:
      "Cosmetic complaints about color scheme and font rendering on low-DPI Android devices. No measurable conversion or revenue impact detected. Classified as noise by the AI triage engine.",
    dateDetected: formatDetectedDate(),
    chartData: [
      { day: "Mon", tickets: 2, conversion: 4.1 },
      { day: "Tue", tickets: 2, conversion: 4.1 },
      { day: "Wed", tickets: 3, conversion: 4.0 },
      { day: "Thu", tickets: 3, conversion: 4.1 },
      { day: "Fri", tickets: 2, conversion: 4.1 },
      { day: "Sat", tickets: 2, conversion: 4.0 },
      { day: "Sun", tickets: 1, conversion: 4.1 },
    ],
  },
];

// Sample data. Totals are computed from these rows.
export const pastReports = [
  { week: "W10 2026 (Mar 2-8)", risks: 4, averted: 22400000, status: "Resolved" },
  { week: "W09 2026 (Feb 23-Mar 1)", risks: 3, averted: 26200000, status: "Resolved" },
  { week: "W08 2026 (Feb 16-22)", risks: 5, averted: 17400000, status: "Resolved" },
  { week: "W07 2026 (Feb 9-15)", risks: 2, averted: 39900000, status: "Resolved" },
  { week: "W06 2026 (Feb 2-8)", risks: 6, averted: 36100000, status: "Resolved" },
];

export function computeTotalRiskAtRisk(issues: Issue[]): number {
  return issues
    .filter((i) => i.status === "Critical" || i.status === "High" || i.status === "Low")
    .reduce((sum, i) => sum + i.riskRaw, 0);
}

export function computeActiveIssuesCount(issues: Issue[]): number {
  return issues.filter((i) => i.status === "Critical" || i.status === "High" || i.status === "Low").length;
}

export function computeTotalComplaints(issues: Issue[]): number {
  return issues.reduce((sum, i) => sum + i.vol, 0);
}

export function computeYTDAvertedLeakage(): number {
  return pastReports.reduce((sum, r) => sum + r.averted, 0);
}

export const sampleNotifications = [
  { id: 1, message: "23 new customer complaints added", time: "2 minutes ago", unread: true },
  { id: 2, message: "Conversion drop detected for Checkout flow", time: "5 minutes ago", unread: true },
  { id: 3, message: `Revenue risk updated to ${formatRevenueIndian(computeTotalRiskAtRisk(defaultIssues))}/week`, time: "12 minutes ago", unread: true },
  { id: 4, message: "New issue created in Jira", time: "30 minutes ago", unread: true },
  { id: 5, message: "Spike detected in payment failure complaints", time: "1 hour ago", unread: true },
  { id: 6, message: "iOS 17 UPI crash reports trending up", time: "2 hours ago", unread: false },
  { id: 7, message: "Weekly triage report ready for review", time: "3 hours ago", unread: false },
];
