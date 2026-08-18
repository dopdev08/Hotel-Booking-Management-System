package com.projecthotel.khanhsky_hotel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projecthotel.khanhsky_hotel.dto.request.LoginRequest;
import com.projecthotel.khanhsky_hotel.dto.request.RegisterRequest;
import com.projecthotel.khanhsky_hotel.dto.response.JwtResponse;
import com.projecthotel.khanhsky_hotel.exception.UserAlreadyExistsException;
import com.projecthotel.khanhsky_hotel.model.User;
import com.projecthotel.khanhsky_hotel.security.jwt.JwtUtils;
import com.projecthotel.khanhsky_hotel.security.user.HotelUserDetails;
import com.projecthotel.khanhsky_hotel.service.IUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IUserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Validated @RequestBody LoginRequest request) {

        // 1. Authenticate email + password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Set security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Generate JWT
        String token = jwtUtils.generateJwtTokenForUser(authentication);

        // 4. Get user info
        HotelUserDetails userDetails =
                (HotelUserDetails) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        // 5. Response đúng frontend
        JwtResponse response = new JwtResponse(
                userDetails.getId(),
                userDetails.getEmail(),
                token,
                roles
        );

        return ResponseEntity.ok(response);
    }


    // ================= REGISTER (NO SECURITY) =================
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody RegisterRequest request) {

        System.out.println(">>> REGISTER API HIT <<<");

        try {
            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setPhone(request.getPhone());
            User created = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(java.util.Map.of("message", "Registration successful!", "email", created.getEmail(), "id", created.getId()));
        } catch (UserAlreadyExistsException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Internal server error: " + ex.getMessage()));
        }
    }
}
