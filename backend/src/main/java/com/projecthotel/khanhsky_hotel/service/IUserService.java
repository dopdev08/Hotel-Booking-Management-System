package com.projecthotel.khanhsky_hotel.service;

import java.util.List;

import com.projecthotel.khanhsky_hotel.model.User;

public interface IUserService {
    User registerUser(User user);
    List<User> getUsers();
    void deleteUser(String email);
    User getUser(String email);
    User updateUser(String email, User userDetails);
}
