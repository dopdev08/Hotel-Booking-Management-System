 package com.projecthotel.khanhsky_hotel.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.projecthotel.khanhsky_hotel.dto.response.UserStatsDTO;
import com.projecthotel.khanhsky_hotel.dto.request.BookingRequest;
import com.projecthotel.khanhsky_hotel.dto.response.BookingResponse;
import com.projecthotel.khanhsky_hotel.dto.response.RoomResponseDTO;
import com.projecthotel.khanhsky_hotel.dto.response.UserStatsDTO;
import com.projecthotel.khanhsky_hotel.exception.InvalidBookingRequestException;
import com.projecthotel.khanhsky_hotel.exception.ResourceNotFoundException;
import com.projecthotel.khanhsky_hotel.model.BookedRoom;
import com.projecthotel.khanhsky_hotel.model.Room;
import com.projecthotel.khanhsky_hotel.model.ServiceType;
import com.projecthotel.khanhsky_hotel.repository.BookingRepository;
import com.projecthotel.khanhsky_hotel.service.bookingcost.BookingCharge;
import com.projecthotel.khanhsky_hotel.service.bookingcost.BookingChargeFactory;

import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class BookingService implements IBookingService {

    private final BookingRepository bookingRepository;
    private final IRoomService roomService;

    @Override
    public List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
        return bookingRepository.findByRoom_Id(roomId);
    }


    @Override
    public List<BookedRoom> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<BookedRoom> getBookingsByUserEmail(String email) {
        return bookingRepository.findByGuestEmail(email);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    @Override
    public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
        return bookingRepository.findByBookingConfirmationCode(confirmationCode)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }
    @Override
    public UserStatsDTO calculateUserStats(String email) {
    // Lấy dữ liệu từ Repo
    Object result = bookingRepository.getRawStatsByEmail(email);
    Object[] row = (Object[]) result;

    // Khởi tạo các giá trị mặc định để tránh lỗi Null
    long totalBookings = 0;
    BigDecimal totalSpent = BigDecimal.ZERO;
    long totalNights = 0;

    // Nếu có dữ liệu (hàng trả về không null và có ít nhất 1 cột không null)
    if (row != null && row.length > 0 && row[0] != null) {
        totalBookings = ((Number) row[0]).longValue();
        totalSpent = row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
        totalNights = row[2] != null ? ((Number) row[2]).longValue() : 0;
    }

    // Logic xếp hạng
    String rank = "Đồng";
    if (totalSpent.compareTo(new BigDecimal("10000000")) >= 0) rank = "Kim Cương";
    else if (totalSpent.compareTo(new BigDecimal("5000000")) >= 0) rank = "Vàng";
    else if (totalSpent.compareTo(new BigDecimal("2000000")) >= 0) rank = "Bạc";

    return UserStatsDTO.builder()
            .email(email)
            .totalBookings(totalBookings)
            .totalSpent(totalSpent)
            .totalNights(totalNights)
            .memberRank(rank)
            .loyaltyPoints(totalSpent.divide(new BigDecimal("1000"), 0, RoundingMode.DOWN).intValue())
            .build();
    }
    @Override
    public Map<String, Object> getGlobalStats() {
        List<BookedRoom> allBookings = bookingRepository.findAll();
        long totalBookings = allBookings.size();
        
        // Tính tổng doanh thu
        BigDecimal totalRevenue = allBookings.stream()
                .map(BookedRoom::getTotalAmount)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        // Đếm tổng số khách hàng duy nhất
        long totalCustomers = allBookings.stream()
                .map(BookedRoom::getGuestEmail)
                .distinct()
                .count();

        // Lấy tổng số phòng từ roomService
        long totalRooms = roomService.getAllRooms().size();

        return Map.of(
            "totalRevenue", totalRevenue,
            "totalBookings", totalBookings,
            "totalCustomers", totalCustomers,
            "totalRooms", totalRooms
        );
    }

    @Override
    public String saveBooking(Long roomId, BookingRequest bookingRequest) {
    // 1. Lấy room
    Room room = roomService.getRoomById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

    // 2. Map BookingRequest -> BookedRoom
    BookedRoom bookedRoom = new BookedRoom();
    bookedRoom.setRoom(room);
    bookedRoom.setGuestEmail(bookingRequest.getGuestEmail());
    bookedRoom.setGuestFullName(bookingRequest.getGuestFullName());
    bookedRoom.setCheckInDate(bookingRequest.getCheckInDate());
    bookedRoom.setCheckOutDate(bookingRequest.getCheckOutDate());
    bookedRoom.setTotalNumberOfGuest(bookingRequest.getTotalNumberOfGuest());

    // 3. Map selectedServices từ String -> Enum (xử lý null an toàn)
    Set<ServiceType> services =
            bookingRequest.getSelectedServices() != null
                    ? bookingRequest.getSelectedServices().stream()
                        .map(ServiceType::valueOf)
                        .collect(Collectors.toSet())
                    : Set.of();
    bookedRoom.setSelectedServices(services);

    // 4. Tính số đêm
    long nights = ChronoUnit.DAYS.between(
            bookedRoom.getCheckInDate(),
            bookedRoom.getCheckOutDate()
    );
    if (nights <= 0) {
        throw new InvalidBookingRequestException("Check-out date must be after check-in date");
    }

    // 5. DÙNG DECORATOR ĐỂ TÍNH TIỀN
    BookingCharge charge = BookingChargeFactory.build(
            room,
            nights,
            bookedRoom.getTotalNumberOfGuest(),
            services
    );
    // Decorator trả về BigDecimal
    bookedRoom.setTotalAmount(charge.cost());

    // 6. Tạo confirmation code
    bookedRoom.setBookingConfirmationCode(generateConfirmationCode());

    // 7. Kiểm tra phòng còn trống
    if (!roomIsAvailable(bookedRoom, room.getBookings())) {
        throw new InvalidBookingRequestException("Room not available for selected dates");
    }

    // 8. Thêm booking vào room và lưu
    room.addBooking(bookedRoom);
    bookingRepository.save(bookedRoom);

    // 9. Trả mã xác nhận cho controller
    return bookedRoom.getBookingConfirmationCode();
}

    // --- Mapping BookedRoom -> BookingResponse ---
    public BookingResponse mapToBookingResponse(BookedRoom bookedRoom) {
        if (bookedRoom == null) return null;

    BookingResponse res = new BookingResponse();

    // Gán từng field cho chắc, khỏi phụ thuộc constructor Lombok
    res.setId(bookedRoom.getBookingId());
    res.setCheckInDate(bookedRoom.getCheckInDate());
    res.setCheckOutDate(bookedRoom.getCheckOutDate());
    res.setGuestFullName(bookedRoom.getGuestFullName());
    res.setGuestEmail(bookedRoom.getGuestEmail());
    res.setTotalNumberOfGuest(bookedRoom.getTotalNumberOfGuest());
    res.setBookingConfirmationCode(bookedRoom.getBookingConfirmationCode());

    // Room -> RoomResponseDTO
    res.setRoom(mapRoomToDTO(bookedRoom.getRoom()));

    // selectedServices: Set<ServiceType> -> Set<String>
    Set<String> serviceNames =
            bookedRoom.getSelectedServices() != null
                    ? bookedRoom.getSelectedServices().stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet())
                    : Set.of();
    res.setSelectedServices(serviceNames);

    // totalAmount: tránh null
    BigDecimal total =
            bookedRoom.getTotalAmount() != null
                    ? bookedRoom.getTotalAmount()
                    : BigDecimal.ZERO;
    res.setTotalAmount(total);

    return res;
    }

    // --- Mapping Room -> RoomResponseDTO ---
    public RoomResponseDTO mapRoomToDTO(Room room) {
        String photoBase64 = null;
        RoomResponseDTO dto = new RoomResponseDTO();
        dto.setId(room.getId());
        dto.setRoomType(room.getRoomType());
        dto.setRoomPrice(
            room.getRoomPrice() != null ? room.getRoomPrice() : BigDecimal.ZERO
        );
        dto.setBooked(room.isBooked());
        dto.setPhoto(photoBase64);
        dto.setBookings(null);  // tránh vòng lặp
        return dto;
    }

    private boolean roomIsAvailable(BookedRoom req, List<BookedRoom> existing) {
        return existing.stream().noneMatch(b ->
            req.getCheckInDate().isBefore(b.getCheckOutDate()) &&
            req.getCheckOutDate().isAfter(b.getCheckInDate())
        );
    }

    private String generateConfirmationCode() {
        return String.valueOf(System.currentTimeMillis());
    }
    @Override
    @Transactional(rollbackFor = Exception.class)
    public BookingResponse createBooking(Long roomId, BookingRequest request) {

        // Save thật
        String code = saveBooking(roomId, request);

        // Lấy booking vừa lưu
        BookedRoom booked = findByBookingConfirmationCode(code);

        // Tính breakdown từ dữ liệu đã lưu
        long nights = ChronoUnit.DAYS.between(booked.getCheckInDate(), booked.getCheckOutDate());
        BookingCharge charge = BookingChargeFactory.build(
                booked.getRoom(),
                nights,
                booked.getTotalNumberOfGuest(),
                booked.getSelectedServices()
        );

        BookingResponse dto = mapToBookingResponse(booked);
        dto.setTotalAmount(charge.cost());       // totalAmount đã lưu rồi nhưng set lại cũng ok
        dto.setBreakdown(charge.breakdown());
        return dto;
}
    @Transactional(readOnly = true)
    public BookingResponse estimateBooking(Long roomId, BookingRequest bookingRequest) {

        // 1) Lấy room
        Room room = roomService.getRoomById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // 2) validate ngày + số đêm
        LocalDate checkIn = bookingRequest.getCheckInDate();
        LocalDate checkOut = bookingRequest.getCheckOutDate();

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (nights <= 0) {
            throw new InvalidBookingRequestException("Check-out date must be after check-in date");
        }

        // 3) Map selectedServices String -> Enum
        Set<ServiceType> services =
                bookingRequest.getSelectedServices() != null
                        ? bookingRequest.getSelectedServices().stream()
                            .map(ServiceType::valueOf)
                            .collect(Collectors.toSet())
                        : Set.of();

        // 4) Dựng BookedRoom "ảo" chỉ để check availability (không lưu)
        BookedRoom req = new BookedRoom();
        req.setRoom(room);
        req.setGuestEmail(bookingRequest.getGuestEmail());
        req.setGuestFullName(bookingRequest.getGuestFullName());
        req.setCheckInDate(checkIn);
        req.setCheckOutDate(checkOut);
        req.setTotalNumberOfGuest(bookingRequest.getTotalNumberOfGuest());
        req.setSelectedServices(services);

        // 5) Check phòng trống
        // Lưu ý: dùng query repo sẽ chắc hơn room.getBookings() (LAZY + stale)
        List<BookedRoom> existing = bookingRepository.findByRoom_Id(roomId);
        if (!roomIsAvailable(req, existing)) {
            throw new InvalidBookingRequestException("Room not available for selected dates");
        }

        // 6) Tính tiền bằng Decorator
        BookingCharge charge = BookingChargeFactory.build(
                room,
                nights,
                req.getTotalNumberOfGuest(),
                services
        );

        // 7) Build response preview
        BookingResponse dto = new BookingResponse();
        dto.setCheckInDate(checkIn);
        dto.setCheckOutDate(checkOut);
        dto.setGuestEmail(req.getGuestEmail());
        dto.setGuestFullName(req.getGuestFullName());
        dto.setTotalNumberOfGuest(req.getTotalNumberOfGuest());
        dto.setRoom(mapRoomToDTO(room));
        dto.setSelectedServices(
                services.stream().map(Enum::name).collect(Collectors.toSet())
        );
        dto.setTotalAmount(charge.cost());
        dto.setBreakdown(charge.breakdown());

        // Nếu muốn show mã preview thì generate (không lưu DB)
        dto.setBookingConfirmationCode("PREVIEW-" + System.currentTimeMillis());

        return dto;
    }
}
