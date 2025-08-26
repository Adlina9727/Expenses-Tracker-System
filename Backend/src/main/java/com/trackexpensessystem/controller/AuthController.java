package com.trackexpensessystem.controller;
import com.trackexpensessystem.dto.RegistrationRequest;
import com.trackexpensessystem.dto.LoginRequest;
import com.trackexpensessystem.dto.UserResponse;
import com.trackexpensessystem.model.Role;
import com.trackexpensessystem.dto.JwtResponse;
import com.trackexpensessystem.model.User;
import com.trackexpensessystem.repository.UserRepository;
//import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UserDetails;
import com.trackexpensessystem.util.JwtTokenUtil;
//import org.springframework.stereotype.Component;
import java.util.ArrayList;
@CrossOrigin(
		origins = "http://localhost:3000" , 
		methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS},
		allowedHeaders = "*"
		)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired 
    private JwtTokenUtil jwtTokenUtil; 

    @PostMapping("/register")
	@CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest registrationRequest) {
        if (userRepository.existsByUsername(registrationRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }
        
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }
        
        if (!registrationRequest.getPassword().equals(registrationRequest.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }
        
        User user = new User();
        user.setUsername(registrationRequest.getUsername());
        user.setEmail(registrationRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        
       user.setRole(registrationRequest.getRole() != null ? 
                registrationRequest.getRole() : 
                Role.ROLE_USER);
        
//       user.setRole(registrationRequest.getRole());

    //userRepository.save(user);
    

        userRepository.save(user);
        
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
        
        String role = user.getRole().name();
        String token = jwtTokenUtil.generateToken(userDetails);
        
//        return ResponseEntity.ok(new JwtResponse(token, user.getUsername(),user.getEmail()));
        return ResponseEntity.ok(new JwtResponse(token, user.getUsername(),user.getEmail(), role));
    }

    
    @GetMapping("/current-user")
    public ResponseEntity<UserResponse> getCurrentUser(HttpSession session) {
       User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        UserResponse response = new UserResponse();
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        
        return ResponseEntity.ok(response);
   }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // For JWT, logout is handled client-side by token invalidation
        return ResponseEntity.ok("Logged out successfully");
    }
}