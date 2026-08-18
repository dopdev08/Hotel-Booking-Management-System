package com.projecthotel.khanhsky_hotel.dto.request;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import lombok.Data;

@Data
public class BookingRequest {
    private String guestEmail;
    private String guestFullName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int totalNumberOfGuest;
    private List<String> selectedServices; // nhận từ JSON ["AIRPORT_PICKUP", "BREAKFAST"]
}
