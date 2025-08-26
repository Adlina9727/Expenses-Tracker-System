package com.trackexpensessystem.service;

import com.trackexpensessystem.exception.ResourceNotFoundException;
import com.trackexpensessystem.model.Expense;
import com.trackexpensessystem.model.User;
import com.trackexpensessystem.model.Role;
import com.trackexpensessystem.repository.ExpenseRepository;
import com.trackexpensessystem.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
//import java.util.Optional;

@Service
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    public AdminService(UserRepository userRepository, 
                      ExpenseRepository expenseRepository) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Expense> getUserExpenses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return expenseRepository.findByUser(user);
    }

    @Transactional(readOnly = true)
    public Page<Expense> getUserExpensesPaginated(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        // You'll need to add this method to your ExpenseRepository
        return expenseRepository.findByUser(user, pageable);
    }

    public void updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setRole(newRole);
        userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        expenseRepository.deleteByUser(user);
        userRepository.delete(user);
    }
}