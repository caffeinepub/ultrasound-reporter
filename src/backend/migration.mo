import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type Appointment = {
    id : Nat;
    patientName : Text;
    phone : Text;
    address : Text;
    appointmentDate : Text;
    appointmentTime : Text;
    appointmentType : Text;
    notes : Text;
    createdAt : Int;
  };

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

  type OldActor = {
    reports : Map.Map<Nat, Report>;
    nextReportId : Nat;
    stableReportEntries : [(Nat, Report)];
  };

  type NewActor = {
    reports : Map.Map<Nat, Report>;
    nextReportId : Nat;
    stableReportEntries : [(Nat, Report)];
    appointments : Map.Map<Nat, Appointment>;
    nextAppointmentId : Nat;
    stableAppointmentEntries : [(Nat, Appointment)];
  };

  public func run(old : OldActor) : NewActor {
    { old with
      appointments = Map.empty<Nat, Appointment>();
      nextAppointmentId = 1;
      stableAppointmentEntries = [];
    };
  };
};
