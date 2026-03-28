import {
  CalendarDays,
  FilePlus,
  FileText,
  LayoutDashboard,
  Settings,
  Stethoscope,
} from "lucide-react";

type View =
  | "dashboard"
  | "new-report"
  | "edit-report"
  | "view-report"
  | "appointments"
  | "settings";

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const navItems = [
  { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
  { id: "new-report" as View, label: "New Report", icon: FilePlus },
  { id: "edit-report" as View, label: "Reports", icon: FileText },
  { id: "appointments" as View, label: "Appointments", icon: CalendarDays },
];

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const isActive = (id: View) => {
    if (id === "edit-report")
      return activeView === "edit-report" || activeView === "view-report";
    return activeView === id;
  };

  return (
    <aside className="no-print fixed left-0 top-0 h-full w-60 flex flex-col z-20 medical-sidebar">
      {/* Brand */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1px solid oklch(0.88 0.012 220)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "oklch(0.48 0.13 216)",
              boxShadow: "0 2px 8px rgba(0, 100, 180, 0.25)",
            }}
          >
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold leading-tight text-foreground">
              Dr. Siddique Darr
            </div>
            <div
              className="text-xs leading-tight font-semibold tracking-wide"
              style={{ color: "oklch(0.48 0.13 216)" }}
            >
              Gujar Khan
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-4 space-y-0.5"
        aria-label="Main navigation"
      >
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = isActive(id);
          return (
            <button
              type="button"
              key={id}
              data-ocid={`nav.${id}.link`}
              onClick={() =>
                onNavigate(id === "edit-report" ? "dashboard" : id)
              }
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150"
              style={{
                background: active ? "oklch(0.93 0.04 216)" : "transparent",
                color: active
                  ? "oklch(0.35 0.14 216)"
                  : "oklch(0.42 0.025 230)",
                borderLeft: active
                  ? "3px solid oklch(0.48 0.13 216)"
                  : "3px solid transparent",
                paddingLeft: active ? "calc(0.75rem - 3px)" : "0.75rem",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "oklch(0.96 0.012 216)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.32 0.12 216)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.42 0.025 230)";
                }
              }}
            >
              <Icon
                className="w-4 h-4 flex-shrink-0"
                style={{ color: active ? "oklch(0.48 0.13 216)" : "inherit" }}
              />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div
        className="px-3 pb-4 pt-3"
        style={{ borderTop: "1px solid oklch(0.88 0.012 220)" }}
      >
        <button
          type="button"
          data-ocid="nav.settings.link"
          onClick={() => onNavigate("settings")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150"
          style={{
            background:
              activeView === "settings"
                ? "oklch(0.93 0.04 216)"
                : "transparent",
            color:
              activeView === "settings"
                ? "oklch(0.35 0.14 216)"
                : "oklch(0.42 0.025 230)",
            borderLeft:
              activeView === "settings"
                ? "3px solid oklch(0.48 0.13 216)"
                : "3px solid transparent",
            paddingLeft:
              activeView === "settings" ? "calc(0.75rem - 3px)" : "0.75rem",
          }}
          onMouseEnter={(e) => {
            if (activeView !== "settings") {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.96 0.012 216)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.32 0.12 216)";
            }
          }}
          onMouseLeave={(e) => {
            if (activeView !== "settings") {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.42 0.025 230)";
            }
          }}
        >
          <Settings
            className="w-4 h-4 flex-shrink-0"
            style={{
              color:
                activeView === "settings" ? "oklch(0.48 0.13 216)" : "inherit",
            }}
          />
          Settings
        </button>
        <div className="mt-3 px-3">
          <div className="text-xs" style={{ color: "oklch(0.65 0.015 230)" }}>
            Dr. Siddique Darr
          </div>
        </div>
      </div>
    </aside>
  );
}
