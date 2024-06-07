package com.example.gym_management.controller;

import com.example.gym_management.model.ContactMessage;
import com.example.gym_management.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:4200")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping("/send")
    public ResponseEntity<String> sendContactMessage(@RequestBody ContactMessage contactMessage) {
        try {
            contactMessageRepository.save(contactMessage);
            return ResponseEntity.ok("{\"message\": \"Message sent successfully\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to send message\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        List<ContactMessage> messages = contactMessageRepository.findAll();
        return ResponseEntity.ok(messages);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContactMessage(@PathVariable Long id) {
        try {
            contactMessageRepository.deleteById(id);
            return ResponseEntity.ok("{\"message\": \"Contact message deleted successfully\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"Failed to delete contact message\", \"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
