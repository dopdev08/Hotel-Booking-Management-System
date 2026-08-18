package com.projecthotel.khanhsky_hotel.service.bookingcost;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class BasicRoomCharge implements BookingCharge {

    private final BigDecimal roomPrice;
    private final long nights;

    @Override
    public BigDecimal cost() {
        if (roomPrice == null || nights <= 0) {
            return BigDecimal.ZERO;
        }
        return roomPrice.multiply(BigDecimal.valueOf(nights));
    }

    @Override
    public List<ChargeLine> breakdown() {
        BigDecimal amount = cost();
        return List.of(new ChargeLine(
                "ROOM",
                "Room Charge",
                "PER_NIGHT",
                roomPrice,
                nights,
                amount
        ));
    }
}
