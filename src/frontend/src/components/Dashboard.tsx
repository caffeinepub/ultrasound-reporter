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
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isNormal ? "medical-badge-normal" : "medical-badge-abnormal"
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

const METRIC_CONFIGS = [
  {
    label: "Total Reports",
    icon: FileText,
    iconColor: "oklch(0.48 0.13 216)",
    borderColor: "oklch(0.48 0.13 216)",
    iconBg: "oklch(0.93 0.04 216)",
    key: "total" as const,
  },
  {
    label: "Normal",
    icon: CheckCircle,
    iconColor: "oklch(0.45 0.15 155)",
    borderColor: "oklch(0.58 0.14 155)",
    iconBg: "oklch(0.94 0.06 155)",
    key: "normal" as const,
  },
  {
    label: "Abnormal",
    icon: XCircle,
    iconColor: "oklch(0.48 0.2 28)",
    borderColor: "oklch(0.62 0.18 28)",
    iconBg: "oklch(0.95 0.06 28)",
    key: "abnormal" as const,
  },
];

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

  const metricValues = {
    total: reports.length,
    normal: totalNormal,
    abnormal: totalAbnormal,
  };

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
    <div className="p-8" style={{ background: "oklch(0.975 0.005 220)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "oklch(0.18 0.035 225)" }}
          >
            Dashboard
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "oklch(0.52 0.025 230)" }}
          >
            Manage your ultrasound reports
          </p>
        </div>
        <button
          type="button"
          data-ocid="dashboard.new_report.primary_button"
          onClick={onNewReport}
          className="medical-button flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          New Report
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {METRIC_CONFIGS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.07,
              type: "spring",
              stiffness: 220,
              damping: 22,
            }}
            className="medical-card medical-card-hover rounded-lg p-5 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: m.iconBg,
                borderLeft: `4px solid ${m.borderColor}`,
              }}
            >
              <m.icon className="w-5 h-5" style={{ color: m.iconColor }} />
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "oklch(0.55 0.02 230)" }}
              >
                {m.label}
              </p>
              <p
                className="text-3xl font-bold mt-0.5"
                style={{ color: "oklch(0.18 0.035 225)" }}
              >
                {metricValues[m.key]}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reports table card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.22,
          type: "spring",
          stiffness: 160,
          damping: 22,
        }}
        className="medical-card rounded-lg overflow-hidden"
      >
        {/* Card header */}
        <div
          className="px-5 py-3.5 flex items-center justify-between"
          style={{
            borderBottom: "1px solid oklch(0.88 0.012 220)",
            background: "oklch(0.975 0.005 220)",
          }}
        >
          <h2
            className="text-sm font-semibold"
            style={{ color: "oklch(0.25 0.03 225)" }}
          >
            Patient Reports
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "oklch(0.93 0.04 216)",
              color: "oklch(0.38 0.12 216)",
            }}
          >
            {filtered.length} records
          </span>
        </div>

        {/* Filters */}
        <div
          className="px-4 py-3 flex gap-3 flex-wrap"
          style={{ borderBottom: "1px solid oklch(0.88 0.012 220)" }}
        >
          <div className="relative flex-1 min-w-48">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "oklch(0.58 0.02 230)" }}
            />
            <Input
              data-ocid="dashboard.search_input"
              placeholder="Search by patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Select value={examFilter} onValueChange={setExamFilter}>
            <SelectTrigger
              data-ocid="dashboard.exam_type.select"
              className="w-44 bg-white"
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
            className="flex items-center justify-center py-16 gap-3"
            style={{ color: "oklch(0.52 0.025 230)" }}
          >
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: "oklch(0.48 0.13 216)" }}
            />
            <span className="text-sm">Loading reports...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="dashboard.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <FileText
              className="w-10 h-10 mb-3"
              style={{ color: "oklch(0.75 0.04 230)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "oklch(0.52 0.025 230)" }}
            >
              {search || examFilter !== "All Types"
                ? "No reports match your filters"
                : "No reports yet"}
            </p>
            {!search && examFilter === "All Types" && (
              <button
                type="button"
                className="medical-button mt-4 px-4 py-2 rounded-md text-sm font-medium"
                onClick={onNewReport}
              >
                Create your first report
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid oklch(0.88 0.012 220)",
                    background: "oklch(0.975 0.005 220)",
                  }}
                >
                  {["Patient Name", "Age", "Exam Type", "Date", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "oklch(0.42 0.03 225)" }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                  <th
                    className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "oklch(0.42 0.03 225)" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((report, idx) => (
                  <motion.tr
                    key={Number(report.id)}
                    data-ocid={`reports.item.${idx + 1}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.035 }}
                    className="medical-row-hover cursor-pointer"
                    style={{
                      borderBottom: "1px solid oklch(0.92 0.008 220)",
                      background:
                        idx % 2 === 1 ? "oklch(0.985 0.003 220)" : "white",
                    }}
                    onClick={() => onViewReport(report)}
                  >
                    <td
                      className="px-4 py-3 font-semibold"
                      style={{ color: "oklch(0.2 0.03 225)" }}
                    >
                      {report.patientName}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.45 0.025 230)" }}
                    >
                      {report.patientAge}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                          background: "oklch(0.93 0.04 216)",
                          border: "1px solid oklch(0.82 0.08 216)",
                          color: "oklch(0.38 0.12 216)",
                        }}
                      >
                        {report.examType}
                      </Badge>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.45 0.025 230)" }}
                    >
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
                          style={{ color: "oklch(0.48 0.13 216)" }}
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
                          style={{ color: "oklch(0.48 0.13 216)" }}
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
                          className="h-7 w-7"
                          style={{ color: "oklch(0.52 0.22 28)" }}
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
      </motion.div>

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
