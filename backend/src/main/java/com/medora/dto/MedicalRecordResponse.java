package com.medora.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MedicalRecordResponse {
    private Long id, patientId, doctorId, appointmentId;
    private String patientName, doctorName, diagnosis, prescription, notes;
    private LocalDate visitDate;
    private LocalDateTime createdAt;

    public MedicalRecordResponse() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final MedicalRecordResponse o = new MedicalRecordResponse();
        public Builder id(Long v) { o.id = v; return this; }
        public Builder patientId(Long v) { o.patientId = v; return this; }
        public Builder doctorId(Long v) { o.doctorId = v; return this; }
        public Builder appointmentId(Long v) { o.appointmentId = v; return this; }
        public Builder patientName(String v) { o.patientName = v; return this; }
        public Builder doctorName(String v) { o.doctorName = v; return this; }
        public Builder diagnosis(String v) { o.diagnosis = v; return this; }
        public Builder prescription(String v) { o.prescription = v; return this; }
        public Builder notes(String v) { o.notes = v; return this; }
        public Builder visitDate(LocalDate v) { o.visitDate = v; return this; }
        public Builder createdAt(LocalDateTime v) { o.createdAt = v; return this; }
        public MedicalRecordResponse build() { return o; }
    }

    public Long getId() { return id; }
    public Long getPatientId() { return patientId; }
    public Long getDoctorId() { return doctorId; }
    public Long getAppointmentId() { return appointmentId; }
    public String getPatientName() { return patientName; }
    public String getDoctorName() { return doctorName; }
    public String getDiagnosis() { return diagnosis; }
    public String getPrescription() { return prescription; }
    public String getNotes() { return notes; }
    public LocalDate getVisitDate() { return visitDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
