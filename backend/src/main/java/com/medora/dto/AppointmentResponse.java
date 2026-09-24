package com.medora.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class AppointmentResponse {
    private Long id, patientId, doctorId;
    private String patientName, doctorName, specialtyName, status, reason, notes;
    private LocalDate appointmentDate;
    private LocalTime startTime, endTime;
    private LocalDateTime createdAt;

    public AppointmentResponse() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final AppointmentResponse o = new AppointmentResponse();
        public Builder id(Long v) { o.id = v; return this; }
        public Builder patientId(Long v) { o.patientId = v; return this; }
        public Builder doctorId(Long v) { o.doctorId = v; return this; }
        public Builder patientName(String v) { o.patientName = v; return this; }
        public Builder doctorName(String v) { o.doctorName = v; return this; }
        public Builder specialtyName(String v) { o.specialtyName = v; return this; }
        public Builder status(String v) { o.status = v; return this; }
        public Builder reason(String v) { o.reason = v; return this; }
        public Builder notes(String v) { o.notes = v; return this; }
        public Builder appointmentDate(LocalDate v) { o.appointmentDate = v; return this; }
        public Builder startTime(LocalTime v) { o.startTime = v; return this; }
        public Builder endTime(LocalTime v) { o.endTime = v; return this; }
        public Builder createdAt(LocalDateTime v) { o.createdAt = v; return this; }
        public AppointmentResponse build() { return o; }
    }

    public Long getId() { return id; }
    public Long getPatientId() { return patientId; }
    public Long getDoctorId() { return doctorId; }
    public String getPatientName() { return patientName; }
    public String getDoctorName() { return doctorName; }
    public String getSpecialtyName() { return specialtyName; }
    public String getStatus() { return status; }
    public String getReason() { return reason; }
    public String getNotes() { return notes; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
