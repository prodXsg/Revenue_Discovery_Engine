import { Search, RefreshCw } from "lucide-react";

interface HeaderProps {
  isFetching: boolean;
  onFetch: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  lastUpdated: string | null;
  isUsingDemoData: boolean;
}

const Header = ({ isFetching, onFetch, searchQuery, onSearchChange, lastUpdated, isUsingDemoData }: HeaderProps) => {

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-foreground tracking-tight">Revenue Discovery Report</h2>
          {isUsingDemoData && (
            <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-muted text-muted-foreground">
              Sample data
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {lastUpdated ? `Last Updated: ${lastUpdated}` : "Last sync: 2 mins ago"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search issues or root causes..."
            className="h-8 w-64 rounded bg-background border border-border pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>

        {/* Fetch Button */}
        <button
          onClick={onFetch}
          disabled={isFetching}
          className="h-8 px-4 rounded bg-amazon-orange text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2 transition-opacity disabled:opacity-70"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin-slow" : ""} />
          {isFetching ? "Running AI Triage..." : "Fetch New Data"}
        </button>
      </div>
    </header>
  );
};

export default Header;
