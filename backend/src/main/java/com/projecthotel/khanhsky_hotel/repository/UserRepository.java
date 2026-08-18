package com.projecthotel.khanhsky_hotel.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projecthotel.khanhsky_hotel.model.User;

public interface UserRepository extends JpaRepository<User,Long>{
    boolean existsByEmail(String email);

    void deleteByEmail(String email);

    Optional<User> findByEmail(String email);
}
