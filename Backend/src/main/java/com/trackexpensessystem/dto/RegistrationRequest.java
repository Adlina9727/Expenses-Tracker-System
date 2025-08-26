package com.trackexpensessystem.dto;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.trackexpensessystem.model.Role;

@Data
public class RegistrationRequest {
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
    
//    @JsonProperty("role")
    private Role role; 
    
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getConfirmPassword() {
		return confirmPassword;
	}
	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}
	 public Role getRole() {
	        return role;
	    }

	    public void setRole(Role role) {
	        this.role = role;
	    }
	
	public RegistrationRequest() {
		super();
		// TODO Auto-generated constructor stub
	}
    
	
    
}
