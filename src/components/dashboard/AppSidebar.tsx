import {
  LayoutDashboard,
  AlertTriangle,
  VolumeX,
  Plug,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  activeRiskCount?: number;
  mutedNoiseCount?: number;
}

const AppSidebar = ({ activeItem, onItemClick, activeRiskCount = 2, mutedNoiseCount = 1 }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "active-risks", label: `Active Risks (${activeRiskCount})`, icon: AlertTriangle },
    { id: "muted-noise", label: `Muted Noise (${mutedNoiseCount})`, icon: VolumeX },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "settings", label: "Settings", icon: Settings },
  ];

return (
  return (
    <aside className="w-60 min-h-screen bg-squid-ink flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-squid-ink-light">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-secondary-foreground">Discovery</span>
          <span className="text-amazon-orange">Engine</span>
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-secondary-foreground border-l-[3px] border-amazon-orange"
                  : "text-sidebar-foreground hover:bg-squid-ink-light hover:text-secondary-foreground"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-squid-ink-light flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amazon-orange flex items-center justify-center text-primary-foreground text-xs font-bold">
            SG
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-foreground">Surya G.</p>
            <p className="text-xs text-sidebar-foreground">Sr. PM</p>
          </div>
        </div>
        <button className="text-sidebar-foreground hover:text-secondary-foreground transition-colors">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
