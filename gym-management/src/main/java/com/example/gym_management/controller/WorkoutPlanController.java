package com.example.gym_management.controller;

import com.example.gym_management.model.User;
import com.example.gym_management.model.WorkoutPlan;
import com.example.gym_management.repository.UserRepository;
import com.example.gym_management.repository.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workout-plans")
@CrossOrigin(origins = "http://localhost:4200")
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<String> addWorkoutPlan(@RequestParam Long coachId, @RequestBody WorkoutPlan workoutPlan) {
        try {
            Optional<User> coachOptional = userRepository.findById(coachId);
            if (coachOptional.isPresent() && "COACH".equals(coachOptional.get().getRole())) {
                workoutPlanRepository.save(workoutPlan);
                return ResponseEntity.ok("{\"message\": \"Workout plan added successfully\"}");
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"Coach not found or invalid role\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to add workout plan\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/assignPlanToClient")
    public ResponseEntity<String> assignPlanToClient(@RequestParam Long clientId, @RequestParam Long workoutPlanId) {
        try {
            Optional<User> clientOptional = userRepository.findById(clientId);
            Optional<WorkoutPlan> workoutPlanOptional = workoutPlanRepository.findById(workoutPlanId);
            
            if (clientOptional.isPresent() && workoutPlanOptional.isPresent()) {
                User client = clientOptional.get();
                client.setAssignedWorkoutPlan(workoutPlanOptional.get());
                userRepository.save(client);
                return ResponseEntity.ok("{\"message\": \"Workout plan assigned successfully\"}");
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"Client or workout plan not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to assign workout plan\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{planId}")
    public ResponseEntity<String> updateWorkoutPlan(@PathVariable Long planId, @RequestBody WorkoutPlan updatedPlan) {
        try {
            Optional<WorkoutPlan> existingPlanOptional = workoutPlanRepository.findById(planId);
            if (existingPlanOptional.isPresent()) {
                WorkoutPlan existingPlan = existingPlanOptional.get();
                existingPlan.setPlanName(updatedPlan.getPlanName());
                existingPlan.setDetails(updatedPlan.getDetails());
                workoutPlanRepository.save(existingPlan);
                return ResponseEntity.ok("{\"message\": \"Workout plan updated successfully\"}");
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"Workout plan not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to update workout plan\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{planId}")
    public ResponseEntity<String> deleteWorkoutPlan(@PathVariable Long planId) {
        try {
            Optional<WorkoutPlan> workoutPlanOptional = workoutPlanRepository.findById(planId);
            if (workoutPlanOptional.isPresent()) {
                WorkoutPlan workoutPlan = workoutPlanOptional.get();

                // Remove assignments from clients
                for (User client : workoutPlan.getAssignedUsers()) {
                    client.setAssignedWorkoutPlan(null);
                    userRepository.save(client);
                }

                workoutPlanRepository.delete(workoutPlan);
                return ResponseEntity.ok("{\"message\": \"Workout plan deleted successfully\"}");
            } else {
                return ResponseEntity.status(404).body("{\"message\": \"Workout plan not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to delete workout plan\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping
    public ResponseEntity<List<WorkoutPlan>> getAllWorkoutPlans() {
        try {
            List<WorkoutPlan> workoutPlans = workoutPlanRepository.findAll();
            return ResponseEntity.ok(workoutPlans);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
