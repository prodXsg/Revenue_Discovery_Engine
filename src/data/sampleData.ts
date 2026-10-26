import type { Issue } from "@/components/dashboard/TriageTable";

const formatDetectedDate = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const defaultIssues: Issue[] = [
  {
    id: 1,
    name: "iOS 17 UPI Biometric Freeze & Core App Crashes",
    risk: "₹54,68,400",
    riskRaw: 5468400,
    vol: 24,
    status: "Critical",
    trend: "up",
    traffic: "45,000",
    drop: "-1.4%",
    aov: "₹1,200",
    quotes: [
      "App crashes when opening cart with 10+ items",
      "Search results not sorted properly.",
    ],
    rootCause:
      "App crash when attempting UPI biometric authentication on iOS 17. Biometric SDK incompatibility with iOS 17 security sandbox causing payment flow to freeze and crash. Affects 68% of iOS 17 users attempting UPI payments.",
    dateDetected: formatDetectedDate(),
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
    id: 2,
    name: "Order and Payment Issues",
    risk: "₹44,77,880",
    riskRaw: 4477880,
    vol: 13,
    status: "High",
    trend: "up",
    traffic: "32,000",
    drop: "-1.1%",
    aov: "₹1,200",
    quotes: [
      "Payment failed but charged twice.",
      "Refund initiated but money not received.",
    ],
    rootCause:
      "Payment gateway timeout causing double-charge on retry. The retry logic in the payment microservice does not check idempotency keys, leading to duplicate transactions during peak load windows (6-9 PM IST).",
    dateDetected: formatDetectedDate(),
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
    id: 3,
    name: "Deprioritized Noise: Design and Visual Issues",
    risk: "₹0",
    riskRaw: 0,
    vol: 35,
    status: "Low",
    trend: "flat",
    traffic: "50,000",
    drop: "0.0%",
    aov: "₹500",
    quotes: [
      "Homepage colors bilkul bakwas.",
      "Colors absolutely terrible.",
    ],
    rootCause:
      "Cosmetic complaints about color scheme and font rendering on low-DPI Android devices. No measurable conversion or revenue impact detected. Classified as noise by the AI triage engine.",
    dateDetected: formatDetectedDate(),
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

// Sample data. Totals are computed from these rows.
export const pastReports = [
  { week: "W10 2026 (Mar 2-8)", risks: 4, averted: 22400000, status: "Resolved" },
  { week: "W09 2026 (Feb 23-Mar 1)", risks: 3, averted: 26200000, status: "Resolved" },
  { week: "W08 2026 (Feb 16-22)", risks: 5, averted: 17400000, status: "Resolved" },
  { week: "W07 2026 (Feb 9-15)", risks: 2, averted: 39900000, status: "Resolved" },
  { week: "W06 2026 (Feb 2-8)", risks: 6, averted: 36100000, status: "Resolved" },
];

export const sampleNotifications = [
  { id: 1, message: "23 new customer complaints added", time: "2 minutes ago", unread: true },
  { id: 2, message: "Conversion drop detected for Checkout flow", time: "5 minutes ago", unread: true },
  { id: 3, message: "Revenue risk updated to ₹54,68,400/week", time: "12 minutes ago", unread: true },
  { id: 4, message: "New issue created in Jira", time: "30 minutes ago", unread: true },
  { id: 5, message: "Spike detected in payment failure complaints", time: "1 hour ago", unread: true },
  { id: 6, message: "iOS 17 UPI crash reports trending up", time: "2 hours ago", unread: false },
  { id: 7, message: "Weekly triage report ready for review", time: "3 hours ago", unread: false },
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
