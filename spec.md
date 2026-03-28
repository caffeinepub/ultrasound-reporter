# Ultrasound Reporter

## Current State
The app has reports management (create, edit, view, delete) with templates, QR sharing, settings, sticky header, and a disclaimer footer. The backend stores reports with stable variables. No appointments feature exists.

## Requested Changes (Diff)

### Add
- Appointments management: create, list, delete appointments
- Appointment fields: patient name, phone number, address, appointment date, appointment time, appointment type (Walk-in, Referred, Follow-up, Emergency), notes
- Appointments sidebar link and page view

### Modify
- Backend: add Appointment type and CRUD functions
- Sidebar: add Appointments nav item
- App.tsx: add appointments view routing

### Remove
- Nothing removed

## Implementation Plan
1. Add Appointment type and stable storage to Motoko backend
2. Add createAppointment, listAppointments, deleteAppointment functions
3. Add Appointments view to frontend sidebar and App.tsx routing
4. Build Appointments component with form (add new) and list (view/delete existing)
