package com.projecthotel.khanhsky_hotel.service;

import java.util.List;
import com.projecthotel.khanhsky_hotel.dto.request.BookingRequest;
import com.projecthotel.khanhsky_hotel.dto.response.BookingResponse;
import com.projecthotel.khanhsky_hotel.dto.response.UserStatsDTO;
import com.projecthotel.khanhsky_hotel.model.BookedRoom;
import java.util.Map;
public interface IBookingService {
    void cancelBooking(Long bookingId);

    List<BookedRoom> getAllBookingsByRoomId(Long roomId);

    // Sửa phương thức saveBooking để nhận DTO BookingRequest
    String saveBooking(Long roomId, BookingRequest bookingRequest);

    BookedRoom findByBookingConfirmationCode(String confirmationCode);
    List<BookedRoom> getAllBookings();
    List<BookedRoom> getBookingsByUserEmail(String email);
    UserStatsDTO calculateUserStats(String email);
    Map<String, Object> getGlobalStats();
    BookingResponse createBooking(Long roomId, BookingRequest bookingRequest);
    BookingResponse estimateBooking(Long roomId, BookingRequest bookingRequest);
}
