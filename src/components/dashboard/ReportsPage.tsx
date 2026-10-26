import { TrendingUp, Calendar, FileBarChart } from "lucide-react";
import { pastReports, computeYTDAvertedLeakage } from "@/data/sampleData";
import { formatRevenueIndian } from "@/lib/revenue";

const ReportsPage = () => {
  const ytdLeakage = computeYTDAvertedLeakage();
  const ytdDisplay = formatRevenueIndian(ytdLeakage);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground tracking-tight">Historical WBR Reports</h2>
        <p className="text-sm text-muted-foreground">Weekly Business Review — Revenue risk analysis archive</p>
      </div>

      {/* Hero KPI */}
      <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-6">
        <div className="w-14 h-14 rounded-xl bg-success-green/10 flex items-center justify-center">
          <TrendingUp size={28} className="text-success-green" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Averted Revenue Leakage (YTD)</p>
          <p className="text-3xl font-bold text-foreground tracking-tight mt-1">{ytdDisplay}</p>
          <p className="text-xs text-success-green font-semibold mt-1">Sample data. 23% improvement vs last quarter.</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <Calendar size={14} className="text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">Past WBR Reports</h3>
        </div>
        {pastReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <FileBarChart size={32} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1">No historical reports yet</p>
            <p className="text-xs text-muted-foreground">Weekly Business Review reports will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                <th className="text-left px-5 py-2.5 font-medium">Week</th>
                <th className="text-right px-5 py-2.5 font-medium">Risks Found</th>
                <th className="text-right px-5 py-2.5 font-medium">Revenue Averted</th>
                <th className="text-right px-5 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {pastReports.map((r) => (
                <tr key={r.week} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground flex items-center gap-2">
                    <FileBarChart size={14} className="text-muted-foreground" />
                    {r.week}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-foreground">{r.risks}</td>
                  <td className="px-5 py-3 text-right font-mono font-bold text-success-green">{formatRevenueIndian(r.averted)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-xs px-2 py-0.5 rounded bg-success-green/10 text-success-green font-semibold">{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
