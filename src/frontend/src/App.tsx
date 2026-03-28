import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Appointments } from "./components/Appointments";
import { Dashboard } from "./components/Dashboard";
import { Header } from "./components/Header";
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
  | "appointments"
  | "settings";

const VIEW_TITLES: Record<View, string> = {
  dashboard: "Dashboard",
  "new-report": "New Report",
  "edit-report": "Edit Report",
  "view-report": "View Report",
  appointments: "Appointments",
  settings: "Settings",
};

function DisclaimerFooter() {
  return (
    <footer
      className="print:hidden border-t border-border/50 py-3 px-6 text-center"
      data-ocid="app.footer"
    >
      <p className="text-xs text-muted-foreground leading-relaxed">
        The above mentioned findings are for Fatima Medicare clinic use only. It
        is not a concluding ultrasound document and is not valid for any court
        of law or elsewhere. The findings must be correlated with lab data and
        clinical judgment.
      </p>
    </footer>
  );
}

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
      <div className="min-h-screen bg-background flex flex-col">
        {shareLoading || !selectedReport ? (
          <div
            data-ocid="share.loading_state"
            className="flex items-center justify-center flex-1"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading report...</p>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <ViewReport
              report={selectedReport}
              onBack={handleBack}
              onEdit={handleEditReport}
              shareMode
            />
          </div>
        )}
        <DisclaimerFooter />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeView={view}
        onNavigate={(v) => {
          if (v === "new-report") handleNewReport();
          else setView(v);
        }}
      />

      <main className="flex-1 ml-60 min-h-screen flex flex-col">
        <Header title={VIEW_TITLES[view]} />
        <div className="flex-1 overflow-y-auto">
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
          {view === "appointments" && <Appointments />}
          {view === "settings" && <Settings />}
        </div>
        <DisclaimerFooter />
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
