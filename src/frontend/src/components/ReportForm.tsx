import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, FileText, Loader2, Save } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateReport,
  useGetTemplates,
  useUpdateReport,
} from "../hooks/useQueries";
import type { Report, Template } from "../hooks/useQueries";

const EXAM_TYPES = [
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

const TERMINOLOGY_CHIPS = [
  "No focal lesion",
  "Normal echogenicity",
  "No free fluid",
  "No calcification",
  "Normal vascularity",
  "Homogeneous texture",
  "Well-defined margins",
  "No lymphadenopathy",
  "Normal size",
  "No mass lesion",
];

const FALLBACK_TEMPLATES: Template[] = [
  {
    id: BigInt(1),
    name: "Normal Abdomen",
    examType: "Abdomen",
    indication: "Abdominal pain/routine evaluation",
    technique: "Grey-scale and Doppler ultrasound of the abdomen",
    findings:
      "The liver is normal in size and echogenicity. No focal hepatic lesion identified. The gallbladder is normal with no calculi or polyps. Common bile duct is not dilated. The pancreas is normal in size and echogenicity. Both kidneys are normal in size, echogenicity and cortical thickness. No hydronephrosis or calculi. The spleen is normal. No ascites.",
    impression: "Normal abdominal ultrasound.",
  },
  {
    id: BigInt(2),
    name: "OB First Trimester",
    examType: "Obstetric",
    indication: "Dating scan / first trimester evaluation",
    technique: "Transabdominal and transvaginal ultrasound",
    findings:
      "Single live intrauterine pregnancy. Crown-rump length (CRL) measures compatible with gestational age. Fetal cardiac activity is present. Yolk sac is visualized. No subchorionic hematoma. Uterus and adnexa are unremarkable.",
    impression: "Single live intrauterine pregnancy, consistent with dates.",
  },
  {
    id: BigInt(3),
    name: "Thyroid",
    examType: "Thyroid",
    indication: "Thyroid nodule evaluation / neck swelling",
    technique:
      "High-frequency grey-scale and Doppler ultrasound of the thyroid gland",
    findings:
      "The thyroid gland is normal in size. Right lobe measures within normal limits. Left lobe measures within normal limits. Isthmus is not thickened. Gland echogenicity is normal and homogeneous. No focal nodule identified. No cervical lymphadenopathy.",
    impression: "Normal thyroid ultrasound.",
  },
  {
    id: BigInt(4),
    name: "Pelvis (Female)",
    examType: "Pelvis",
    indication: "Pelvic pain / routine pelvic evaluation",
    technique: "Transabdominal and transvaginal ultrasound of the pelvis",
    findings:
      "The uterus is normal in size and position. Endometrial thickness is within normal limits for the stated menstrual phase. No intramural, submucosal or subserosal fibroids. Both ovaries are normal in size and morphology. No adnexal mass or cyst. No free fluid in the pelvis.",
    impression: "Normal pelvic ultrasound.",
  },
  {
    id: BigInt(5),
    name: "Breast",
    examType: "Breast",
    indication: "Breast lump evaluation / breast pain",
    technique:
      "High-frequency grey-scale and Doppler ultrasound of both breasts and axillae",
    findings:
      "Both breasts show normal fibroglandular tissue. No discrete solid or cystic mass identified. No abnormal vascularity. No axillary lymphadenopathy.",
    impression: "No sonographic abnormality detected in both breasts.",
  },
];

interface ReportFormProps {
  mode: "new" | "edit";
  initialReport?: Report;
  onBack: () => void;
  onSaved: () => void;
}

interface FormState {
  patientName: string;
  patientAge: string;
  patientGender: string;
  examDate: string;
  referringDoctor: string;
  examType: string;
  indication: string;
  technique: string;
  findings: string;
  impression: string;
  isNormal: boolean;
}

const DEFAULT_FORM: FormState = {
  patientName: "",
  patientAge: "",
  patientGender: "",
  examDate: new Date().toISOString().split("T")[0],
  referringDoctor: "",
  examType: "",
  indication: "",
  technique: "",
  findings: "",
  impression: "",
  isNormal: true,
};

function reportToForm(r: Report): FormState {
  return {
    patientName: r.patientName,
    patientAge: r.patientAge,
    patientGender: r.patientGender,
    examDate: r.examDate,
    referringDoctor: r.referringDoctor,
    examType: r.examType,
    indication: r.indication,
    technique: r.technique,
    findings: r.findings,
    impression: r.impression,
    isNormal: r.isNormal,
  };
}

export function ReportForm({
  mode,
  initialReport,
  onBack,
  onSaved,
}: ReportFormProps) {
  const { data: backendTemplates = [] } = useGetTemplates();
  const createMut = useCreateReport();
  const updateMut = useUpdateReport();

  const templates =
    backendTemplates.length > 0 ? backendTemplates : FALLBACK_TEMPLATES;

  const [form, setForm] = useState<FormState>(() =>
    initialReport ? reportToForm(initialReport) : DEFAULT_FORM,
  );

  const set = (key: keyof FormState) => (val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const filteredTemplates = form.examType
    ? templates.filter((t) => t.examType === form.examType)
    : templates;

  const applyTemplate = (t: Template) => {
    setForm((prev) => ({
      ...prev,
      indication: t.indication,
      technique: t.technique,
      findings: t.findings,
      impression: t.impression,
    }));
  };

  const appendTerminology = (term: string) => {
    setForm((prev) => ({
      ...prev,
      findings: prev.findings
        ? `${prev.findings.trimEnd()}. ${term}. `
        : `${term}. `,
    }));
  };

  const isPending = createMut.isPending || updateMut.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName || !form.examType) {
      toast.error("Patient name and exam type are required");
      return;
    }
    try {
      if (mode === "new") {
        await createMut.mutateAsync(form);
        toast.success("Report created successfully");
      } else if (initialReport) {
        await updateMut.mutateAsync({ id: initialReport.id, ...form });
        toast.success("Report updated successfully");
      }
      onSaved();
    } catch {
      toast.error("Failed to save report");
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Button
          data-ocid="report_form.back.button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "new" ? "New Report" : "Edit Report"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "new"
              ? "Create a new ultrasound report"
              : `Editing report for ${initialReport?.patientName}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg border border-border shadow-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full bg-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Patient Information
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="patientName"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Patient Name *
              </Label>
              <Input
                id="patientName"
                data-ocid="report_form.patient_name.input"
                value={form.patientName}
                onChange={(e) => set("patientName")(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="patientAge"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Age
              </Label>
              <Input
                id="patientAge"
                data-ocid="report_form.patient_age.input"
                value={form.patientAge}
                onChange={(e) => set("patientAge")(e.target.value)}
                placeholder="e.g. 45 years"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Gender
              </Label>
              <Select
                value={form.patientGender}
                onValueChange={set("patientGender")}
              >
                <SelectTrigger data-ocid="report_form.patient_gender.select">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="examDate"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Exam Date
              </Label>
              <Input
                id="examDate"
                data-ocid="report_form.exam_date.input"
                type="date"
                value={form.examDate}
                onChange={(e) => set("examDate")(e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label
                htmlFor="referringDoctor"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                Referring Doctor
              </Label>
              <Input
                id="referringDoctor"
                data-ocid="report_form.referring_doctor.input"
                value={form.referringDoctor}
                onChange={(e) => set("referringDoctor")(e.target.value)}
                placeholder="Dr. Name"
              />
            </div>
          </div>
        </motion.div>

        {/* Exam Type */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-lg border border-border shadow-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full bg-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Exam Type *
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAM_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                data-ocid="report_form.exam_type.toggle"
                onClick={() => set("examType")(type)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  form.examType === type
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Templates */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-card rounded-lg border border-border shadow-card p-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-5 rounded-full bg-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Templates
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Click a template to auto-fill report sections
          </p>
          <div className="flex flex-wrap gap-2">
            {(filteredTemplates.length > 0 ? filteredTemplates : templates).map(
              (t) => (
                <button
                  key={Number(t.id)}
                  type="button"
                  data-ocid="report_form.template.button"
                  onClick={() => applyTemplate(t)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-muted/50 hover:bg-accent hover:border-primary/40 transition-all text-sm font-medium text-foreground"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  {t.name}
                </button>
              ),
            )}
          </div>
        </motion.div>

        {/* Report Content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border border-border shadow-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full bg-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Report Content
            </h2>
          </div>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Indication
              </Label>
              <Textarea
                data-ocid="report_form.indication.textarea"
                value={form.indication}
                onChange={(e) => set("indication")(e.target.value)}
                placeholder="Clinical indication for the examination..."
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Technique
              </Label>
              <Textarea
                data-ocid="report_form.technique.textarea"
                value={form.technique}
                onChange={(e) => set("technique")(e.target.value)}
                placeholder="Examination technique used..."
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Findings
              </Label>
              <Textarea
                data-ocid="report_form.findings.textarea"
                value={form.findings}
                onChange={(e) => set("findings")(e.target.value)}
                placeholder="Detailed sonographic findings..."
                rows={6}
                className="resize-none"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {TERMINOLOGY_CHIPS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    data-ocid="report_form.terminology.button"
                    onClick={() => appendTerminology(term)}
                    className="px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    + {term}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Impression / Conclusion
              </Label>
              <Textarea
                data-ocid="report_form.impression.textarea"
                value={form.impression}
                onChange={(e) => set("impression")(e.target.value)}
                placeholder="Summary and impression..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-card rounded-lg border border-border shadow-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Report Status
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              data-ocid="report_form.status_normal.toggle"
              onClick={() => set("isNormal")(true)}
              className={`flex-1 flex items-center justify-center py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                form.isNormal
                  ? "border-success bg-success text-success-foreground shadow-sm"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-success/50"
              }`}
            >
              ✓ Normal
            </button>
            <button
              type="button"
              data-ocid="report_form.status_abnormal.toggle"
              onClick={() => set("isNormal")(false)}
              className={`flex-1 flex items-center justify-center py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                !form.isNormal
                  ? "border-destructive bg-destructive/15 text-destructive shadow-sm"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-destructive/50"
              }`}
            >
              ⚠ Abnormal
            </button>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <Button
            type="button"
            variant="outline"
            data-ocid="report_form.cancel.button"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            data-ocid="report_form.save.submit_button"
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isPending
              ? "Saving..."
              : mode === "new"
                ? "Create Report"
                : "Update Report"}
          </Button>
        </div>
      </form>
    </div>
  );
}
