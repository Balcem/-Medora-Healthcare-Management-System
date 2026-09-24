package com.medora.controller;

import com.medora.dto.AnalyticsOverview;
import com.medora.dto.SpecialtyResponse;
import com.medora.dto.UserResponse;
import com.medora.repository.SpecialtyRepository;
import com.medora.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final AdminService adminService;
    private final SpecialtyRepository specialtyRepository;

    public AdminController(AdminService adminService, SpecialtyRepository specialtyRepository) {
        this.adminService = adminService;
        this.specialtyRepository = specialtyRepository;
    }

    @GetMapping("/admin/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/admin/users/{id}/toggle")
    public ResponseEntity<UserResponse> toggleUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id));
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/analytics")
    public ResponseEntity<AnalyticsOverview> analytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @GetMapping("/specialties")
    public ResponseEntity<List<SpecialtyResponse>> specialties() {
        List<SpecialtyResponse> list = specialtyRepository.findAll().stream()
                .map(s -> new SpecialtyResponse(s.getId(), s.getName(), s.getDescription()))
                .toList();
        return ResponseEntity.ok(list);
    }
}
