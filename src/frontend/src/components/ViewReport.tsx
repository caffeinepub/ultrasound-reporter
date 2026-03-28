import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Copy, Pencil, Printer, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";
import type { Report } from "../hooks/useQueries";

interface ViewReportProps {
  report: Report;
  onBack: () => void;
  onEdit: (report: Report) => void;
  shareMode?: boolean;
}

export function ViewReport({
  report,
  onBack,
  onEdit,
  shareMode,
}: ViewReportProps) {
  const [shareOpen, setShareOpen] = useState(false);

  const shareUrl = `${window.location.origin + window.location.pathname}#share/${Number(report.id)}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied!");
  };

  return (
    <div className="p-8 max-w-3xl print-content">
      {/* Action bar (hidden on print) */}
      <div className="no-print flex items-center gap-3 mb-8">
        {!shareMode && (
          <Button
            data-ocid="view_report.back.button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Report Preview</h1>
          <p className="text-sm text-muted-foreground">
            Print-ready report view
          </p>
        </div>
        {!shareMode && (
          <Button
            data-ocid="view_report.edit.button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(report)}
            className="gap-2"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>
        )}
        <Button
          data-ocid="view_report.share.button"
          variant="outline"
          size="sm"
          onClick={() => setShareOpen(true)}
          className="gap-2"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </Button>
        <Button
          data-ocid="view_report.print.button"
          size="sm"
          onClick={() => window.print()}
          className="gap-2"
        >
          <Printer className="w-3.5 h-3.5" />
          Print
        </Button>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent data-ocid="share.dialog" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-2">
            <div className="p-4 bg-white rounded-xl border border-border shadow-sm">
              <QRCodeSVG value={shareUrl} size={200} />
            </div>
            <div className="w-full space-y-3">
              <div className="flex gap-2">
                <Input
                  data-ocid="share.input"
                  value={shareUrl}
                  readOnly
                  className="text-xs font-mono"
                />
                <Button
                  data-ocid="share.copy_link.button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Button
                data-ocid="share.primary_button"
                className="w-full gap-2"
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Anyone with this link can view this report
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report document */}
      <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
        {/* Clinic header */}
        <div className="bg-primary px-8 py-6 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Dr. Siddique Darr
              </h2>
              <p className="text-sm opacity-80 mt-0.5">
                Housing Sakeem No 01, near DSP office Gujar Khan
              </p>
              <p className="text-xs opacity-60 mt-1" />
            </div>
            <div className="text-right">
              <div className="text-xs opacity-70 uppercase tracking-wide">
                Ultrasound Report
              </div>
              <div className="text-sm font-semibold mt-1">
                Report #{Number(report.id)}
              </div>
              <div className="text-xs opacity-70 mt-0.5">{report.examDate}</div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Status badge */}
          <div className="flex justify-end mb-5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                report.isNormal
                  ? "bg-success text-success-foreground"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {report.isNormal ? "✓ Normal" : "⚠ Abnormal"}
            </span>
          </div>

          {/* Patient info table */}
          <div className="border border-border rounded-lg overflow-hidden mb-6">
            <div className="bg-muted/40 px-4 py-2 border-b border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Patient Information
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-0">
              {[
                ["Patient Name", report.patientName],
                ["Age", report.patientAge],
                ["Gender", report.patientGender],
                ["Exam Date", report.examDate],
                ["Referring Doctor", report.referringDoctor || "—"],
                ["Exam Type", report.examType],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  className={`px-4 py-3 flex gap-3 ${
                    i % 2 === 0 && i + 1 < 6
                      ? "border-r border-b border-border"
                      : i % 2 === 1 && i < 5
                        ? "border-b border-border"
                        : ""
                  }`}
                >
                  <span className="text-xs font-medium text-muted-foreground w-32 flex-shrink-0">
                    {label}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Report sections */}
          {[
            { title: "Indication", content: report.indication },
            { title: "Technique", content: report.technique },
            { title: "Findings", content: report.findings },
            { title: "Impression / Conclusion", content: report.impression },
          ].map(({ title, content }) => (
            <div key={title} className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 rounded-full bg-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  {title}
                </h3>
              </div>
              <div className="ml-4 pl-3 border-l-2 border-border">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {content || (
                    <span className="text-muted-foreground italic">
                      Not provided
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Report generated on{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              Dr. Siddique Darr — Confidential Medical Document
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
