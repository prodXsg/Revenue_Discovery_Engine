import { useState, useRef, useEffect } from "react";
import { Search, Bell, RefreshCw } from "lucide-react";

interface HeaderProps {
  isFetching: boolean;
  onFetch: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const notifications = [
  { id: 1, message: "23 new customer complaints added", time: "2 minutes ago", unread: true },
  { id: 2, message: "Conversion drop detected for Checkout flow", time: "5 minutes ago", unread: true },
  { id: 3, message: "Revenue risk updated to ₹54,68,400/week", time: "12 minutes ago", unread: true },
  { id: 4, message: "New issue created in Jira", time: "30 minutes ago", unread: true },
  { id: 5, message: "Spike detected in payment failure complaints", time: "1 hour ago", unread: true },
  { id: 6, message: "iOS 17 UPI crash reports trending up", time: "2 hours ago", unread: false },
  { id: 7, message: "Weekly triage report ready for review", time: "3 hours ago", unread: false },
];

const Header = ({ isFetching, onFetch, searchQuery, onSearchChange }: HeaderProps) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread && !readIds.has(n.id)).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotifClick = (id: number) => {
    setReadIds((prev) => new Set(prev).add(id));
  };

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

        {/* Bell with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-risk-red text-[10px] font-bold text-primary-foreground flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-bold text-foreground">Notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => {
                  const isUnread = n.unread && !readIds.has(n.id);
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleNotifClick(n.id)}
                      className={`w-full text-left px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors flex items-start gap-3 ${
                        isUnread ? "bg-muted/30" : ""
                      }`}
                    >
                      {isUnread && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-amazon-orange shrink-0" />
                      )}
                      <div className={isUnread ? "" : "pl-5"}>
                        <p className={`text-sm ${isUnread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                          {n.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <button className="text-xs font-medium text-amazon-orange hover:underline w-full text-center">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fetch Button */}
        <button
          onClick={onFetch}
          disabled={isFetching}
          className="h-8 px-4 rounded bg-amazon-orange text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin-slow" : ""} />
          {isFetching ? "Running AI Triage..." : "Fetch New Data"}
        </button>
      </div>
    </header>
  );
};

export default Header;
