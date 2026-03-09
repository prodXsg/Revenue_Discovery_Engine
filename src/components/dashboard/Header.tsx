import { Search, Bell, RefreshCw } from "lucide-react";

interface HeaderProps {
  isFetching: boolean;
  onFetch: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ isFetching, onFetch, searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-base font-bold text-foreground tracking-tight">Revenue Discovery Report</h2>
        <p className="text-xs text-muted-foreground">Last sync: 2 mins ago</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search issues..."
            className="h-8 w-52 rounded bg-background border border-border pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Bell */}
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-risk-red" />
        </button>

        {/* Fetch Button */}
        <button
          onClick={onFetch}
          disabled={isFetching}
          className="h-8 px-4 rounded bg-amazon-orange text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin-slow" : ""} />
          {isFetching ? "Running AI Triage..." : "Fetch Live Telemetry"}
        </button>
      </div>
    </header>
  );
};

export default Header;
