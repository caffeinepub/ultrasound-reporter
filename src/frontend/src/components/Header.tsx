import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header
      className="no-print sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white"
      style={{
        borderBottom: "1px solid oklch(0.88 0.012 220)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center gap-3">
        <h2
          className="text-base font-bold"
          style={{ color: "oklch(0.18 0.035 225)" }}
        >
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div
            className="text-xs font-semibold"
            style={{ color: "oklch(0.25 0.035 225)" }}
          >
            Dr. Siddique Darr
          </div>
          <div className="text-xs" style={{ color: "oklch(0.52 0.025 230)" }}>
            Gujar Khan
          </div>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: "oklch(0.48 0.13 216)" }}
        >
          SD
        </div>
      </div>
    </header>
  );
}
