package com.medora.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class MedicalRecordRequest {
    @NotNull private Long patientId;
    private Long appointmentId;
    @NotBlank private String diagnosis;
    private String prescription;
    private String notes;
    @NotNull private LocalDate visitDate;

    public MedicalRecordRequest() {}
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long v) { this.patientId = v; }
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long v) { this.appointmentId = v; }
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String v) { this.diagnosis = v; }
    public String getPrescription() { return prescription; }
    public void setPrescription(String v) { this.prescription = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { this.notes = v; }
    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate v) { this.visitDate = v; }
}
