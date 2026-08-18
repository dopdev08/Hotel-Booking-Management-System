package com.projecthotel.khanhsky_hotel.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.projecthotel.khanhsky_hotel.model.Role;
import com.projecthotel.khanhsky_hotel.model.User;
import com.projecthotel.khanhsky_hotel.repository.RoleRepository;
import com.projecthotel.khanhsky_hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bootstrap")
@RequiredArgsConstructor
public class BootstrapController {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 👉 LẤY TỪ application.yml
    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @PostMapping("/init")
    public ResponseEntity<?> initSystem() {

        // ===== ROLES =====
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

        // ===== ADMIN USER (DEFAULT) =====
        boolean adminCreated = false;

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.getRoles().add(adminRole);

            userRepository.save(admin);
            adminCreated = true;
        }

        return ResponseEntity.ok(
                Map.of(
                        "status", "OK",
                        "adminEmail", adminEmail,
                        "adminCreated", adminCreated
                )
        );
    }
}
