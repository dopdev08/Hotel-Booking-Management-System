package com.projecthotel.khanhsky_hotel.service.bookingcost;

import com.projecthotel.khanhsky_hotel.model.Room;
import com.projecthotel.khanhsky_hotel.model.ServiceType;

import java.util.Set;

public class BookingChargeFactory {
    private BookingChargeFactory() {}

    public static BookingCharge build(Room room, long nights, int guestCount, Set<ServiceType> services) {
        BookingCharge charge = new BasicRoomCharge(room.getRoomPrice(), nights);

        if (services == null || services.isEmpty()) return charge;

        for (ServiceType s : services) {
            charge = new ServiceChargeDecorator(charge, s, guestCount, nights);
        }
        return charge;
    }
}
