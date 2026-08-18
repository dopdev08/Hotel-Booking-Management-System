import React, { useEffect, useState } from "react";
import "./profile.css";
import Header from "../Header/header"; 
import Footer from "../footer/footer"; 
import { FaUser, FaHistory, FaSuitcase, FaEnvelope, FaPhoneAlt, FaCheckCircle, FaTimesCircle, FaClock, FaQrcode } from "react-icons/fa"; // Cài: npm install react-icons

export default function Profile({ auth, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userEmail = auth?.email;
  const token = auth?.token;

  useEffect(() => {
    if (userEmail && token) {
      fetchBookings();
    }
  }, [userEmail, token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Giả sử API của bạn hoạt động đúng, nếu không tôi sẽ dùng dữ liệu mẫu để demo giao diện
      const response = await fetch(`http://localhost:9192/bookings/user/${userEmail}/bookings`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Không thể tải lịch sử đặt phòng");
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
      // Dữ liệu mẫu để bạn test giao diện nếu API lỗi (Xóa khi chạy thật)
      /*
      setBookings([
        { id: 1, room: { roomType: "Deluxe Ocean View" }, bookingConfirmationCode: "BKG-8821", checkInDate: "2023-12-20", checkOutDate: "2023-12-25", totalNumberOfGuest: 2, totalAmount: 5000000, status: "Confirmed" },
        { id: 2, room: { roomType: "Premium Suite" }, bookingConfirmationCode: "BKG-9932", checkInDate: "2023-11-10", checkOutDate: "2023-11-12", totalNumberOfGuest: 4, totalAmount: 8500000, status: "Completed" }
      ]);
      */
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  // Hiển thị trạng thái badge
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("confirm") || s.includes("complet")) return <span className="status-badge success"><FaCheckCircle /> Đã xác nhận</span>;
    if (s.includes("cancel")) return <span className="status-badge cancel"><FaTimesCircle /> Đã hủy</span>;
    return <span className="status-badge pending"><FaClock /> Chờ xử lý</span>;
  };

  if (!auth) {
    return (
      <>
        <Header auth={auth} onLogout={onLogout} />
        <div className="profile-container-empty">
          <h2>Vui lòng đăng nhập</h2>
          <p>Bạn cần đăng nhập để xem hồ sơ thành viên.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <Header auth={auth} onLogout={onLogout} />

      {/* BANNER NỀN PROFILE */}
      <div className="profile-banner-bg"></div>

      <main className="dashboard-container">
        
        {/* CỘT TRÁI: THẺ THÀNH VIÊN (User Info) */}
        <aside className="user-sidebar">
            <div className="user-card">
                <div className="avatar-circle">
                    <FaUser />
                </div>
                <h3 className="user-name">Thành Viên Thân Thiết</h3>
                <p className="user-email">{userEmail}</p>
                
                <div className="user-stats">
                    <div className="stat-item">
                        <span>Hạng</span>
                        <strong>Gold</strong>
                    </div>
                    <div className="stat-item">
                        <span>Điểm</span>
                        <strong>1,250</strong>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="contact-info">
                    <div className="info-row"><FaEnvelope /> {userEmail}</div>
                    <div className="info-row"><FaPhoneAlt /> Chưa cập nhật</div>
                </div>
            </div>
        </aside>

        {/* CỘT PHẢI: LỊCH SỬ BOOKING (Ticket Style) */}
        <section className="booking-content">
            <div className="section-title">
                <FaHistory /> 
                <h2>Lịch sử chuyến đi</h2>
            </div>

            {loading && <div className="loading-spinner">Đang tải dữ liệu...</div>}
            
            {!loading && bookings.length === 0 && (
                 <div className="no-bookings-state">
                    <FaSuitcase className="empty-icon" />
                    <p>Bạn chưa có chuyến đi nào.</p>
                    <button className="btn-book-now">Đặt phòng ngay</button>
                 </div>
            )}

            <div className="ticket-list">
                {bookings.map((booking, index) => (
                    <div key={booking.id || index} className="booking-ticket">
                        {/* Phần Trái: Thông tin chính */}
                        <div className="ticket-left">
                            <div className="ticket-header">
                                <span className="ticket-label">BOOKING ID</span>
                                <span className="ticket-code">#{booking.bookingConfirmationCode}</span>
                            </div>
                            
                            <h3 className="room-name">{booking.room?.roomType || "Luxury Room"}</h3>
                            
                            <div className="ticket-dates">
                                <div className="date-group">
                                    <label>Check-in</label>
                                    <strong>{booking.checkInDate}</strong>
                                </div>
                                <div className="arrow">➝</div>
                                <div className="date-group">
                                    <label>Check-out</label>
                                    <strong>{booking.checkOutDate}</strong>
                                </div>
                            </div>

                            <div className="ticket-footer">
                                <span className="guest-info">{booking.totalNumberOfGuest} Khách</span>
                                {getStatusBadge(booking.status)}
                            </div>
                        </div>

                        {/* Đường cắt vé */}
                        <div className="ticket-divider">
                            <div className="notch-top"></div>
                            <div className="dashed-line"></div>
                            <div className="notch-bottom"></div>
                        </div>

                        {/* Phần Phải: Giá & QR */}
                        <div className="ticket-right">
                            <div className="qr-fake">
                                <FaQrcode />
                            </div>
                            <div className="price-tag">
                                <label>Tổng cộng</label>
                                <strong>{formatVND(booking.totalAmount || 0)}</strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}