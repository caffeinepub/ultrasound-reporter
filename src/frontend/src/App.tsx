import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { ReportForm } from "./components/ReportForm";
import { Settings } from "./components/Settings";
import { Sidebar } from "./components/Sidebar";
import { ViewReport } from "./components/ViewReport";
import { useActor } from "./hooks/useActor";
import type { Report } from "./hooks/useQueries";

const queryClient = new QueryClient();

type View =
  | "dashboard"
  | "new-report"
  | "edit-report"
  | "view-report"
  | "settings";

function AppInner() {
  const [view, setView] = useState<View>("dashboard");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [shareMode, setShareMode] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const { actor } = useActor();

  // Handle #share/{id} hash routing on mount
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#share\/(\d+)$/);
    if (!match) return;
    setShareLoading(true);
    setShareMode(true);
    setView("view-report");
  }, []);

  // Fetch the report when actor becomes available in share mode
  useEffect(() => {
    if (!shareMode || !actor) return;
    const hash = window.location.hash;
    const match = hash.match(/^#share\/(\d+)$/);
    if (!match) return;
    const reportId = BigInt(match[1]);
    actor
      .getReport(reportId)
      .then((report) => {
        setSelectedReport(report);
        setView("view-report");
      })
      .catch(() => {
        setShareMode(false);
        setView("dashboard");
      })
      .finally(() => setShareLoading(false));
  }, [shareMode, actor]);

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setView("edit-report");
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setView("view-report");
  };

  const handleNewReport = () => {
    setSelectedReport(null);
    setView("new-report");
  };

  const handleSaved = () => setView("dashboard");
  const handleBack = () => {
    setShareMode(false);
    setView("dashboard");
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  };

  // Share mode: fullscreen view without sidebar
  if (shareMode) {
    return (
      <div className="min-h-screen bg-background">
        {shareLoading || !selectedReport ? (
          <div
            data-ocid="share.loading_state"
            className="flex items-center justify-center min-h-screen"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading report...</p>
            </div>
          </div>
        ) : (
          <ViewReport
            report={selectedReport}
            onBack={handleBack}
            onEdit={handleEditReport}
            shareMode
          />
        )}
        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeView={view}
        onNavigate={(v) => {
          if (v === "new-report") handleNewReport();
          else setView(v);
        }}
      />

      <main className="flex-1 ml-60 min-h-screen bg-background overflow-y-auto">
        {view === "dashboard" && (
          <Dashboard
            onNewReport={handleNewReport}
            onEditReport={handleEditReport}
            onViewReport={handleViewReport}
          />
        )}
        {view === "new-report" && (
          <ReportForm mode="new" onBack={handleBack} onSaved={handleSaved} />
        )}
        {view === "edit-report" && selectedReport && (
          <ReportForm
            key={String(selectedReport?.id)}
            mode="edit"
            initialReport={selectedReport}
            onBack={handleBack}
            onSaved={handleSaved}
          />
        )}
        {view === "view-report" && selectedReport && (
          <ViewReport
            report={selectedReport}
            onBack={handleBack}
            onEdit={handleEditReport}
          />
        )}
        {view === "settings" && <Settings />}
      </main>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
