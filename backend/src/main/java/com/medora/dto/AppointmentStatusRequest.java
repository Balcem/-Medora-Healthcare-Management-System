package com.medora.dto;

import jakarta.validation.constraints.*;

public class AppointmentStatusRequest {
    @NotBlank private String status;
    private String notes;

    public AppointmentStatusRequest() {}
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { this.notes = v; }
}
