import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

actor {
  type Report = {
    id : Nat;
    patientName : Text;
    patientAge : Text;
    patientGender : Text;
    examDate : Text;
    referringDoctor : Text;
    examType : Text;
    indication : Text;
    technique : Text;
    findings : Text;
    impression : Text;
    isNormal : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  module Report {
    public func compareByCreatedAt(report1 : Report, report2 : Report) : Order.Order {
      Int.compare(report2.createdAt, report1.createdAt);
    };
  };

  type Template = {
    id : Nat;
    name : Text;
    examType : Text;
    indication : Text;
    technique : Text;
    findings : Text;
    impression : Text;
  };

  let templates : [Template] = [
    {
      id = 1;
      name = "Normal Abdomen";
      examType = "Abdomen";
      indication = "Routine";
      technique = "Transabdominal";
      findings = "Normal findings for liver, gallbladder, pancreas, spleen, kidneys.";
      impression = "Normal abdominal ultrasound.";
    },
    {
      id = 2;
      name = "OB First Trimester";
      examType = "Obstetric";
      indication = "First trimester assessment";
      technique = "Transabdominal, Transvaginal";
      findings = "Gestational sac, yolk sac, embryo visualized. Normal cardiac activity.";
      impression = "First trimester ultrasound. Normal findings.";
    },
    {
      id = 3;
      name = "Thyroid";
      examType = "Thyroid";
      indication = "Thyroid nodule evaluation";
      technique = "Transabdominal";
      findings = "Normal thyroid with homogenous echotexture.";
      impression = "Normal thyroid ultrasound.";
    },
    {
      id = 4;
      name = "Pelvis";
      examType = "Pelvis";
      indication = "Pelvic pain";
      technique = "Transvaginal";
      findings = "Normal uterus and adnexa.";
      impression = "Normal pelvic ultrasound.";
    },
    {
      id = 5;
      name = "Breast";
      examType = "Breast";
      indication = "Breast mass evaluation";
      technique = "Transabdominal";
      findings = "Homogenous breast tissue, no masses.";
      impression = "Normal breast ultrasound.";
    },
  ];

  stable var nextReportId : Nat = 1;
  stable var stableReportEntries : [(Nat, Report)] = [];

  let reports = Map.empty<Nat, Report>();

  // Restore from stable storage on upgrade
  do {
    for ((k, v) in stableReportEntries.vals()) {
      reports.add(k, v);
      if (k >= nextReportId) { nextReportId := k + 1 };
    };
  };

  system func preupgrade() {
    stableReportEntries := reports.entries().toArray();
  };

  system func postupgrade() {
    stableReportEntries := [];
  };

  public shared ({ caller }) func createReport(
    patientName : Text,
    patientAge : Text,
    patientGender : Text,
    examDate : Text,
    referringDoctor : Text,
    examType : Text,
    indication : Text,
    technique : Text,
    findings : Text,
    impression : Text,
    isNormal : Bool,
  ) : async Nat {
    let now = Time.now();
    let id = nextReportId;
    let report : Report = {
      id;
      patientName;
      patientAge;
      patientGender;
      examDate;
      referringDoctor;
      examType;
      indication;
      technique;
      findings;
      impression;
      isNormal;
      createdAt = now;
      updatedAt = now;
    };
    reports.add(id, report);
    nextReportId += 1;
    id;
  };

  public query ({ caller }) func getReport(id : Nat) : async Report {
    switch (reports.get(id)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) { report };
    };
  };

  public query ({ caller }) func listReports() : async [Report] {
    reports.values().toArray().sort(Report.compareByCreatedAt);
  };

  public shared ({ caller }) func updateReport(
    id : Nat,
    patientName : Text,
    patientAge : Text,
    patientGender : Text,
    examDate : Text,
    referringDoctor : Text,
    examType : Text,
    indication : Text,
    technique : Text,
    findings : Text,
    impression : Text,
    isNormal : Bool,
  ) : async () {
    switch (reports.get(id)) {
      case (null) { Runtime.trap("Report not found") };
      case (?existing) {
        let updated : Report = {
          existing with
          patientName;
          patientAge;
          patientGender;
          examDate;
          referringDoctor;
          examType;
          indication;
          technique;
          findings;
          impression;
          isNormal;
          updatedAt = Time.now();
        };
        reports.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteReport(id : Nat) : async () {
    if (not reports.containsKey(id)) { Runtime.trap("Report not found") };
    reports.remove(id);
  };

  public query ({ caller }) func getTemplates() : async [Template] {
    templates;
  };

  public query ({ caller }) func getTemplate(id : Nat) : async Template {
    for (template in templates.values()) {
      if (template.id == id) { return template };
    };
    Runtime.trap("Template not found");
  };
};
