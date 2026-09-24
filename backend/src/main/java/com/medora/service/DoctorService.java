package com.medora.service;

import com.medora.dto.DoctorCreateRequest;
import com.medora.dto.DoctorResponse;
import com.medora.exception.ConflictException;
import com.medora.exception.ResourceNotFoundException;
import com.medora.model.Doctor;
import com.medora.model.Specialty;
import com.medora.model.User;
import com.medora.repository.DoctorRepository;
import com.medora.repository.SpecialtyRepository;
import com.medora.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final SpecialtyRepository specialtyRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(DoctorRepository doctorRepository, UserRepository userRepository,
                         SpecialtyRepository specialtyRepository, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.specialtyRepository = specialtyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> getAll() {
        return doctorRepository.findAllWithDetails().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DoctorResponse getById(Long id) {
        return doctorRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + id));
    }

    @Transactional(readOnly = true)
    public DoctorResponse getByUserId(Long userId) {
        return doctorRepository.findByUserId(userId).map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
    }

    @Transactional
    public DoctorResponse create(DoctorCreateRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new ConflictException("Email already in use");
        if (doctorRepository.existsByLicenseNumber(req.getLicenseNumber()))
            throw new ConflictException("License number already registered");

        Specialty specialty = specialtyRepository.findById(req.getSpecialtyId())
                .orElseThrow(() -> new ResourceNotFoundException("Specialty not found"));

        User user = User.builder()
                .firstName(req.getFirstName()).lastName(req.getLastName())
                .email(req.getEmail()).password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone()).role(User.Role.DOCTOR).isActive(true).build();
        user = userRepository.save(user);

        Doctor doctor = Doctor.builder().user(user).specialty(specialty)
                .licenseNumber(req.getLicenseNumber()).bio(req.getBio())
                .experienceYears(req.getExperienceYears() != null ? req.getExperienceYears() : 0)
                .consultationFee(req.getConsultationFee()).build();

        return toResponse(doctorRepository.save(doctor));
    }

    private DoctorResponse toResponse(Doctor d) {
        return DoctorResponse.builder()
                .id(d.getId()).userId(d.getUser().getId())
                .firstName(d.getUser().getFirstName()).lastName(d.getUser().getLastName())
                .email(d.getUser().getEmail()).phone(d.getUser().getPhone())
                .specialtyName(d.getSpecialty().getName()).specialtyId(d.getSpecialty().getId())
                .licenseNumber(d.getLicenseNumber()).bio(d.getBio())
                .experienceYears(d.getExperienceYears()).consultationFee(d.getConsultationFee()).build();
    }
}
