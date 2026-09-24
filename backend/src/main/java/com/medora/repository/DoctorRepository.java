package com.medora.repository;

import com.medora.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);
    boolean existsByLicenseNumber(String licenseNumber);
    List<Doctor> findBySpecialtyId(Long specialtyId);

    @Query("SELECT d FROM Doctor d JOIN FETCH d.user JOIN FETCH d.specialty")
    List<Doctor> findAllWithDetails();
}
