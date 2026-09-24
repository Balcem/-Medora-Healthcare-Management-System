package com.medora.service;

import com.medora.dto.AppointmentResponse;
import com.medora.dto.AppointmentStatusRequest;
import com.medora.dto.BookAppointmentRequest;
import com.medora.exception.BadRequestException;
import com.medora.exception.ConflictException;
import com.medora.exception.ResourceNotFoundException;
import com.medora.model.Appointment;
import com.medora.model.Doctor;
import com.medora.model.Patient;
import com.medora.repository.AppointmentRepository;
import com.medora.repository.DoctorRepository;
import com.medora.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                               PatientRepository patientRepository,
                               DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @Transactional
    public AppointmentResponse book(Long patientUserId, BookAppointmentRequest req) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        if (appointmentRepository.existsOverlappingAppointment(
                doctor.getId(), req.getAppointmentDate(), req.getStartTime(), req.getEndTime()))
            throw new ConflictException("This time slot is already booked. Please choose a different slot.");

        if (req.getAppointmentDate().isBefore(LocalDate.now()))
            throw new BadRequestException("Appointment date cannot be in the past");
        if (!req.getEndTime().isAfter(req.getStartTime()))
            throw new BadRequestException("End time must be after start time");

        Appointment appointment = Appointment.builder()
                .patient(patient).doctor(doctor)
                .appointmentDate(req.getAppointmentDate())
                .startTime(req.getStartTime()).endTime(req.getEndTime())
                .status(Appointment.Status.PENDING).reason(req.getReason()).build();

        return toResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse updateStatus(Long appointmentId, AppointmentStatusRequest req, Long actorUserId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        Appointment.Status newStatus;
        try { newStatus = Appointment.Status.valueOf(req.getStatus().toUpperCase()); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + req.getStatus()); }
        appointment.setStatus(newStatus);
        if (req.getNotes() != null) appointment.setNotes(req.getNotes());
        return toResponse(appointmentRepository.save(appointment));
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getForPatient(Long patientUserId) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return appointmentRepository
                .findByPatientIdOrderByAppointmentDateDescStartTimeDesc(patient.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getForDoctor(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return appointmentRepository
                .findByDoctorIdOrderByAppointmentDateAscStartTimeAsc(doctor.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAll() {
        return appointmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    private AppointmentResponse toResponse(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId()).patientId(a.getPatient().getId())
                .patientName(a.getPatient().getUser().getFullName())
                .doctorId(a.getDoctor().getId())
                .doctorName(a.getDoctor().getUser().getFullName())
                .specialtyName(a.getDoctor().getSpecialty().getName())
                .appointmentDate(a.getAppointmentDate())
                .startTime(a.getStartTime()).endTime(a.getEndTime())
                .status(a.getStatus().name()).reason(a.getReason())
                .notes(a.getNotes()).createdAt(a.getCreatedAt()).build();
    }
}
