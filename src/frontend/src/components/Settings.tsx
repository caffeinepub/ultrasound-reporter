import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Save, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Settings() {
  const [clinicName, setClinicName] = useState(
    () => localStorage.getItem("clinicName") ?? "",
  );
  const [doctorName, setDoctorName] = useState(
    () => localStorage.getItem("doctorName") ?? "",
  );
  const [clinicContact, setClinicContact] = useState(
    () => localStorage.getItem("clinicContact") ?? "",
  );
  const [showClinicHeader, setShowClinicHeader] = useState(
    () => localStorage.getItem("showClinicHeader") !== "false",
  );

  const handleSave = () => {
    localStorage.setItem("clinicName", clinicName);
    localStorage.setItem("doctorName", doctorName);
    localStorage.setItem("clinicContact", clinicContact);
    localStorage.setItem("showClinicHeader", String(showClinicHeader));
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your clinic information and report preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Clinic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Clinic Information
            </CardTitle>
            <CardDescription>
              This information will appear in the print header of your reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clinic-name">Clinic Name</Label>
              <Input
                id="clinic-name"
                data-ocid="settings.clinic_name.input"
                placeholder="e.g. City Ultrasound Center"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-name" className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Doctor / Radiologist Name
              </Label>
              <Input
                id="doctor-name"
                data-ocid="settings.doctor_name.input"
                placeholder="e.g. Dr. Sarah Johnson"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-contact">Contact & Address</Label>
              <Textarea
                id="clinic-contact"
                data-ocid="settings.clinic_contact.textarea"
                placeholder="e.g. 123 Medical Drive, Suite 4\nPhone: (555) 123-4567\nEmail: info@clinic.com"
                value={clinicContact}
                onChange={(e) => setClinicContact(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Print Header */}
        <Card>
          <CardHeader>
            <CardTitle>Print Header</CardTitle>
            <CardDescription>
              Control what appears at the top of printed reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Show clinic info in print header
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Displays clinic name, doctor name, and contact details when
                  printing.
                </p>
              </div>
              <Switch
                data-ocid="settings.show_clinic_header.switch"
                checked={showClinicHeader}
                onCheckedChange={setShowClinicHeader}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            data-ocid="settings.save_button"
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
