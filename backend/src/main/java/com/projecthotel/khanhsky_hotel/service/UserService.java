package com.projecthotel.khanhsky_hotel.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projecthotel.khanhsky_hotel.exception.UserAlreadyExistsException;
import com.projecthotel.khanhsky_hotel.model.Role;
import com.projecthotel.khanhsky_hotel.model.User;
import com.projecthotel.khanhsky_hotel.repository.RoleRepository;
import com.projecthotel.khanhsky_hotel.repository.UserRepository;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Override
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException(user.getEmail() + " already exists");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Ensure ROLE_USER exists
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));
        user.setRoles(Collections.singletonList(userRole));

        User savedUser = userRepository.save(user);
        savedUser.setPassword(null); // hide password before returning
        return savedUser;
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll()
                .stream()
                .peek(u -> u.setPassword(null)) // hide password
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void deleteUser(String email) {
        User user = getUser(email); // throws if not found
        userRepository.deleteByEmail(email);
    }

    @Override
    public User getUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setPassword(null); // hide password
        return user;
    }
    @Override
    @Transactional
    public User updateUser(String email, User userDetails) {
        // 1. Tìm user gốc từ DB (Sử dụng repository trực tiếp để lấy đầy đủ data gồm password)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        // 2. Cập nhật các trường thông tin cho phép
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhone(userDetails.getPhone());

        // 3. Lưu lại
        User updatedUser = userRepository.save(user);

        // 4. Ẩn password trước khi trả về để bảo mật
        updatedUser.setPassword(null);
        return updatedUser;
    }
}
