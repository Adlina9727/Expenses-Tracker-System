package com.trackexpensessystem.security;


import com.trackexpensessystem.model.User;
import com.trackexpensessystem.model.Role;
import com.trackexpensessystem.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.username}")
    private String adminUsername;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initAdmin() {
        try {
          
            boolean adminExists = userRepository.findByEmail(adminEmail).isPresent() || 
                                 userRepository.findByUsername(adminUsername).isPresent();
            
            if (!adminExists) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ROLE_ADMIN);
                
                
                userRepository.save(admin);
                System.out.println("Admin account created: " + adminEmail);
            } else {
                System.out.println(" Admin account already exists");
            }
        } catch (Exception e) {
            System.err.println("Error creating admin account: " + e.getMessage());
        }
    }
}