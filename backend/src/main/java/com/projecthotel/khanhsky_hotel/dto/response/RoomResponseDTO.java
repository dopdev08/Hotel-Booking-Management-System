package com.projecthotel.khanhsky_hotel.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.projecthotel.khanhsky_hotel.model.BookedRoom;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO trả về thông tin phòng cho frontend
 */
@Data
@NoArgsConstructor

public class RoomResponseDTO {
    private Long id;
    private String roomType;
    private BigDecimal roomPrice; // convert từ BigDecimal -> double
    private boolean isBooked;
    private String photo; // Base64 string
    private List<BookingResponse> bookings; // danh sách booking đã xác nhận

    /**
     * Constructor dùng khi mapping từ entity Room, convert giá và booking list
     * @param id
     * @param roomType
     * @param roomPrice
     * @param isBooked
     * @param photo
     * @param bookingsFromRoom entity booking list
     */
    
}
