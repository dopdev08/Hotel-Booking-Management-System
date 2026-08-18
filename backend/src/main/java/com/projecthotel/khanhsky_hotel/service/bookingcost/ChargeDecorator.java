package com.projecthotel.khanhsky_hotel.service.bookingcost;

public abstract class ChargeDecorator implements BookingCharge {
    protected final BookingCharge inner;

    protected ChargeDecorator(BookingCharge inner) {
        this.inner = inner;
    }
}