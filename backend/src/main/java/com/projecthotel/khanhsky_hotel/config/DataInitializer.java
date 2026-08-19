package com.projecthotel.khanhsky_hotel.config;

import com.projecthotel.khanhsky_hotel.model.Role;
import com.projecthotel.khanhsky_hotel.model.User;
import com.projecthotel.khanhsky_hotel.repository.RoleRepository;
import com.projecthotel.khanhsky_hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Ensure roles
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));
        roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

        // Ensure admin user
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.getRoles().add(adminRole);
            userRepository.save(admin);
            System.out.println("Default admin created: " + adminEmail);
        } else {
            System.out.println("Admin already exists: " + adminEmail);
        }
    }
}