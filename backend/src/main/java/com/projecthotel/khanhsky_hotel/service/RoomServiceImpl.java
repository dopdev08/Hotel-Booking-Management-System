package com.projecthotel.khanhsky_hotel.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.projecthotel.khanhsky_hotel.model.Room;
import com.projecthotel.khanhsky_hotel.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements IRoomService {

    private final RoomRepository roomRepository;

    // ================== ADD NEW ROOM ==================
    @Override
    public Room addNewRoom(
            MultipartFile photo,
            String roomType,
            BigDecimal roomPrice
    ) throws SQLException, IOException {

        Room room = new Room();
        room.setRoomType(roomType);
        room.setRoomPrice(roomPrice);

        if (photo != null && !photo.isEmpty()) {
            byte[] photoBytes = photo.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            room.setPhoto(photoBlob);
        }

        return roomRepository.save(room);
    }

    // ================== GET ALL ROOMS ==================
    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // ================== GET ROOM TYPES ==================
    @Override
    public List<String> getAllRoomTypes() {
        return roomRepository.findDistinctRoomTypes();
    }

    // ================== GET ROOM PHOTO ==================
    @Override
    public byte[] getRoomPhotoByRoomId(Long roomId) throws SQLException {
        Optional<Room> roomOpt = roomRepository.findById(roomId);

        if (roomOpt.isPresent() && roomOpt.get().getPhoto() != null) {
            Blob photoBlob = roomOpt.get().getPhoto();
            return photoBlob.getBytes(1, (int) photoBlob.length());
        }
        return null;
    }

    // ================== DELETE ROOM ==================
    @Override
    public void deleteRoom(Long roomId) {
        roomRepository.deleteById(roomId);
    }

    // ================== GET ROOM BY ID ==================
    @Override
    public Optional<Room> getRoomById(Long roomId) {
        return roomRepository.findById(roomId);
    }

    // ================== FIND AVAILABLE ROOMS ==================
    @Override
    public List<Room> getAvailabelRooms(
            LocalDate checkInDate,
            LocalDate checkOutDate,
            String roomType
    ) {
        return roomRepository.findAvailableRoomsByDatesAndType(
                checkInDate,
                checkOutDate,
                roomType
        );
    }

    // ================== UPDATE ROOM ==================
    @Override
    public Room updateRoom(
            Long id,
            String roomType,
            BigDecimal roomPrice,
            byte[] photoBytes
    ) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (roomType != null) {
            room.setRoomType(roomType);
        }

        if (roomPrice != null) {
            room.setRoomPrice(roomPrice);
        }

        if (photoBytes != null && photoBytes.length > 0) {
            try {
                Blob photoBlob = new SerialBlob(photoBytes);
                room.setPhoto(photoBlob);
            } catch (SQLException e) {
                throw new RuntimeException("Error updating photo", e);
            }
        }

        return roomRepository.save(room);
    }
}
