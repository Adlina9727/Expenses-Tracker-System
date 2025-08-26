package com.trackexpensessystem.repository;
import com.trackexpensessystem.model.Expense;
import com.trackexpensessystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; 
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
    Page<Expense> findByUser(User user, Pageable pageable);  // Add this for pagination
    void deleteByUser(User user);  // Add this for user deletion
    List<Expense> findByUserAndDateBetween(User user, Date startDate, Date endDate);
    List<Expense> findByUserAndCategory(User user, Expense.Category category);
}