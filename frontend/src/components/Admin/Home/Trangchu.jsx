import React, { useEffect, useState } from "react";
import Head from "../Head/Homebar.jsx";
import { getAuth, checkIsAdmin } from "../../../utils/auth";
import { FaMoneyBillWave, FaCalendarCheck, FaBed, FaUserFriends, FaArrowUp, FaClock } from "react-icons/fa";
import "../Trangchu.css"; 
import "./welcome.css";
// import "./welcome.css"; // Có thể bỏ file này nếu gộp style vào Trangchu.css

export default function Trangchu() {
  const [adminStats, setAdminStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalRooms: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth(); 
  const isAdmin = checkIsAdmin(auth);

  useEffect(() => {
    if (!auth?.token || !isAdmin) {
      setLoading(false);
      return;
    }

    const fetchAdminDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:9192/bookings/admin/global-stats", {
          headers: {
            "Authorization": `Bearer ${auth.token}`,
            "Content-Type": "application/json"
          }
        });

        const text = await response.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }

        if (response.ok) {
          setAdminStats({
            totalRevenue: Number(data?.totalRevenue) || 0,
            totalBookings: Number(data?.totalBookings) || 0,
            totalRooms: Number(data?.totalRooms) || 0,
            totalCustomers: Number(data?.totalCustomers) || 0
          });
          setError(null);
        } else {
            throw new Error(data?.message || "Lỗi hệ thống");
        }
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboardData();
  }, [auth?.token, isAdmin]);

  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

  // --- Màn hình Loading ---
  if (loading) return (
    <div className="admin-layout">
      <Head />
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  // --- Màn hình từ chối truy cập ---
  if (!auth || !isAdmin) {
    return (
      <div className="admin-layout">
        <Head />
        <div className="page-content center-content">
           <div className="error-box">
              <h2>Truy cập bị từ chối</h2>
              <p>Vui lòng đăng nhập tài khoản Admin.</p>
              <button className="btn-primary" onClick={() => window.location.href = '/login'}>Đăng nhập</button>
           </div>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN DASHBOARD MỚI ---
  return (
    <div className="admin-layout">
      <Head /> {/* Sidebar nằm bên trái */}
      
      <main className="dashboard-content">
        {/* Header Section */}
        <header className="dashboard-header">
          <div>
            <h1 className="title">Tổng quan hệ thống</h1>
            <p className="subtitle">Chào mừng trở lại, <strong>{auth.email}</strong> 👋</p>
          </div>
          <div className="date-display">
             Hôm nay: {new Date().toLocaleDateString('vi-VN')}
          </div>
        </header>

        {error && <div className="alert-error">⚠️ {error}</div>}

        {/* Stats Grid Section */}
        <div className="stats-grid">
          {/* Card 1: Doanh thu */}
          <div className="stat-card">
            <div className="stat-icon-wrapper revenue">
              <FaMoneyBillWave />
            </div>
            <div className="stat-details">
              <span className="stat-label">Tổng doanh thu</span>
              <h3 className="stat-value">{formatVND(adminStats.totalRevenue)}</h3>
              <span className="stat-trend up"><FaArrowUp/> +12% so với tháng trước</span>
            </div>
          </div>

          {/* Card 2: Lượt đặt */}
          <div className="stat-card">
            <div className="stat-icon-wrapper bookings">
              <FaCalendarCheck />
            </div>
            <div className="stat-details">
              <span className="stat-label">Tổng lượt đặt</span>
              <h3 className="stat-value">{adminStats.totalBookings}</h3>
              <span className="stat-sub">Đơn đặt phòng thành công</span>
            </div>
          </div>

          {/* Card 3: Số phòng */}
          <div className="stat-card">
            <div className="stat-icon-wrapper rooms">
              <FaBed />
            </div>
            <div className="stat-details">
              <span className="stat-label">Phòng hiện có</span>
              <h3 className="stat-value">{adminStats.totalRooms}</h3>
              <span className="stat-sub">Đang hoạt động</span>
            </div>
          </div>

          {/* Card 4: Khách hàng */}
          <div className="stat-card">
            <div className="stat-icon-wrapper customers">
              <FaUserFriends />
            </div>
            <div className="stat-details">
              <span className="stat-label">Khách hàng</span>
              <h3 className="stat-value">{adminStats.totalCustomers}</h3>
              <span className="stat-sub">Đã đăng ký hệ thống</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Section (Placeholder để UI đỡ trống) */}
        <div className="recent-section">
            <div className="section-header">
                <h3><FaClock style={{marginRight: '8px'}}/> Hoạt động gần đây</h3>
                <button className="btn-link">Xem tất cả</button>
            </div>
            <div className="table-wrapper">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Trạng thái</th>
                            <th>Số tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Dữ liệu giả lập để demo UI */}
                        <tr>
                            <td>#BK-001</td>
                            <td>Nguyễn Văn A</td>
                            <td><span className="status success">Đã thanh toán</span></td>
                            <td>2.500.000 ₫</td>
                        </tr>
                        <tr>
                            <td>#BK-002</td>
                            <td>Trần Thị B</td>
                            <td><span className="status pending">Chờ duyệt</span></td>
                            <td>1.200.000 ₫</td>
                        </tr>
                        <tr>
                            <td>#BK-003</td>
                            <td>Lê Văn C</td>
                            <td><span className="status cancel">Đã hủy</span></td>
                            <td>0 ₫</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

      </main>
    </div>
  );
}