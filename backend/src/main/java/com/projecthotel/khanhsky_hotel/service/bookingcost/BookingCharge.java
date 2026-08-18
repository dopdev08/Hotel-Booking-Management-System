package com.projecthotel.khanhsky_hotel.service.bookingcost;

import java.math.BigDecimal;
import java.util.List;

public interface BookingCharge {
    BigDecimal cost();
    List<ChargeLine> breakdown();
}
