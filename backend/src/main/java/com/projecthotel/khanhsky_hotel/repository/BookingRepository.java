package com.projecthotel.khanhsky_hotel.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Quan trọng
import org.springframework.data.repository.query.Param; // Quan trọng
import com.projecthotel.khanhsky_hotel.model.BookedRoom;

public interface BookingRepository extends JpaRepository<BookedRoom, Long> {
    
    List<BookedRoom> findByRoom_Id(Long roomId);

    Optional<BookedRoom> findByBookingConfirmationCode(String confirmationCode);

    List<BookedRoom> findByGuestEmail(String email);

    @Query(value = "SELECT COUNT(booking_id) as totalBookings, " +
                   "SUM(total_amount) as totalSpent, " +
                   "SUM(DATEDIFF(check_out_date, check_in_date)) as totalNights " +
                   "FROM booked_room WHERE guest_email = :email", nativeQuery = true)
    Object getRawStatsByEmail(@Param("email") String email);
}