package com.projecthotel.khanhsky_hotel.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import com.projecthotel.khanhsky_hotel.service.bookingcost.ChargeLine;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {

    private Long id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String guestFullName;
    private String guestEmail;
    private int totalNumberOfGuest;
    private String bookingConfirmationCode;
    private RoomResponseDTO room; // dùng DTO thay vì entity
    private Set<String> selectedServices; // enum name
    private BigDecimal totalAmount; // convert BigDecimal -> double
    private List<ChargeLine> breakdown;
    // Constructor tối giản nếu cần
    public BookingResponse(Long id, LocalDate checkInDate, LocalDate checkOutDate, String bookingConfirmationCode) {
        this.id = id;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.bookingConfirmationCode = bookingConfirmationCode;
    }
}
