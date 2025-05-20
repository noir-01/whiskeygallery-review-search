package com.whiskeygallery_review.review_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // 프론트엔드에서 오는 요청을 허용
                registry.addMapping("/api/review/**")
                        .allowedOrigins("*") // 프론트엔드 URL
                        .allowedMethods("GET");
            }
        };
    }
}
