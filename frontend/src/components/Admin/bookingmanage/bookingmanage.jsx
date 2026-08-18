import React, { useEffect, useState, useCallback } from "react";
import Head from "../Head/Homebar.jsx";
import { getAuth, checkIsAdmin } from "../../../utils/auth.js";
import { FaSearch, FaTrash, FaCalendarAlt, FaFileInvoiceDollar, FaUser, FaSync, FaClock } from "react-icons/fa";
import "../Trangchu.css";
import "./bookingmanage.css"; 

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const auth = getAuth();
  const isAdmin = checkIsAdmin(auth);

  // ================= LOAD DATA =================
  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:9192/bookings/all-bookings", {
        headers: { "Authorization": auth?.token ? `Bearer ${auth.token}` : "" }
      });

      if (!res.ok) throw new Error("Lỗi tải dữ liệu");

      const data = await res.json();
      
      const formatted = data.map((b) => ({
        ...b,
        totalAmount: b.totalAmount ? Number(b.totalAmount) : 0,
        selectedServices: b.selectedServices || [],
      })).reverse(); 

      setBookings(formatted);
      setFilteredBookings(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  // ================= SEARCH & FILTER =================
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = bookings.filter(b => 
      (b.bookingConfirmationCode && b.bookingConfirmationCode.toLowerCase().includes(term)) ||
      (b.guestFullName && b.guestFullName.toLowerCase().includes(term)) ||
      (b.guestEmail && b.guestEmail.toLowerCase().includes(term))
    );
    setFilteredBookings(results);
  }, [searchTerm, bookings]);

  // ================= DELETE =================
  const handleCancelBooking = async (bookingId, code) => {
    if (!isAdmin) { alert("🚫 Cần quyền Admin!"); return; }
    if (!window.confirm(`Hủy đơn đặt phòng: ${code}?`)) return;

    try {
      const res = await fetch(`http://localhost:9192/bookings/booking/${bookingId}/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${auth.token}`, 
          "Content-Type": "application/json"
        },
      });

      if (res.ok) {
        alert("✅ Đã hủy thành công!");
        loadBookings();
      } else {
        alert("❌ Lỗi khi hủy đơn");
      }
    } catch (err) {
      alert("❌ Lỗi kết nối");
    }
  };

  const formatDate = (dateString) => {
    if(!dateString) return "N/A";
    const [y, m, d] = dateString.split("-");
    return `${d}/${m}/${y}`;
  }

  // Hàm xác định trạng thái đơn (Giả lập dựa trên ngày)
  const getStatus = (checkOutDate) => {
    const today = new Date().toISOString().split('T')[0];
    if (checkOutDate < today) return <span className="status-badge completed">Đã hoàn thành</span>;
    return <span className="status-badge active">Đang hoạt động</span>;
  };

  // ================= RENDER =================
  return (
    // CONTAINER TỔNG: Flexbox để chia cột
    <div className="admin-container">
      
      {/* CỘT 1: SIDEBAR (Cố định) */}
      <div className="admin-sidebar">
        <Head />
      </div>
      
      {/* CỘT 2: NỘI DUNG CHÍNH (Cuộn riêng) */}
      <main className="admin-content">
        <div className="booking-wrapper">
          
          {/* Header */}
          <div className="content-header">
            <div>
              <h1 className="page-title">Quản lý Đặt Phòng</h1>
              <p className="page-subtitle">Theo dõi trạng thái và lịch sử đặt phòng</p>
            </div>
            <button className="btn-refresh" onClick={loadBookings} disabled={isLoading}>
              <FaSync className={isLoading ? "spin" : ""} /> {isLoading ? "Đang tải..." : "Làm mới"}
            </button>
          </div>

          {/* Toolbar */}
          <div className="toolbar-section">
            <div className="search-box">
              <FaSearch className="icon" />
              <input 
                type="text" 
                placeholder="Tìm mã đơn, tên khách, email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="summary-badge">
              <strong>{filteredBookings.length}</strong> đơn đặt
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Mã & Trạng thái</th>
                  <th>Khách hàng</th>
                  <th>Chi tiết Phòng</th>
                  <th>Lịch trình</th>
                  <th>Thanh toán</th>
                  <th className="text-center">Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b.id}>
                      {/* Cột 1 */}
                      <td>
                        <div className="code-display">{b.bookingConfirmationCode}</div>
                        <div className="mt-2">{getStatus(b.checkOutDate)}</div>
                      </td>

                      {/* Cột 2 */}
                      <td>
                        <div className="client-info">
                          <div className="avatar-circle"><FaUser /></div>
                          <div>
                            <div className="client-name">{b.guestFullName}</div>
                            <div className="client-email">{b.guestEmail}</div>
                          </div>
                        </div>
                      </td>

                      {/* Cột 3 */}
                      <td>
                        <div className="room-id">Phòng: <strong>{b.room?.id || "N/A"}</strong></div>
                        <div className="service-note">
                          {b.selectedServices?.length > 0 
                            ? b.selectedServices.map(s => s.replace(/_/g, " ")).join(", ") 
                            : "Không có dịch vụ"}
                        </div>
                      </td>

                      {/* Cột 4 */}
                      <td>
                        <div className="time-row"><span className="label-in">In:</span> {formatDate(b.checkInDate)}</div>
                        <div className="time-row"><span className="label-out">Out:</span> {formatDate(b.checkOutDate)}</div>
                      </td>

                      {/* Cột 5 */}
                      <td>
                        <div className="total-price">
                          {b.totalAmount.toLocaleString("vi-VN")} ₫
                        </div>
                        <div className="payment-status"><FaFileInvoiceDollar/> Đã thanh toán</div>
                      </td>

                      {/* Cột 6 */}
                      <td className="text-center">
                        {isAdmin ? (
                          <button 
                            className="btn-delete"
                            title="Hủy đơn này"
                            onClick={() => handleCancelBooking(b.id, b.bookingConfirmationCode)}
                          >
                            <FaTrash />
                          </button>
                        ) : (
                          <span className="lock-icon">🔒</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <FaClock size={40} color="#cbd5e1"/>
                      <p>Không tìm thấy dữ liệu phù hợp</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}