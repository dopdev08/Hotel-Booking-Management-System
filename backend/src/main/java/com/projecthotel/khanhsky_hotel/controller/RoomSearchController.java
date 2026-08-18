package com.projecthotel.khanhsky_hotel.controller;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projecthotel.khanhsky_hotel.dto.response.RoomResponse;
import com.projecthotel.khanhsky_hotel.model.Room;
import com.projecthotel.khanhsky_hotel.service.IRoomService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
public class RoomSearchController {

    private final IRoomService roomService;

    @GetMapping("/rooms/search")
    public List<RoomResponse> searchAvailableRooms(

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate checkIn,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate checkOut,

            @RequestParam(required = false)
            String roomType

    ) throws SQLException {

        // 1️⃣ Lấy danh sách phòng trống
        List<Room> rooms = roomService.getAvailabelRooms(
                checkIn,
                checkOut,
                roomType == null ? "" : roomType
        );

        // 2️⃣ Map sang RoomResponse
        return rooms.stream().map(room -> {
            try {
                byte[] photoBytes =
                        roomService.getRoomPhotoByRoomId(room.getId());

                return new RoomResponse(
                        room.getId(),
                        room.getRoomType(),
                        room.getRoomPrice(),
                        room.isBooked(),
                        photoBytes,
                        null
                );
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }).toList();
    }
}