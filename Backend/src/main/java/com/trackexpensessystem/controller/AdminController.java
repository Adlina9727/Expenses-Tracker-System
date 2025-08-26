package com.trackexpensessystem.controller;
import com.trackexpensessystem.model.Expense;
import com.trackexpensessystem.model.User;
import com.trackexpensessystem.model.Role;
import com.trackexpensessystem.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
	 private final AdminService adminService;
	    
	    public AdminController(AdminService adminService) {
	        this.adminService = adminService;
	    }
	    @GetMapping("/users")
	    public List<User> getAllUsers() {
	        return adminService.getAllUsers();
	    }

	    @GetMapping("/expenses")
	    public List<Expense> getUserExpenses(@RequestParam Long userId) {
	        return adminService.getUserExpenses(userId);
	    }

	    @PutMapping("/users/{userId}/role")
	    public ResponseEntity<Void> updateUserRole(
	            @PathVariable Long userId,
	            @RequestParam Role role) {
	        adminService.updateUserRole(userId, role);
	        return ResponseEntity.ok().build();
	    }
	    // Paginated version
	    @GetMapping("/expenses/paginated")
	    public Page<Expense> getUserExpensesPaginated(
	            @RequestParam Long userId,
	            Pageable pageable) {
	        return adminService.getUserExpensesPaginated(userId, pageable);
	    }
}
