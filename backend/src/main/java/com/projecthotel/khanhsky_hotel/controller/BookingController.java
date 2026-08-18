package com.projecthotel.khanhsky_hotel.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.projecthotel.khanhsky_hotel.dto.request.BookingRequest;
import com.projecthotel.khanhsky_hotel.dto.response.BookingResponse;
import com.projecthotel.khanhsky_hotel.dto.response.RoomResponseDTO;
import com.projecthotel.khanhsky_hotel.exception.InvalidBookingRequestException;
import com.projecthotel.khanhsky_hotel.exception.ResourceNotFoundException;
import com.projecthotel.khanhsky_hotel.model.BookedRoom;
import com.projecthotel.khanhsky_hotel.model.Room;
import com.projecthotel.khanhsky_hotel.service.IBookingService;
import com.projecthotel.khanhsky_hotel.service.IRoomService;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final IBookingService bookingService;
    private final IRoomService roomService;

    @GetMapping("/all-bookings")
    public ResponseEntity<List<BookingResponse>> getAllBooking() {
        List<BookedRoom> bookings = bookingService.getAllBookings();
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedRoom booking : bookings) {
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

    @PostMapping("/room/{roomId}/booking")
    public ResponseEntity<?> saveBooking(@PathVariable Long roomId,
                                        @RequestBody BookingRequest bookingRequest) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
            || auth.getPrincipal() == null
            || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }

        // Lấy email từ user login, tránh FE spoof
        if (auth.getPrincipal() instanceof com.projecthotel.khanhsky_hotel.security.user.HotelUserDetails user) {
            bookingRequest.setGuestEmail(user.getEmail());
            bookingRequest.setGuestFullName(user.getEmail());
        }

        try {
            // 👉 Gọi createBooking, bên trong đã gọi saveBooking + Decorator
            BookingResponse dto = bookingService.createBooking(roomId, bookingRequest);

            return ResponseEntity.status(HttpStatus.CREATED).body(dto);

        } catch (InvalidBookingRequestException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Booking failed", "error", e.getMessage()));
        }
    }
    @PostMapping("/room/{roomId}/estimate")
    public ResponseEntity<?> estimate(@PathVariable Long roomId,
                                    @RequestBody BookingRequest bookingRequest) {

        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
            || auth.getPrincipal() == null
            || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }

        if (auth.getPrincipal() instanceof com.projecthotel.khanhsky_hotel.security.user.HotelUserDetails user) {
            bookingRequest.setGuestEmail(user.getEmail());
            bookingRequest.setGuestFullName(user.getEmail());
        }

        try {
            BookingResponse dto = bookingService.estimateBooking(roomId, bookingRequest);
            return ResponseEntity.ok(dto);
        } catch (InvalidBookingRequestException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Estimate failed", "error", e.getMessage()));
        }
}

    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode) {
        try {
            BookedRoom booking = bookingService.findByBookingConfirmationCode(confirmationCode);
            BookingResponse bookingResponse = getBookingResponse(booking);
            return ResponseEntity.ok(bookingResponse);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @GetMapping("/user/{email}/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserEmail(@PathVariable String email) {
        List<BookedRoom> bookings = bookingService.getBookingsByUserEmail(email);
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedRoom booking : bookings) {
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }

    @DeleteMapping("/booking/{bookingId}/delete")
    public void cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
    }
    @GetMapping("/admin/global-stats")
    // Chỉ cho phép người dùng có quyền ROLE_ADMIN truy cập
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<java.util.Map<String, Object>> getGlobalStats() {
        System.out.println(">>> Đang gọi API thống kê hệ thống...");
        try {
            java.util.Map<String, Object> stats = bookingService.getGlobalStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Không thể tải thống kê hệ thống"));
        }
    }
    @GetMapping("/user/{email}/stats")
    public ResponseEntity<com.projecthotel.khanhsky_hotel.dto.response.UserStatsDTO> getUserStats(@PathVariable String email) {
        // Kiểm tra quyền truy cập (tùy chọn): Đảm bảo chỉ chính chủ hoặc Admin mới được xem
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        String currentUserName = auth.getName();

        if (!isAdmin && !currentUserName.equals(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            com.projecthotel.khanhsky_hotel.dto.response.UserStatsDTO stats = bookingService.calculateUserStats(email);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

   private BookingResponse getBookingResponse(BookedRoom booking) {
    Room theRoom = roomService.getRoomById(booking.getRoom().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

    // Map Room -> RoomResponseDTO bằng setter
    RoomResponseDTO roomDTO = new RoomResponseDTO();
    roomDTO.setId(theRoom.getId());
    roomDTO.setRoomType(theRoom.getRoomType());
    roomDTO.setRoomPrice(
            theRoom.getRoomPrice() != null
                    ? theRoom.getRoomPrice()
                    : BigDecimal.ZERO
    );
    roomDTO.setBooked(theRoom.isBooked()); // field isBooked -> setter là setBooked(...)
    roomDTO.setPhoto(null);                // nếu sau này muốn Base64 thì map ở đây
    roomDTO.setBookings(null);             // tránh vòng lặp

    // Map BookedRoom -> BookingResponse
    BookingResponse res = new BookingResponse();
    res.setId(booking.getBookingId());
    res.setCheckInDate(booking.getCheckInDate());
    res.setCheckOutDate(booking.getCheckOutDate());
    res.setGuestFullName(booking.getGuestFullName());
    res.setGuestEmail(booking.getGuestEmail());
    res.setTotalNumberOfGuest(booking.getTotalNumberOfGuest());
    res.setBookingConfirmationCode(booking.getBookingConfirmationCode());
    res.setRoom(roomDTO);

    // selectedServices: Set<ServiceType> -> Set<String>
    Set<String> serviceNames =
            booking.getSelectedServices() != null
                    ? booking.getSelectedServices().stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet())
                    : Set.of();
    res.setSelectedServices(serviceNames);

    // totalAmount: luôn BigDecimal, tránh null
    res.setTotalAmount(
            booking.getTotalAmount() != null
                    ? booking.getTotalAmount()
                    : BigDecimal.ZERO
    );

    return res;
}

}
