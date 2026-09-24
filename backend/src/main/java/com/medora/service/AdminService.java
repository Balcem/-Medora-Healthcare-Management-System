package com.medora.service;

import com.medora.dto.AnalyticsOverview;
import com.medora.dto.UserResponse;
import com.medora.exception.ResourceNotFoundException;
import com.medora.model.User;
import com.medora.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminService(UserRepository userRepository, DoctorRepository doctorRepository,
                        PatientRepository patientRepository, AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toUserResponse).toList();
    }

    @Transactional
    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(!user.isActive());
        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId))
            throw new ResourceNotFoundException("User not found");
        userRepository.deleteById(userId);
    }

    @Transactional(readOnly = true)
    public AnalyticsOverview getAnalytics() {
        return AnalyticsOverview.builder()
                .totalUsers(userRepository.count()).totalDoctors(doctorRepository.count())
                .totalPatients(patientRepository.count()).totalAppointments(appointmentRepository.count())
                .todayAppointments(appointmentRepository.countByDate(LocalDate.now())).build();
    }

    private UserResponse toUserResponse(User u) {
        return UserResponse.builder()
                .id(u.getId()).firstName(u.getFirstName()).lastName(u.getLastName())
                .email(u.getEmail()).phone(u.getPhone()).role(u.getRole().name())
                .active(u.isActive()).createdAt(u.getCreatedAt()).build();
    }
}
