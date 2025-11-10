package com.shoppingmallcoco.project;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity 
public class WebSecurityConfig {
  
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	  http
	  
	  // CORS 설정을 Spring Security에 통합
	  .cors(withDefaults())
	  
        // CSRF 보호 비활성화
	  	.csrf(csrf -> csrf.disable()) 
        
        // 기본 로그인 폼 비활성화 (React 사용)
	  	.formLogin(formLogin -> formLogin.disable())
        
        // 모든 HTTP 요청에 대한 접근을 허용
        .authorizeHttpRequests(authz -> authz
            .anyRequest().permitAll()
        );

       return http.build();
  }
}