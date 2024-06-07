package com.example.gym_management.service;

import com.example.gym_management.model.MeasurementLog;
import com.example.gym_management.model.User;
import com.example.gym_management.repository.UserRepository;
import com.example.gym_management.repository.MeasurementLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MeasurementLogRepository measurementLogRepository;
    
    //private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getClientsByCoachId(Long coachId) {
        return userRepository.findByCoachId(coachId);
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public List<User> getAllCoaches() {
        return userRepository.findByRole("COACH");
    }

    public void deleteUserWithMeasurements(Long userId) {
        measurementLogRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }
    
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
    
    public void assignCoach(Long userId, Long coachId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (coachId == null) {
                user.setCoachId(null);  // Set to null to denote 'no coach'
            } else {
                Optional<User> coachOptional = userRepository.findById(coachId);
                if (coachOptional.isPresent()) {
                    user.setCoachId(coachId);
                } else {
                    throw new RuntimeException("Coach not found");
                }
            }
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }
    
    public User getClientsWithLatestBmi(Long userId) {
        Optional<User> userOptional = userRepository.findByIdWithMeasurementLogs(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            List<MeasurementLog> logs = measurementLogRepository.findByUserIdOrderByDateDesc(userId);
            if (!logs.isEmpty()) {
                MeasurementLog latestLog = logs.get(0);
                double heightInMeters = latestLog.getHeight() / 100.0;
                double bmi = latestLog.getWeight() / (heightInMeters * heightInMeters);
                user.setBmi(bmi);
            }
            return user;
        }
        return null;
    }
    
    



}
