import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Appointment, Report, Template } from "../backend";
import { useActor } from "./useActor";

export function useListReports() {
  const { actor, isFetching } = useActor();
  return useQuery<Report[]>({
    queryKey: ["reports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTemplates() {
  const { actor, isFetching } = useActor();
  return useQuery<Template[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
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
    }) =>
      actor!.createReview(
        args.patientName,
        args.patientAge,
        args.patientGender,
        args.examDate,
        args.referringDoctor,
        args.examType,
        args.indication,
        args.technique,
        args.findings,
        args.impression,
        args.isNormal,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });
}

export function useUpdateReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      id: bigint;
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
    }) =>
      actor!.updateReport(
        args.id,
        args.patientName,
        args.patientAge,
        args.patientGender,
        args.examDate,
        args.referringDoctor,
        args.examType,
        args.indication,
        args.technique,
        args.findings,
        args.impression,
        args.isNormal,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });
}

export function useDeleteReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteReport(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });
}

export function useListAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAppointment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      patientName: string;
      phone: string;
      address: string;
      appointmentDate: string;
      appointmentTime: string;
      appointmentType: string;
      notes: string;
    }) =>
      actor!.createAppointment(
        args.patientName,
        args.phone,
        args.address,
        args.appointmentDate,
        args.appointmentTime,
        args.appointmentType,
        args.notes,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useDeleteAppointment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteAppointment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export type { Appointment, Report, Template };
