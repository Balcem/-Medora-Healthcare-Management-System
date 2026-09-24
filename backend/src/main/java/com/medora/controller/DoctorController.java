package com.medora.controller;

import com.medora.dto.DoctorCreateRequest;
import com.medora.dto.DoctorResponse;
import com.medora.model.User;
import com.medora.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping("/api/doctors/public")
    public ResponseEntity<List<DoctorResponse>> listPublic() {
        return ResponseEntity.ok(doctorService.getAll());
    }

    @GetMapping("/api/doctors/public/{id}")
    public ResponseEntity<DoctorResponse> getPublic(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getById(id));
    }

    @GetMapping("/api/doctor/profile")
    public ResponseEntity<DoctorResponse> myProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(doctorService.getByUserId(user.getId()));
    }

    @PostMapping("/api/admin/doctors")
    public ResponseEntity<DoctorResponse> create(@Valid @RequestBody DoctorCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.create(req));
    }

    @GetMapping("/api/admin/doctors")
    public ResponseEntity<List<DoctorResponse>> listAll() {
        return ResponseEntity.ok(doctorService.getAll());
    }
}
