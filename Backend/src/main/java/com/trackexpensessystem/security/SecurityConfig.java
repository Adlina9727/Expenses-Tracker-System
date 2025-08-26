package com.trackexpensessystem.security;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.trackexpensessystem.config.JwtRequestFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	@Autowired
    private JwtRequestFilter jwtRequestFilter;

	 
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	        http
	            .csrf(csrf -> csrf.disable())
	            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
	            .authorizeHttpRequests(auth -> auth
	                .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/logout").permitAll()
	                .requestMatchers("api/expenses","api/expenses/summary").authenticated()
	                .anyRequest().authenticated()
	            )
	            .sessionManagement(session -> session
	                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
	            )
	          
	            .logout(logout -> logout
	                    .logoutUrl("/api/auth/logout")
	                    .logoutSuccessHandler((request, response, authentication) -> {
	                        response.setStatus(200);
	                        response.getWriter().write("{\"message\": \"Logged out successfully\"}");
	                    })
	                    .permitAll()
	                );
	        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
	        
	        return http.build();
	    }

    @Bean 
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    
    @Bean
   CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:3000")); // Update with your frontend URL
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setExposedHeaders(List.of("Authorization")); 
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}