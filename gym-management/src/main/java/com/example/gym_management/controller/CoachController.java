package com.example.gym_management.controller;

import com.example.gym_management.model.User;
import com.example.gym_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    @Autowired
    private UserService userService;

    @GetMapping("/{coachId}/clients")
    public ResponseEntity<List<User>> getClients(@PathVariable Long coachId) {
        List<User> clients = userService.getClientsByCoachId(coachId);
        return ResponseEntity.ok(clients);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerCoach(@RequestBody User coach) {
        try {
            Optional<User> existingCoach = userService.getUserByEmail(coach.getEmail());
            if (existingCoach.isPresent()) {
                return ResponseEntity.status(409).body("{\"message\": \"Email already in use\"}");
            }
            coach.setRole("COACH");
            userService.saveUser(coach);
            return ResponseEntity.ok("{\"message\": \"Registration successful\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to register coach\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
