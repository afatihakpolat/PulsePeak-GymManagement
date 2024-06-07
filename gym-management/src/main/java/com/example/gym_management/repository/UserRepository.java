package com.example.gym_management.repository;

import com.example.gym_management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    List<User> findByCoachId(Long coachId);
    List<User> findByRole(String role);
    List<User> findAllByRole(String role);
    List<User> findByCoachIdAndRole(Long coachId, String role);
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.measurementLogs WHERE u.id = :userId")
    Optional<User> findByIdWithMeasurementLogs(@Param("userId") Long userId);
}
