package com.medora.controller;

import com.medora.dto.AppointmentResponse;
import com.medora.dto.AppointmentStatusRequest;
import com.medora.dto.BookAppointmentRequest;
import com.medora.model.User;
import com.medora.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/patient/appointments")
    public ResponseEntity<AppointmentResponse> book(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BookAppointmentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.book(user.getId(), req));
    }

    @GetMapping("/patient/appointments")
    public ResponseEntity<List<AppointmentResponse>> myAppointments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.getForPatient(user.getId()));
    }

    @PatchMapping("/patient/appointments/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancel(@PathVariable Long id, @AuthenticationPrincipal User user) {
        AppointmentStatusRequest req = new AppointmentStatusRequest();
        req.setStatus("CANCELLED");
        return ResponseEntity.ok(appointmentService.updateStatus(id, req, user.getId()));
    }

    @GetMapping("/doctor/appointments")
    public ResponseEntity<List<AppointmentResponse>> doctorAppointments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.getForDoctor(user.getId()));
    }

    @PatchMapping("/doctor/appointments/{id}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentStatusRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, req, user.getId()));
    }

    @GetMapping("/admin/appointments")
    public ResponseEntity<List<AppointmentResponse>> all() {
        return ResponseEntity.ok(appointmentService.getAll());
    }
}
