package com.medora.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;

public class BookAppointmentRequest {
    @NotNull private Long doctorId;
    @NotNull private LocalDate appointmentDate;
    @NotNull private LocalTime startTime;
    @NotNull private LocalTime endTime;
    private String reason;

    public BookAppointmentRequest() {}
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long v) { this.doctorId = v; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate v) { this.appointmentDate = v; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime v) { this.startTime = v; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime v) { this.endTime = v; }
    public String getReason() { return reason; }
    public void setReason(String v) { this.reason = v; }
}
