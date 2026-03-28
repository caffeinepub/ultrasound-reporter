import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Appointment {
    id: bigint;
    createdAt: bigint;
    appointmentDate: string;
    appointmentTime: string;
    appointmentType: string;
    address: string;
    notes: string;
    patientName: string;
    phone: string;
}
export interface Report {
    id: bigint;
    patientAge: string;
    referringDoctor: string;
    impression: string;
    patientGender: string;
    createdAt: bigint;
    technique: string;
    updatedAt: bigint;
    isNormal: boolean;
    indication: string;
    patientName: string;
    findings: string;
    examDate: string;
    examType: string;
}
export interface Template {
    id: bigint;
    impression: string;
    name: string;
    technique: string;
    indication: string;
    findings: string;
    examType: string;
}
export interface backendInterface {
    createAppointment(patientName: string, phone: string, address: string, appointmentDate: string, appointmentTime: string, appointmentType: string, notes: string): Promise<bigint>;
    createReport(patientName: string, patientAge: string, patientGender: string, examDate: string, referringDoctor: string, examType: string, indication: string, technique: string, findings: string, impression: string, isNormal: boolean): Promise<bigint>;
    deleteAppointment(id: bigint): Promise<void>;
    deleteReport(id: bigint): Promise<void>;
    getAppointment(id: bigint): Promise<Appointment>;
    getReport(id: bigint): Promise<Report>;
    getTemplate(id: bigint): Promise<Template>;
    getTemplates(): Promise<Array<Template>>;
    listAppointments(): Promise<Array<Appointment>>;
    listReports(): Promise<Array<Report>>;
    updateReport(id: bigint, patientName: string, patientAge: string, patientGender: string, examDate: string, referringDoctor: string, examType: string, indication: string, technique: string, findings: string, impression: string, isNormal: boolean): Promise<void>;
}
