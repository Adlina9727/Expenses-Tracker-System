package com.trackexpensessystem.model;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
@Table(name = "expense")
public class Expense {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    
	    private String title;
	    private Double amount;
	    private Date date;
	    
	    @Enumerated(EnumType.STRING)
	    private Category category;
	    
	    private String description;
	    private String imagePath;
	    
	    @ManyToOne
	    @JoinColumn(name = "user_id")
	    private User user;

	    // Getters and Setters
	    public enum Category {
	        FOOD, TRANSPORT, HOUSING, ENTERTAINMENT, UTILITIES, OTHERS
	    }

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public Double getAmount() {
			return amount;
		}

		public void setAmount(Double amount) {
			this.amount = amount;
		}

		public Date getDate() {
			return date;
		}

		public void setDate(Date date) {
			this.date = date;
		}

		public Category getCategory() {
			return category;
		}

		public void setCategory(Category category) {
			this.category = category;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public String getImagePath() {
			return imagePath;
		}

		public void setImagePath(String imagePath) {
			this.imagePath = imagePath;
		}

		public User getUser() {
			return user;
		}

		public void setUser(User user) {
			this.user = user;
		}
	    
	    
}
