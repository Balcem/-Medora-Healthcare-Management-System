package com.medora.repository;

import com.medora.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientIdOrderByAppointmentDateDescStartTimeDesc(Long patientId);

    List<Appointment> findByDoctorIdOrderByAppointmentDateAscStartTimeAsc(Long doctorId);

    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);

    // Double-booking check: slot already taken?
    @Query("""
           SELECT COUNT(a) > 0 FROM Appointment a
           WHERE a.doctor.id = :doctorId
             AND a.appointmentDate = :date
             AND a.status <> 'CANCELLED'
             AND (
                   (a.startTime < :endTime AND a.endTime > :startTime)
                 )
           """)
    boolean existsOverlappingAppointment(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate = :date")
    long countByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Appointment a")
    long countTotal();

    @Query("""
           SELECT a.doctor.id, COUNT(a) as cnt FROM Appointment a
           GROUP BY a.doctor.id ORDER BY cnt DESC
           """)
    List<Object[]> findMostActiveDoctors();
}
