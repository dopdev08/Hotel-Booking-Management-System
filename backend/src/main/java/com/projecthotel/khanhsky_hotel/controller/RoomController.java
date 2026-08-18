package com.projecthotel.khanhsky_hotel.controller;
import org.springframework.web.bind.annotation.CrossOrigin;


import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.projecthotel.khanhsky_hotel.dto.response.BookingResponse;
import com.projecthotel.khanhsky_hotel.dto.response.RoomResponse;
import com.projecthotel.khanhsky_hotel.exception.PhotoRetrievalException;
import com.projecthotel.khanhsky_hotel.exception.ResourceNotFoundException;
import com.projecthotel.khanhsky_hotel.model.BookedRoom;
import com.projecthotel.khanhsky_hotel.model.Room;
import com.projecthotel.khanhsky_hotel.service.BookingService;
import com.projecthotel.khanhsky_hotel.service.IRoomService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {

    private final IRoomService roomService;
    private final BookingService bookingService;
    
    @PostMapping("add/new-room")
    public ResponseEntity<RoomResponse> addNewRoom(
         @RequestParam("photo") MultipartFile photo,
         @RequestParam("roomType") String roomType,
         @RequestParam("roomPrice") BigDecimal roomPrice) throws SQLException, IOException{
        
        Room savedRoom = roomService.addNewRoom(photo,roomType,roomPrice);
        RoomResponse response = new RoomResponse(savedRoom.getId(),savedRoom.getRoomType(), savedRoom.getRoomPrice());
        return ResponseEntity.ok(response);


        }
        @GetMapping("/room/{roomId}")
        public ResponseEntity<Optional<RoomResponse>> getRoomById(@PathVariable Long roomId) {
            Optional<Room> theRoom = roomService.getRoomById(roomId);
            return theRoom.map(room->{
                RoomResponse roomResponse = getRoomResponse(room);
                return ResponseEntity.ok(Optional.of(roomResponse));

            }).orElseThrow(()-> new ResourceNotFoundException("không tìm thấy phòng"));

        }
        @GetMapping("room/types")
        public List<String> getRoomTypes() {
            return roomService.getAllRoomTypes();
        }

        @GetMapping("all-rooms")
        public ResponseEntity<List<RoomResponse>> getAllRooms() throws SQLException{
            List<Room> rooms = roomService.getAllRooms();
            List<RoomResponse> roomResponses = new ArrayList<>();
            for(Room room:rooms) {
                byte[] photoBytes = roomService.getRoomPhotoByRoomId(room.getId());
                RoomResponse roomResponse = getRoomResponse(room);

                if(photoBytes != null && photoBytes.length > 0) {
                    String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
                    roomResponse.setPhoto(base64Photo);
                }
                else{
                    roomResponse.setPhoto(null);
                }

                roomResponses.add(roomResponse);
                

            }
            return ResponseEntity.ok(roomResponses);
        }
        @DeleteMapping("/delete/room/{roomId}")
        public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
            roomService.deleteRoom(roomId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);

        }
        
        @PutMapping("/update/{roomId}")
        public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long roomId,
                                                       @RequestParam (required = false) String roomType,
                                                       @RequestParam (required = false) BigDecimal roomPrice,
                                                       @RequestParam (required = false) MultipartFile photo    
                                                       ) throws SQLException, IOException {
            byte[] photoBytes = photo != null && !photo.isEmpty() ?
                    photo.getBytes() : roomService.getRoomPhotoByRoomId(roomId);
            Blob photoBlob = photoBytes != null && photoBytes.length > 0
                                                        ? new SerialBlob(photoBytes) : null;
            Room theRoom = roomService.updateRoom(roomId, roomType, roomPrice, photoBytes);
            theRoom.setPhoto(photoBlob);
            RoomResponse roomResponse = getRoomResponse(theRoom);
            return ResponseEntity.ok(roomResponse);


        }
        private RoomResponse getRoomResponse(Room room) {
            List<BookedRoom> bookings = getAllBookingsByRoomId(room.getId());
            List<BookingResponse> booKingInfo = bookings
                     .stream()
                     .map(booking-> new BookingResponse(
                         booking.getBookingId(),
                         booking.getCheckInDate(),
                         booking.getCheckOutDate(),
                         booking.getBookingConfirmationCode()
                     ))
                     .toList();
            byte[] photoBytes = null;
            Blob photoBlob = room.getPhoto();

            if(photoBlob != null) {
                try{
                    photoBytes = photoBlob.getBytes(1,(int) photoBlob.length());
                }
                catch (SQLException e) {
                    throw new PhotoRetrievalException("Lỗi truy xuất ảnh");
                }
            }
            return new RoomResponse(room.getId(),
                                    room.getRoomType(),
                                    room.getRoomPrice(),
                                    room.isBooked(),photoBytes,booKingInfo);

            


        }

        private List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
            return bookingService.getAllBookingsByRoomId(roomId);

        }
    
}
