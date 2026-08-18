package com.projecthotel.khanhsky_hotel.security;

import com.projecthotel.khanhsky_hotel.security.jwt.AuthTokenFilter;
import com.projecthotel.khanhsky_hotel.security.jwt.JwtAuthEntryPoint;
import com.projecthotel.khanhsky_hotel.security.jwt.JwtUtils;
import com.projecthotel.khanhsky_hotel.security.user.HotelUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class WebSecurityConfig {

    private final HotelUserDetailsService userDetailsService;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final CorsConfigurationSource mycorsConfigurationSource;

    // ================= JWT FILTER =================
    @Bean
    public AuthTokenFilter authenticationTokenFilter(
            JwtUtils jwtUtils,
            HotelUserDetailsService userDetailsService) {

        AuthTokenFilter filter = new AuthTokenFilter();
        filter.setJwtUtils(jwtUtils);
        filter.setUserDetailsService(userDetailsService);
        return filter;
    }

    // ================= PASSWORD ENCODER =================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ================= AUTH MANAGER =================
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder builder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        builder.userDetailsService(userDetailsService)
               .passwordEncoder(passwordEncoder());

        return builder.build();
    }

    // ================= SECURITY FILTER CHAIN =================
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                        AuthTokenFilter authTokenFilter) throws Exception {

        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(mycorsConfigurationSource))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthEntryPoint))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ✅ AUTH PUBLIC
                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()

                // ✅ CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // public APIs
                .requestMatchers("/rooms/**").permitAll()
                // Allow GET bookings endpoints publicly (confirmation, listing), but require auth for creating/canceling bookings
                .requestMatchers(HttpMethod.GET, "/bookings/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/bookings/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/bookings/**").authenticated()

                .requestMatchers("/bootstrap/**").permitAll()

                // Allow the error dispatcher so forwarded errors (e.g. /error) are accessible
                .requestMatchers("/error").permitAll()

                // everything else
                .anyRequest().authenticated()
            );

        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
