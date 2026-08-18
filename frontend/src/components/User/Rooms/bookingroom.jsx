import { useMemo, useState } from "react";
import "./bookingroom.css";
import { checkIsAdmin } from "../../../utils/auth";
import { FaCalendarAlt, FaUserFriends, FaPlane, FaBed, FaUtensils, FaStar, FaArrowLeft, FaCheckCircle, FaTimes } from "react-icons/fa";

// Service config với icon để hiển thị đẹp hơn
const SERVICE_CONFIG = [
  { name: "Đưa đón sân bay", value: "AIRPORT_PICKUP", icon: <FaPlane /> },
  { name: "Giường phụ", value: "EXTRA_BED", icon: <FaBed /> },
  { name: "Buffet sáng", value: "BREAKFAST", icon: <FaUtensils /> },
  { name: "Dịch vụ đặc biệt", value: "SEA_FOOD", icon: <FaStar /> },
];

export default function BookingForm({ room, auth, onClose, onBookingSuccess }) {
  // --- STATE QUẢN LÝ ---
  const [step, setStep] = useState(1); // 1: Nhập liệu, 2: Xác nhận
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalGuests, setTotalGuests] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);

  // --- LOGIC PHỤ TRỢ ---
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const isUserAdmin = checkIsAdmin(auth);
  const userEmail = auth?.email;

  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));

  const handleCheckInChange = (e) => {
    const selectedIn = e.target.value;
    setCheckInDate(selectedIn);
    if (checkOutDate && selectedIn >= checkOutDate) setCheckOutDate("");
    setEstimate(null); // Reset estimate khi đổi ngày
  };

  const toggleService = (value) => {
    setSelectedServices((prev) => 
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
    setEstimate(null);
  };

  // --- API CALLS ---
  const handleEstimate = async () => {
    if (isUserAdmin) return alert("Admin không được phép đặt phòng.");
    if (!auth?.token) return window.location.href = "/login";
    if (!checkInDate || !checkOutDate || totalGuests < 1) return alert("Vui lòng nhập đủ thông tin.");
    
    setLoading(true);
    try {
      const ESTIMATE_URL = `http://localhost:9192/bookings/room/${room.id}/estimate`;
      const res = await fetch(ESTIMATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${auth.token}` },
        body: JSON.stringify({
          guestEmail: userEmail,
          checkInDate,
          checkOutDate,
          totalNumberOfGuest: totalGuests,
          selectedServices,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Lỗi tính toán chi phí.");
      
      setEstimate(data);
      setStep(2); // Chuyển sang bước xác nhận
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const BOOK_URL = `http://localhost:9192/bookings/room/${room.id}/booking`;
      const res = await fetch(BOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${auth.token}` },
        body: JSON.stringify({
          checkInDate,
          checkOutDate,
          totalNumberOfGuest: totalGuests,
          selectedServices,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Đặt phòng thất bại.");

      alert(`✅ Đặt phòng thành công!\nMã vé: ${data.bookingConfirmationCode}`);
      onBookingSuccess?.();
      onClose?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-container">
        {/* Header Modal */}
        <div className="modal-header">
          {step === 2 && (
            <button className="btn-icon-back" onClick={() => setStep(1)} disabled={loading}>
              <FaArrowLeft />
            </button>
          )}
          <h3>{step === 1 ? "Thông tin đặt phòng" : "Xác nhận & Thanh toán"}</h3>
          <button className="btn-icon-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="modal-body">
          {/* Cảnh báo Admin */}
          {isUserAdmin && (
            <div className="alert-box error">
              ⚠️ Bạn đang dùng tài khoản <strong>Admin</strong>. Vui lòng đăng nhập tài khoản Khách hàng để đặt phòng.
            </div>
          )}

          {/* STEP 1: NHẬP LIỆU */}
          {step === 1 && (
            <div className="booking-step-1">
              <div className="room-summary-card">
                <img src={room.photo ? `data:image/jpeg;base64,${room.photo}` : "/placeholder-room.jpg"} alt="Room" className="room-thumb" />
                <div>
                  <h4>{room.roomType}</h4>
                  <p className="price-text">{formatVND(room.roomPrice)} <small>/ đêm</small></p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label><FaCalendarAlt /> Ngày nhận</label>
                  <input type="date" value={checkInDate} min={today} onChange={handleCheckInChange} disabled={isUserAdmin} />
                </div>
                <div className="form-group">
                  <label><FaCalendarAlt /> Ngày trả</label>
                  <input type="date" value={checkOutDate} min={checkInDate || today} onChange={e => setCheckOutDate(e.target.value)} disabled={isUserAdmin} />
                </div>
                <div className="form-group full-width">
                  <label><FaUserFriends /> Số khách</label>
                  <input type="number" min="1" value={totalGuests} onChange={e => setTotalGuests(Number(e.target.value))} disabled={isUserAdmin} />
                </div>
              </div>

              <div className="services-section">
                <label>Dịch vụ thêm:</label>
                <div className="service-grid">
                  {SERVICE_CONFIG.map((srv) => (
                    <div 
                      key={srv.value} 
                      className={`service-card ${selectedServices.includes(srv.value) ? "selected" : ""} ${isUserAdmin ? "disabled" : ""}`}
                      onClick={() => !isUserAdmin && toggleService(srv.value)}
                    >
                      <div className="srv-icon">{srv.icon}</div>
                      <span>{srv.name}</span>
                      {selectedServices.includes(srv.value) && <FaCheckCircle className="check-mark" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: XÁC NHẬN (PREVIEW) */}
          {step === 2 && estimate && (
            <div className="booking-step-2">
              <div className="invoice-box">
                <div className="invoice-header">
                  <h4>Chi tiết hóa đơn</h4>
                  <span className="badge-pending">Chờ xác nhận</span>
                </div>
                
                <div className="invoice-row">
                  <span>Khách hàng:</span>
                  <strong>{userEmail}</strong>
                </div>
                <div className="invoice-row">
                  <span>Thời gian:</span>
                  <span>{estimate.checkInDate} → {estimate.checkOutDate}</span>
                </div>
                
                <div className="invoice-divider"></div>

                {/* Breakdown List */}
                <div className="breakdown-list">
                  {estimate.breakdown?.map((item, idx) => (
                    <div key={idx} className="breakdown-item">
                      <div className="item-name">
                        {item.name} <small>x{item.quantity}</small>
                      </div>
                      <div className="item-price">{formatVND(item.amount)}</div>
                    </div>
                  ))}
                </div>

                <div className="invoice-divider"></div>
                
                <div className="invoice-total">
                  <span>Tổng cộng:</span>
                  <span className="total-amount">{formatVND(estimate.totalAmount)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="modal-footer">
          {step === 1 ? (
            <button 
              className="btn-primary full-width" 
              onClick={handleEstimate} 
              disabled={isUserAdmin || loading}
            >
              {loading ? "Đang tính toán..." : "Tiếp tục"}
            </button>
          ) : (
            <button 
              className="btn-success full-width" 
              onClick={handleBooking} 
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Xác nhận đặt phòng"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}