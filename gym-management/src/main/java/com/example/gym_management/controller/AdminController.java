package com.example.gym_management.controller;

import com.example.gym_management.model.User;
import com.example.gym_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @PostMapping("/registerAdmin")
    public ResponseEntity<String> registerAdmin(@RequestBody User admin) {
        try {
            Optional<User> existingUser = userService.getUserByEmail(admin.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.status(409).body("{\"message\": \"Email already in use\"}");
            }
            admin.setRole("ADMIN");
            userService.saveUser(admin);
            return ResponseEntity.ok("{\"message\": \"Registration successful\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to register admin\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUserWithMeasurements(id);
        return ResponseEntity.ok("{\"message\": \"User deleted successfully\"}");
    }

    @GetMapping("/coaches")
    public ResponseEntity<List<User>> getAllCoaches() {
        return ResponseEntity.ok(userService.getAllCoaches());
    }

    @PostMapping("/addCoach")
    public ResponseEntity<String> addCoach(@RequestBody User coach) {
        try {
            Optional<User> existingUser = userService.getUserByEmail(coach.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.status(409).body("{\"message\": \"Email already in use\"}");
            }
            coach.setRole("COACH");
            userService.saveUser(coach);
            return ResponseEntity.ok("{\"message\": \"Coach added successfully\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to add coach\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/updateCoach")
    public ResponseEntity<String> updateCoach(@RequestBody User coach) {
        try {
            userService.saveUser(coach);
            return ResponseEntity.ok("{\"message\": \"Coach updated successfully\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to update coach\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/deleteCoach/{id}")
    public ResponseEntity<String> deleteCoach(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("{\"message\": \"Coach deleted successfully\"}");
    }
    
    @PostMapping("/assignCoach")
    public ResponseEntity<String> assignCoachToUser(@RequestParam Long userId, @RequestParam(required = false) String coachId) {
        try {
            Long coachIdLong = coachId != null && !coachId.isEmpty() ? Long.parseLong(coachId) : null;
            userService.assignCoach(userId, coachIdLong);
            return ResponseEntity.ok("{\"message\": \"Coach assigned successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }



    
    
    
}
