import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CalendarDays, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateAppointment,
  useDeleteAppointment,
  useListAppointments,
} from "../hooks/useQueries";
import type { Appointment } from "../hooks/useQueries";

const APPOINTMENT_TYPES = ["Walk-in", "Referred", "Follow-up", "Emergency"];

const TYPE_BADGE: Record<string, string> = {
  "Walk-in": "bg-blue-100 text-blue-800 border-blue-200",
  Referred: "bg-green-100 text-green-800 border-green-200",
  "Follow-up": "bg-orange-100 text-orange-800 border-orange-200",
  Emergency: "bg-red-100 text-red-800 border-red-200",
};

const defaultForm = {
  patientName: "",
  phone: "",
  address: "",
  appointmentDate: "",
  appointmentTime: "",
  appointmentType: "",
  notes: "",
};

export function Appointments() {
  const [form, setForm] = useState(defaultForm);
  const { data: appointments = [], isLoading } = useListAppointments();
  const createMutation = useCreateAppointment();
  const deleteMutation = useDeleteAppointment();

  const sorted = [...appointments].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  const set = (field: keyof typeof form) => (val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName.trim()) {
      toast.error("Patient name is required.");
      return;
    }
    try {
      await createMutation.mutateAsync(form);
      toast.success("Appointment booked successfully.");
      setForm(defaultForm);
    } catch {
      toast.error("Failed to book appointment.");
    }
  };

  const handleDelete = async (appt: Appointment) => {
    if (!confirm(`Delete appointment for ${appt.patientName}?`)) return;
    try {
      await deleteMutation.mutateAsync(appt.id);
      toast.success("Appointment deleted.");
    } catch {
      toast.error("Failed to delete appointment.");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* New Appointment Form */}
      <Card data-ocid="appointments.panel">
        <CardHeader>
          <CardTitle
            className="flex items-center gap-2 text-base"
            style={{ color: "oklch(0.35 0.14 216)" }}
          >
            <CalendarDays
              className="w-5 h-5"
              style={{ color: "oklch(0.48 0.13 216)" }}
            />
            Book New Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Name + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="appt-name">
                  Patient Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="appt-name"
                  data-ocid="appointments.input"
                  placeholder="Full name"
                  value={form.patientName}
                  onChange={(e) => set("patientName")(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="appt-phone">Phone Number</Label>
                <Input
                  id="appt-phone"
                  data-ocid="appointments.phone.input"
                  placeholder="e.g. +92 300 0000000"
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                />
              </div>
            </div>

            {/* Row 2: Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="appt-date">Appointment Date</Label>
                <Input
                  id="appt-date"
                  data-ocid="appointments.date.input"
                  type="date"
                  value={form.appointmentDate}
                  onChange={(e) => set("appointmentDate")(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="appt-time">Appointment Time</Label>
                <Input
                  id="appt-time"
                  data-ocid="appointments.time.input"
                  type="time"
                  value={form.appointmentTime}
                  onChange={(e) => set("appointmentTime")(e.target.value)}
                />
              </div>
            </div>

            {/* Row 3: Type + Address */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="appt-type">Appointment Type</Label>
                <Select
                  value={form.appointmentType}
                  onValueChange={set("appointmentType")}
                >
                  <SelectTrigger
                    id="appt-type"
                    data-ocid="appointments.type.select"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPOINTMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="appt-address">Address</Label>
                <Textarea
                  id="appt-address"
                  data-ocid="appointments.address.textarea"
                  placeholder="Patient address"
                  rows={2}
                  value={form.address}
                  onChange={(e) => set("address")(e.target.value)}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="appt-notes">Notes (optional)</Label>
              <Textarea
                id="appt-notes"
                data-ocid="appointments.notes.textarea"
                placeholder="Any additional notes..."
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              data-ocid="appointments.submit_button"
              disabled={createMutation.isPending}
              style={{ background: "oklch(0.48 0.13 216)" }}
              className="text-white hover:opacity-90"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...
                </>
              ) : (
                <>
                  <CalendarDays className="mr-2 h-4 w-4" /> Book Appointment
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle
            className="text-base"
            style={{ color: "oklch(0.35 0.14 216)" }}
          >
            Appointments ({sorted.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div
              data-ocid="appointments.loading_state"
              className="flex items-center justify-center py-12"
            >
              <Loader2
                className="h-6 w-6 animate-spin"
                style={{ color: "oklch(0.48 0.13 216)" }}
              />
              <span className="ml-2 text-muted-foreground text-sm">
                Loading appointments...
              </span>
            </div>
          ) : sorted.length === 0 ? (
            <div
              data-ocid="appointments.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No appointments yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sorted.map((appt, idx) => (
                <div
                  key={String(appt.id)}
                  data-ocid={`appointments.item.${idx + 1}`}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0 grid grid-cols-[1fr_1fr_auto_1fr_1fr] gap-x-4 gap-y-1 items-start">
                    <div>
                      <div className="text-sm font-semibold text-foreground truncate">
                        {appt.patientName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {appt.phone || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-foreground">
                        {appt.appointmentDate || "—"}
                        {appt.appointmentTime
                          ? ` · ${appt.appointmentTime}`
                          : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Date &amp; Time
                      </div>
                    </div>
                    <div>
                      {appt.appointmentType ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            TYPE_BADGE[appt.appointmentType] ??
                            "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {appt.appointmentType}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-foreground truncate">
                        {appt.address || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Address
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-foreground">
                        {appt.notes || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">Notes</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-ocid={`appointments.delete_button.${idx + 1}`}
                    onClick={() => handleDelete(appt)}
                    disabled={deleteMutation.isPending}
                    className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete appointment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
