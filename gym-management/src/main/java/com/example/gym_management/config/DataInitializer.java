package com.example.gym_management.config;

import com.example.gym_management.model.User;
import com.example.gym_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Bean
    public CommandLineRunner init() {
        return args -> {
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User admin = new User();
                admin.setName("Admin");
                admin.setSurname("User");
                admin.setEmail("admin@example.com");
                admin.setPassword("123");
                admin.setUsername("admin");
                admin.setRole("ADMIN");
                userRepository.save(admin);
            }
        };
    }
}
