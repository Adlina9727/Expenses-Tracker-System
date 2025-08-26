package com.trackexpensessystem.model;
//import com.fasterxml.jackson.annotation.JsonCreator;
//import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum Role {
	 ROLE_USER,
	 ROLE_ADMIN;
	
	 public static Role fromString(String role) {
	        try {
	            return Role.valueOf(role.toUpperCase());
	        } catch (IllegalArgumentException e) {
	            throw new IllegalArgumentException(
	                "Invalid role: " + role + ". Allowed values: " + Arrays.toString(values())
	            );
	        }
	    }
}
