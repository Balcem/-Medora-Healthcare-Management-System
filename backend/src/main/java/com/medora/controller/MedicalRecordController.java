package com.medora.controller;

import com.medora.dto.MedicalRecordRequest;
import com.medora.dto.MedicalRecordResponse;
import com.medora.model.User;
import com.medora.service.MedicalRecordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @PostMapping("/doctor/records")
    public ResponseEntity<MedicalRecordResponse> create(
            @AuthenticationPrincipal User user, @Valid @RequestBody MedicalRecordRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(medicalRecordService.create(user.getId(), req));
    }

    @GetMapping("/doctor/records")
    public ResponseEntity<List<MedicalRecordResponse>> doctorRecords(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(medicalRecordService.getForDoctor(user.getId()));
    }

    @GetMapping("/doctor/patients/{patientId}/records")
    public ResponseEntity<List<MedicalRecordResponse>> patientRecords(@PathVariable Long patientId) {
        return ResponseEntity.ok(medicalRecordService.getForPatientById(patientId));
    }

    @GetMapping("/patient/records")
    public ResponseEntity<List<MedicalRecordResponse>> myRecords(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(medicalRecordService.getForPatient(user.getId()));
    }
}
