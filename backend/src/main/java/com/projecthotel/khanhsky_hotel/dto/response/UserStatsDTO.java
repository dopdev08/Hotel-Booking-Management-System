package com.projecthotel.khanhsky_hotel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserStatsDTO {
    private String email;
    
    // Thống kê số lượng
    private long totalBookings;      // Tổng số đơn đặt phòng
    private long completedBookings;  // Số đơn đã hoàn thành
    private long cancelledBookings;  // Số đơn đã hủy
    
    // Thống kê thời gian và tiền bạc
    private long totalNights;        // Tổng số đêm đã lưu trú
    private BigDecimal totalSpent;   // Tổng số tiền đã thanh toán (BigDecimal chính xác hơn double)
    
    // Thông tin mở rộng (Dùng cho giao diện Profile đẹp hơn)
    private String memberRank;       // Hạng thành viên (Đồng, Bạc, Vàng, Kim Cương)
    private int loyaltyPoints;       // Điểm tích lũy
}