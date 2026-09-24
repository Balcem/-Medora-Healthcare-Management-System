package com.medora.service;

import com.medora.dto.MedicalRecordRequest;
import com.medora.dto.MedicalRecordResponse;
import com.medora.exception.ResourceNotFoundException;
import com.medora.model.*;
import com.medora.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository recordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public MedicalRecordService(MedicalRecordRepository recordRepository,
                                 PatientRepository patientRepository,
                                 DoctorRepository doctorRepository,
                                 AppointmentRepository appointmentRepository) {
        this.recordRepository = recordRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional
    public MedicalRecordResponse create(Long doctorUserId, MedicalRecordRequest req) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        Appointment appointment = null;
        if (req.getAppointmentId() != null)
            appointment = appointmentRepository.findById(req.getAppointmentId()).orElse(null);

        MedicalRecord record = MedicalRecord.builder()
                .patient(patient).doctor(doctor).appointment(appointment)
                .diagnosis(req.getDiagnosis()).prescription(req.getPrescription())
                .notes(req.getNotes()).visitDate(req.getVisitDate()).build();
        return toResponse(recordRepository.save(record));
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getForPatient(Long patientUserId) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return recordRepository.findByPatientIdOrderByVisitDateDesc(patient.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getForPatientById(Long patientId) {
        return recordRepository.findByPatientIdOrderByVisitDateDesc(patientId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getForDoctor(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return recordRepository.findByDoctorIdOrderByVisitDateDesc(doctor.getId())
                .stream().map(this::toResponse).toList();
    }

    private MedicalRecordResponse toResponse(MedicalRecord r) {
        return MedicalRecordResponse.builder()
                .id(r.getId()).patientId(r.getPatient().getId())
                .patientName(r.getPatient().getUser().getFullName())
                .doctorId(r.getDoctor().getId()).doctorName(r.getDoctor().getUser().getFullName())
                .appointmentId(r.getAppointment() != null ? r.getAppointment().getId() : null)
                .diagnosis(r.getDiagnosis()).prescription(r.getPrescription())
                .notes(r.getNotes()).visitDate(r.getVisitDate()).createdAt(r.getCreatedAt()).build();
    }
}
