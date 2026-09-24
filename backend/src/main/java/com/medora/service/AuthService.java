package com.medora.service;

import com.medora.dto.*;
import com.medora.exception.ConflictException;
import com.medora.model.*;
import com.medora.repository.*;
import com.medora.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PatientRepository patientRepository,
                       AuthenticationManager authManager, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.authManager = authManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new ConflictException("Email already in use: " + req.getEmail());

        User user = User.builder()
                .firstName(req.getFirstName()).lastName(req.getLastName())
                .email(req.getEmail()).password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone()).role(User.Role.PATIENT).isActive(true).build();
        user = userRepository.save(user);

        Patient patient = Patient.builder().user(user).dateOfBirth(req.getDateOfBirth()).build();
        if (req.getGender() != null) {
            try { patient.setGender(Patient.Gender.valueOf(req.getGender().toUpperCase())); }
            catch (IllegalArgumentException ignored) {}
        }
        if (req.getBloodType() != null) {
            try { patient.setBloodType(Patient.BloodType.valueOf(
                    req.getBloodType().replace("+","_POS").replace("-","_NEG"))); }
            catch (IllegalArgumentException ignored) {}
        }
        patient.setAddress(req.getAddress());
        patient = patientRepository.save(patient);

        String token = jwtUtil.generateToken(user, user.getRole().name());
        return AuthResponse.builder().token(token).email(user.getEmail())
                .fullName(user.getFullName()).role(user.getRole().name())
                .profileId(patient.getId()).build();
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(user, user.getRole().name());

        Long profileId = switch (user.getRole()) {
            case DOCTOR -> user.getDoctor() != null ? user.getDoctor().getId() : null;
            case PATIENT -> user.getPatient() != null ? user.getPatient().getId() : null;
            default -> null;
        };

        return AuthResponse.builder().token(token).email(user.getEmail())
                .fullName(user.getFullName()).role(user.getRole().name())
                .profileId(profileId).build();
    }
}
