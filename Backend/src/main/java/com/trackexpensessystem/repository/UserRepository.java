package com.trackexpensessystem.repository;

import com.trackexpensessystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    // Add these methods
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}