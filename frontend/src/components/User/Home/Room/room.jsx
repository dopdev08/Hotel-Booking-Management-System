import "./room.css";
// import "../../Header/header.css"; // Tạm ẩn để tránh lỗi nếu chưa có file
import { useNavigate } from "react-router-dom"; 
import React from 'react';
import { FaBed, FaUserFriends, FaRulerCombined, FaArrowRight } from "react-icons/fa"; // Cài: npm install react-icons

// Import ảnh cũ của bạn
import img1 from "../../../../assets/tongquan.jpg";
import img2 from "../../../../assets/Copy-of-Deluxe-Twins.jpg";
import img3 from "../../../../assets/Copy-of-Le317Bistro-07.202010091-HDR-1.jpg";

const roomsData = [
  { img: img1, title: "Deluxe Single", price: "1.500.000₫", size: "30m²", guest: "2 NL, 1 TE" },
  { img: img2, title: "Premium Double", price: "2.200.000₫", size: "45m²", guest: "2 NL, 2 TE" },
  { img: img3, title: "Royal Suite", price: "5.000.000₫", size: "80m²", guest: "4 NL, 2 TE" },
  { img: img1, title: "Family Studio", price: "3.100.000₫", size: "60m²", guest: "4 NL, 2 TE" },
  { img: img2, title: "Executive King", price: "2.800.000₫", size: "50m²", guest: "2 NL" },
  { img: img3, title: "President Room", price: "9.000.000₫", size: "120m²", guest: "VIP" }
];

export default function Room({ auth }) {
  const navigate = useNavigate(); 

  const handleBooking = (roomTitle) => {
    if (!auth) {
      navigate("/login", { state: { from: "/rooms" } });
    } else {
      navigate("/rooms");
    }
  };

  return (
    <section className="rooms-luxury-section">
      <div className="container">
        
        <div className="section-header">
            <span className="subtitle">LỰA CHỌN CỦA BẠN</span>
            <h2>HẠNG PHÒNG & SUITES</h2>
            <div className="separator">✻</div>
        </div>

        <div className="room-grid-layout">
          {roomsData.map((room, index) => (
            <div className="room-item-card" key={index}>
              
              {/* Phần Ảnh & Tag Giá */}
              <div className="room-img-wrapper">
                <img src={room.img} alt={room.title} />
                <div className="price-tag">
                    <span className="amount">{room.price}</span>
                    <span className="unit">/ đêm</span>
                </div>
              </div>

              {/* Phần Nội dung */}
              <div className="room-info-body">
                <h3 className="room-name">{room.title}</h3>
                
                {/* Các thông số tiện ích (Icon) */}
                <div className="room-features">
                    <div className="feature-item">
                        <FaRulerCombined /> <span>{room.size}</span>
                    </div>
                    <div className="feature-item">
                        <FaUserFriends /> <span>{room.guest}</span>
                    </div>
                    <div className="feature-item">
                        <FaBed /> <span>King Bed</span>
                    </div>
                </div>

                <p className="room-desc">Tầm nhìn hướng phố, bồn tắm nằm, miễn phí bữa sáng và trà chiều.</p>
                
                <div className="card-divider"></div>

                <button 
                  className="btn-book-room" 
                  onClick={() => handleBooking(room.title)}
                >
                  ĐẶT PHÒNG NGAY <FaArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}