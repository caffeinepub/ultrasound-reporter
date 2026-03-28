import {
  FilePlus,
  FileText,
  LayoutDashboard,
  Settings,
  Shield,
} from "lucide-react";

type View = "dashboard" | "new-report" | "edit-report" | "view-report";

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const navItems = [
  { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
  { id: "new-report" as View, label: "New Report", icon: FilePlus },
  { id: "edit-report" as View, label: "Reports", icon: FileText },
];

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const isActive = (id: View) => {
    if (id === "edit-report")
      return activeView === "edit-report" || activeView === "view-report";
    return activeView === id;
  };

  return (
    <aside
      className="no-print fixed left-0 top-0 h-full w-60 flex flex-col z-20"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.27 0.09 240) 0%, oklch(0.22 0.08 240) 100%)",
      }}
    >
      {/* Brand */}
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold text-sidebar-foreground leading-tight">
              SonoReport
            </div>
            <div className="text-xs text-sidebar-primary leading-tight">
              Pro
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            data-ocid={`nav.${id}.link`}
            onClick={() => onNavigate(id === "edit-report" ? "dashboard" : id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              isActive(id)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-primary hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-4 border-t border-sidebar-border pt-4">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-primary hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Settings
        </button>
        <div className="mt-3 px-3 py-2">
          <div className="text-xs text-sidebar-primary opacity-70">
            SonoReport Pro v1.0
          </div>
        </div>
      </div>
    </aside>
  );
}
