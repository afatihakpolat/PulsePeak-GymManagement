package com.example.gym_management.repository;

import com.example.gym_management.model.MeasurementLog;
import com.example.gym_management.model.User;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeasurementLogRepository extends JpaRepository<MeasurementLog, Long> {
    List<MeasurementLog> findByUser(User user);
    @Transactional
    void deleteByUserId(Long userId);
    List<MeasurementLog> findByUserIdOrderByDateDesc(Long userId);
}
