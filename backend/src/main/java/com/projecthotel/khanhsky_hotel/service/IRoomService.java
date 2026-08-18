package com.projecthotel.khanhsky_hotel.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.projecthotel.khanhsky_hotel.model.Room;

public interface IRoomService {
    Room addNewRoom(MultipartFile photo, String roomType, BigDecimal roomPrice) throws SQLException,IOException;
    List<Room> getAllRooms();
    List<String>getAllRoomTypes();
    byte[] getRoomPhotoByRoomId(Long roomId) throws SQLException;
    void deleteRoom(Long roomId);
    Optional<Room>getRoomById(Long roomId);
    List<Room>getAvailabelRooms(LocalDate checkInDate,LocalDate checkOutDate,String roomType);
    Room updateRoom(Long id,String roomType,BigDecimal roomPrice,byte[] photoBytes);
    
}

