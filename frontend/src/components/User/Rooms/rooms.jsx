import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCalendarAlt, FaBed, FaSearch, FaRedo, FaWifi, FaTv, FaCoffee } from "react-icons/fa"; // Import Icon
import Header from "../Header/header.jsx";
import Footer from "../footer/footer.jsx";
import BookingForm from "./bookingroom.jsx";
import "./rooms.css"; // File CSS mới

export default function Rooms({ rooms, auth, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [displayRooms, setDisplayRooms] = useState([]);
  
  // State tìm kiếm
  const [roomType, setRoomType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    setDisplayRooms(rooms);
  }, [rooms]);

  // Xử lý khi redirect từ trang khác về kèm roomId
  useEffect(() => {
    const roomIdFromState = location.state?.roomId;
    if (roomIdFromState) {
      setSelectedRoomId(roomIdFromState);
      // Xóa state để tránh mở lại modal khi refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const selectedRoom = displayRooms.find((r) => r.id === selectedRoomId);

  const handleSearch = async () => {
    if (!checkIn || !checkOut) {
      alert("Vui lòng chọn ngày nhận và trả phòng!");
      return;
    }
    try {
      const params = new URLSearchParams({ checkIn, checkOut });
      if (roomType) params.append("roomType", roomType);
      
      const res = await fetch(`http://localhost:9192/rooms/search?${params.toString()}`);
      if (!res.ok) throw new Error("Lỗi tìm kiếm");
      
      const data = await res.json();
      setDisplayRooms(data);
    } catch (err) {
      console.error("Lỗi kết nối máy chủ", err);
      alert("Không thể tìm kiếm phòng lúc này.");
    }
  };

  const handleReset = () => {
    setCheckIn("");
    setCheckOut("");
    setRoomType("");
    setDisplayRooms(rooms);
  };

  return (
    <div className="page-wrapper">
      <Header auth={auth} onLogout={onLogout} />

      {/* --- 1. HERO BANNER --- */}
      <div className="room-hero">
        <div className="room-hero-overlay">
          <h1>Trải nghiệm kỳ nghỉ tuyệt vời</h1>
          <p>Khám phá các hạng phòng sang trọng & tiện nghi nhất</p>
        </div>
      </div>

      {/* --- 2. SEARCH BAR SECTION --- */}
      <div className="search-container">
        <div className="search-box-wrapper">
          <div className="search-group">
            <label><FaCalendarAlt /> Nhận phòng</label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div className="search-group">
            <label><FaCalendarAlt /> Trả phòng</label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
          <div className="search-group">
            <label><FaBed /> Loại phòng</label>
            <input 
              type="text" 
              placeholder="Ví dụ: Deluxe, Suite..." 
              value={roomType} 
              onChange={(e) => setRoomType(e.target.value)} 
            />
          </div>
          <div className="search-actions">
            <button className="btn-search" onClick={handleSearch} title="Tìm kiếm">
              <FaSearch /> Tìm
            </button>
            <button className="btn-reset" onClick={handleReset} title="Làm mới">
              <FaRedo />
            </button>
          </div>
        </div>
      </div>

      {/* --- 3. ROOM LIST SECTION --- */}
      <section className="room-list-section">
        <div className="container">
          {displayRooms.length > 0 ? (
            <div className="room-grid">
              {displayRooms.map((room) => (
                <div key={room.id} className="modern-room-card">
                  <div className="card-image-wrapper">
                    <img
                      src={room.photo ? `data:image/jpeg;base64,${room.photo}` : "/no-image.png"}
                      alt={room.roomType}
                    />
                    <span className="room-badge">Best Seller</span>
                  </div>
                  
                  <div className="card-content">
                    <div className="card-header">
                      <h3>{room.roomType}</h3>
                      <div className="room-amenities">
                        <FaWifi title="Free Wifi" /> <FaTv title="TV" /> <FaCoffee title="Breakfast" />
                      </div>
                    </div>
                    
                    <p className="room-description">
                      Phòng {room.roomType} thiết kế hiện đại, đầy đủ tiện nghi, view đẹp thoáng mát.
                    </p>

                    <div className="card-footer">
                      <div className="price-tag">
                        <span>{Number(room.roomPrice).toLocaleString()}</span>
                        <small> VND / đêm</small>
                      </div>
                      <button
                        className="btn-book-now"
                        onClick={() => {
                          if (!auth) {
                            navigate("/login", { state: { from: "/rooms", roomId: room.id } });
                            return;
                          }
                          setSelectedRoomId(room.id);
                        }}
                      >
                        {auth ? "Đặt Ngay" : "Đăng Nhập"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <img src="/no-result.png" alt="No rooms" style={{maxWidth: '150px', opacity: 0.6}} /> 
              {/* Bạn có thể thay bằng icon nếu không có ảnh */}
              <h3>Không tìm thấy phòng phù hợp</h3>
              <p>Vui lòng thử thay đổi ngày hoặc loại phòng khác.</p>
              <button onClick={handleReset}>Xem tất cả phòng</button>
            </div>
          )}
        </div>
      </section>

      {/* --- 4. MODAL POPUP --- */}
      {selectedRoomId && selectedRoom && (
        <BookingForm
          room={selectedRoom}
          auth={auth}
          onClose={() => setSelectedRoomId(null)}
          onBookingSuccess={() => setSelectedRoomId(null)}
        />
      )}

      <Footer />
    </div>
  );
}