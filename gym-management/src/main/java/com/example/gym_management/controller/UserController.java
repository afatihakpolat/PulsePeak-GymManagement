package com.example.gym_management.controller;

import com.example.gym_management.model.MeasurementLog;
import com.example.gym_management.model.User;
import com.example.gym_management.model.WorkoutPlan;
import com.example.gym_management.repository.UserRepository;
import com.example.gym_management.repository.MeasurementLogRepository;
import com.example.gym_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MeasurementLogRepository measurementLogRepository;
    @Autowired
    private UserService userService;
    
    @PostMapping("/assignCoach")
    public ResponseEntity<String> assignCoachToUser(@RequestParam Long userId, @RequestParam(required = false) String coachId) throws NumberFormatException {
        try {
            Long coachIdLong = (coachId != null && !coachId.isEmpty()) ? Long.parseLong(coachId) : null;
            userService.assignCoach(userId, coachIdLong);
            return ResponseEntity.ok("{\"message\": \"Coach assigned successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }

    
    @GetMapping("/measurements")
    public ResponseEntity<List<MeasurementLog>> getMeasurements(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            List<MeasurementLog> logs = measurementLogRepository.findByUser(user.get());
            return ResponseEntity.ok(logs);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }
    
    @GetMapping("/{userId}/measurementLogs")
    public ResponseEntity<List<MeasurementLog>> getMeasurementLogs(@PathVariable Long userId) {
        try {
            List<MeasurementLog> measurementLogs = measurementLogRepository.findByUserIdOrderByDateDesc(userId);
            return ResponseEntity.ok(measurementLogs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/{userId}/assigned-workout-plan")
    public ResponseEntity<WorkoutPlan> getAssignedWorkoutPlan(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            WorkoutPlan assignedWorkoutPlan = user.getAssignedWorkoutPlan();
            return ResponseEntity.ok(assignedWorkoutPlan);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }

    

    @PostMapping("/measurements")
    public ResponseEntity<String> addMeasurement(@RequestParam String email, @RequestBody MeasurementLog measurementLog) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                measurementLog.setUser(user);
                measurementLog.setDate(LocalDate.now());
                measurementLog.setBmi(measurementLog.getWeight() / ((measurementLog.getHeight() / 100) * (measurementLog.getHeight() / 100)));
                measurementLogRepository.save(measurementLog);
                return ResponseEntity.ok("{\"message\": \"Measurement added successfully\"}");
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"User not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to add measurement\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/measurements/{id}")
    public ResponseEntity<String> deleteMeasurement(@RequestParam String email, @PathVariable Long id) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                Optional<MeasurementLog> measurementOptional = measurementLogRepository.findById(id);
                if (measurementOptional.isPresent() && measurementOptional.get().getUser().getEmail().equals(email)) {
                    measurementLogRepository.deleteById(id);
                    return ResponseEntity.ok("{\"message\": \"Measurement deleted successfully\"}");
                } else {
                    return ResponseEntity.status(404).body("{\"message\": \"Measurement not found or does not belong to user\"}");
                }
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"User not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to delete measurement\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    
    @GetMapping("/membership")
    public ResponseEntity<User> getMembership(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/purchaseMembership")
    public ResponseEntity<String> purchaseMembership(@RequestParam String email, @RequestParam String type) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setMembershipStatus(type);
                user.setMembershipExpiryDate(LocalDate.now().plusYears(1));
                userRepository.save(user);
                return ResponseEntity.ok("{\"message\": \"Membership purchased successfully\"}");
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"User not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to purchase membership\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(409).body("{\"message\": \"Email already in use\"}");
        }
        user.setRole("USER"); // Default role is USER, change to ADMIN for admin users
        userRepository.save(user);
        return ResponseEntity.ok("{\"message\": \"Registration successful\"}");
    }


    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody User user) {
        Optional<User> foundUser = userRepository.findByEmail(user.getEmail());
        if (foundUser.isPresent()) {
            if (foundUser.get().getPassword().equals(user.getPassword())) {
                return ResponseEntity.ok(foundUser.get());
            } else {
                return ResponseEntity.status(401).body("Wrong password");
            }
        } else {
            return ResponseEntity.status(404).body("User not exist");
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            User updateUser = existingUser.get();
            updateUser.setName(user.getName());
            updateUser.setSurname(user.getSurname());
            updateUser.setBirthdate(user.getBirthdate());
            updateUser.setGender(user.getGender());
            userRepository.save(updateUser);
            return ResponseEntity.ok("{\"message\": \"Profile updated successfully\"}");
        } else {
            return ResponseEntity.status(404).body("{\"message\": \"User not exist\"}");
        }
    }
    
    

}
