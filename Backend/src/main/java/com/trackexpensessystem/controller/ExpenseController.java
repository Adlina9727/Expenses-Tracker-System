// ExpenseController.java
package com.trackexpensessystem.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule; 
import org.springframework.http.HttpStatus;
import com.trackexpensessystem.model.Expense;
import com.trackexpensessystem.model.User;
import com.trackexpensessystem.repository.ExpenseRepository;
import com.trackexpensessystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
//import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@CrossOrigin(
		origins = "http://localhost:3000" , 
		methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS},
		allowedHeaders = "*",  allowCredentials = "true"
		)
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public ResponseEntity<Expense> createExpense(
    		@RequestPart("expense") String expenseJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {
        
    	  try {
    	        ObjectMapper objectMapper = new ObjectMapper();
    	        objectMapper.registerModule(new JavaTimeModule());
    	        Expense expense = objectMapper.readValue(expenseJson, Expense.class);
    	        
    	        User user = userRepository.findByEmail(userDetails.getUsername())
    	                .orElseThrow(() -> new RuntimeException("User not found"));
    	        
    	        expense.setUser(user);
    	        
    	        if (image != null && !image.isEmpty()) {
    	            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
    	            Path uploadPath = Paths.get(UPLOAD_DIR);
    	            if (!Files.exists(uploadPath)) {
    	                Files.createDirectories(uploadPath);
    	            }
    	            Path filePath = uploadPath.resolve(fileName);
    	            image.transferTo(filePath);
    	            expense.setImagePath(fileName);
    	        }
    	        
    	        Expense savedExpense = expenseRepository.save(expense);
    	        return ResponseEntity.ok(savedExpense);
    	        
    	    } catch (Exception e) {
    	        e.printStackTrace();
    	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    	    }
    	}

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(expenseRepository.findByUser(user));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Double>> getExpenseSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Expense> expenses = expenseRepository.findByUser(user);
        
        if (expenses.isEmpty()) {
            return ResponseEntity.ok(Map.of()); // Return empty map if no expenses
        }
        
        Map<String, Double> summary = expenses.stream()
            .collect(Collectors.groupingBy(
                e -> e.getCategory().name(),
                Collectors.summingDouble(Expense::getAmount)
            ));
            
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/by-date")
    public ResponseEntity<Map<Date, Double>> getExpensesByDate(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Expense> expenses = expenseRepository.findByUser(user);
        
        Map<Date, Double> dateSummary = expenses.stream()
            .collect(Collectors.groupingBy(
                Expense::getDate,
                Collectors.summingDouble(Expense::getAmount))
            );
            
        return ResponseEntity.ok(dateSummary);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expenseDetails) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        expense.setTitle(expenseDetails.getTitle());
        expense.setAmount(expenseDetails.getAmount());
        expense.setDate(expenseDetails.getDate());
        expense.setCategory(expenseDetails.getCategory());
        expense.setDescription(expenseDetails.getDescription());
        
        return ResponseEntity.ok(expenseRepository.save(expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}