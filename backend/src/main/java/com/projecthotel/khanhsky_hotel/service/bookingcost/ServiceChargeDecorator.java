package com.projecthotel.khanhsky_hotel.service.bookingcost;

import java.math.BigDecimal;

import com.projecthotel.khanhsky_hotel.model.ServiceType;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ServiceChargeDecorator extends ChargeDecorator {

    private final ServiceType service;
    private final int guestCount;
    private final long nights;

    public ServiceChargeDecorator(BookingCharge inner, ServiceType service, int guestCount, long nights) {
        super(inner);
        this.service = service;
        this.guestCount = guestCount;
        this.nights = nights;
    }

    private long quantity() {
        return switch (service.getRule()) {
            case FIXED -> 1L;
            case PER_NIGHT -> nights;
            case PER_PERSON_PER_NIGHT -> (long) guestCount * nights;
        };
    }

    private BigDecimal amount() {
        return service.getPrice().multiply(BigDecimal.valueOf(quantity()));
    }

    @Override
    public BigDecimal cost() {
        return inner.cost().add(amount());
    }

    @Override
    public List<ChargeLine> breakdown() {
        List<ChargeLine> lines = new ArrayList<>(inner.breakdown());

        lines.add(new ChargeLine(
                service.name(),                 // AIRPORT_PICKUP / EXTRA_BED / BREAKFAST
                service.name(),                 // nếu sau này có displayName thì thay vào
                service.getRule().name(),       // FIXED / PER_NIGHT / PER_PERSON_PER_NIGHT
                service.getPrice(),             // unitPrice
                quantity(),                     // qty
                amount()                        // amount
        ));

        return lines;
    }
}