import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Eye,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteReport, useListReports } from "../hooks/useQueries";
import type { Report } from "../hooks/useQueries";

const EXAM_TYPES = [
  "All Types",
  "Abdomen",
  "Pelvis",
  "Obstetric",
  "Thyroid",
  "Breast",
  "Cardiac",
  "Musculoskeletal",
  "Vascular",
  "Renal",
  "Liver",
  "Neck",
];

interface DashboardProps {
  onNewReport: () => void;
  onEditReport: (report: Report) => void;
  onViewReport: (report: Report) => void;
}

function StatusBadge({ isNormal }: { isNormal: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isNormal
          ? "bg-success text-success-foreground"
          : "bg-destructive/15 text-destructive"
      }`}
    >
      {isNormal ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      {isNormal ? "Normal" : "Abnormal"}
    </span>
  );
}

export function Dashboard({
  onNewReport,
  onEditReport,
  onViewReport,
}: DashboardProps) {
  const { data: reports = [], isLoading } = useListReports();
  const deleteMut = useDeleteReport();
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("All Types");
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const filtered = reports.filter((r) => {
    const matchName = r.patientName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchType = examFilter === "All Types" || r.examType === examFilter;
    return matchName && matchType;
  });

  const totalNormal = reports.filter((r) => r.isNormal).length;
  const totalAbnormal = reports.filter((r) => !r.isNormal).length;

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteMut.mutateAsync(deleteId);
      toast.success("Report deleted");
    } catch {
      toast.error("Failed to delete report");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your ultrasound reports
          </p>
        </div>
        <Button
          data-ocid="dashboard.new_report.primary_button"
          onClick={onNewReport}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Report
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Reports",
            value: reports.length,
            icon: FileText,
            color: "text-primary",
          },
          {
            label: "Normal",
            value: totalNormal,
            icon: CheckCircle,
            color: "text-success-foreground",
          },
          {
            label: "Abnormal",
            value: totalAbnormal,
            icon: XCircle,
            color: "text-destructive",
          },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card rounded-lg border border-border p-5 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {m.label}
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {m.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${m.color}`}
              >
                <m.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reports table card */}
      <div className="bg-card rounded-lg border border-border shadow-card">
        <div className="p-4 border-b border-border flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="dashboard.search_input"
              placeholder="Search by patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={examFilter} onValueChange={setExamFilter}>
            <SelectTrigger
              data-ocid="dashboard.exam_type.select"
              className="w-44"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXAM_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div
            data-ocid="dashboard.loading_state"
            className="flex items-center justify-center py-16 gap-3 text-muted-foreground"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading reports...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="dashboard.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <FileText className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              {search || examFilter !== "All Types"
                ? "No reports match your filters"
                : "No reports yet"}
            </p>
            {!search && examFilter === "All Types" && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={onNewReport}
              >
                Create your first report
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Patient Name", "Age", "Exam Type", "Date", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((report, idx) => (
                  <motion.tr
                    key={Number(report.id)}
                    data-ocid={`reports.item.${idx + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => onViewReport(report)}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {report.patientName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {report.patientAge}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">
                        {report.examType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {report.examDate}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge isNormal={report.isNormal} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          data-ocid={`reports.view.button.${idx + 1}`}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewReport(report);
                          }}
                          title="View report"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          data-ocid={`reports.edit.button.${idx + 1}`}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditReport(report);
                          }}
                          title="Edit report"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          data-ocid={`reports.delete_button.${idx + 1}`}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(report.id);
                          }}
                          title="Delete report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="reports.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this report? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="reports.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="reports.delete.confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMut.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
