export interface RevenueCalculation {
  formatted: string;
  raw: number;
  available: boolean;
}

export function revenueAtRisk(
  traffic: string | number | null | undefined,
  dropPct: string | number | null | undefined,
  aov: string | number | null | undefined
): RevenueCalculation | null {
  const trafficNum = typeof traffic === "string" ? parseInt(traffic.replace(/,/g, ""), 10) : traffic;
  const dropNum = typeof dropPct === "string" ? parseFloat(dropPct.replace("%", "")) : dropPct;
  const aovNum = typeof aov === "string" ? parseInt(aov.replace(/[₹,]/g, ""), 10) : aov;

  if (trafficNum == null || dropNum == null || aovNum == null) {
    return null;
  }

  if (!Number.isFinite(trafficNum) || !Number.isFinite(dropNum) || !Number.isFinite(aovNum)) {
    return null;
  }

  const raw = trafficNum * (Math.abs(dropNum) / 100) * aovNum;

  if (!Number.isFinite(raw)) {
    return null;
  }

  const formatted = formatRevenueIndian(raw);

  return {
    formatted,
    raw,
    available: true,
  };
}

export function formatRevenueIndian(amount: number): string {
  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    return (
      "₹" +
      (amount / 10000000).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) +
      " Cr"
    );
  }

  if (absAmount >= 100000) {
    return (
      "₹" +
      (amount / 100000).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) +
      " L"
    );
  }

  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

export function formatSimpleIndian(amount: number): string {
  return Math.round(amount).toLocaleString("en-IN");
}
