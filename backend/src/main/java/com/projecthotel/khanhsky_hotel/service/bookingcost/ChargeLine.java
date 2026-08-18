package com.projecthotel.khanhsky_hotel.service.bookingcost;

import java.math.BigDecimal;

public record ChargeLine(
        String code,                 // ROOM / AIRPORT_PICKUP / EXTRA_BED / BREAKFAST
        String name,                 // Room Charge / AIRPORT_PICKUP ...
        String rule,                 // FIXED / PER_NIGHT / PER_PERSON_PER_NIGHT
        BigDecimal unitPrice,        // giá đơn vị
        long quantity,               // số lượng đã tính (theo nights/guests)
        BigDecimal amount            // thành tiền
) {}