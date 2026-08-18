import React, { useEffect } from 'react';
import Header from '../Header/header.jsx';
import Footer from '../footer/footer';
import './services.css';
import { FaArrowRight } from "react-icons/fa"; // Cài: npm install react-icons

// Import hình ảnh
import poolImg from '../../../assets/infinitypool.jpg';
import massageImg from '../../../assets/massage.jpg';
import kidimg from '../../../assets/kids.jpg';
import gymImg from '../../../assets/gym.jpg';
import waterParkImg from '../../../assets/congviennuoc.jpg'; 
import santhethao from '../../../assets/santhethao.jpg';
import barimg from '../../../assets/bar.jpg';

const ServicePage = ({ auth, onLogout }) => {
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Gộp tất cả dịch vụ vào một mảng để dễ render kiểu zig-zag
  // Thêm field "category" để hiển thị
  const allServices = [
    {
      id: 1,
      category: "Thư Giãn",
      title: "Hồ Bơi Vô Cực",
      desc: "Thả mình vào làn nước trong xanh giữa tầng không, ngắm nhìn toàn cảnh thành phố và tận hưởng ly cocktail mát lạnh.",
      img: poolImg
    },
    {
      id: 2,
      category: "Sức Khỏe",
      title: "Oasis Spa & Massage",
      desc: "Đánh thức mọi giác quan với liệu trình massage thảo mộc độc quyền. Không gian tĩnh lặng giúp bạn tìm lại sự cân bằng.",
      img: massageImg
    },
    {
      id: 3,
      category: "Giải Trí",
      title: "Công Viên Nước Mini",
      desc: "Thiên đường vui nhộn dành cho các bé với hệ thống trượt nước an toàn và bể vầy sôi động.",
      img: waterParkImg
    },
    {
      id: 4,
      category: "Thể Thao",
      title: "Gym & Fitness 24/7",
      desc: "Duy trì vóc dáng ngay cả khi đi nghỉ dưỡng với hệ thống máy tập Technogym hiện đại nhất.",
      img: gymImg
    },
    {
      id: 5,
      category: "Ẩm Thực & Bar",
      title: "Sky Bar & Karaoke",
      desc: "Nơi âm nhạc và ánh sáng hòa quyện. Thưởng thức các loại rượu vang thượng hạng trong không gian đẳng cấp.",
      img: barimg
    },
    {
      id: 6,
      category: "Gia Đình",
      title: "Kids' Club Sáng Tạo",
      desc: "Không gian vừa học vừa chơi cho trẻ, bao gồm lớp học làm gốm, vẽ tranh và các trò chơi trí tuệ.",
      img: kidimg
    }
  ];

  return (
    <div className="services-luxury-wrapper">
      <Header auth={auth} onLogout={onLogout} />

      {/* Banner mới: Đơn giản và sang trọng */}
      <div className="luxury-banner">
        <div className="banner-content">
          <span className="sub-heading">TRẢI NGHIỆM ĐỈNH CAO</span>
          <h1>DỊCH VỤ & TIỆN ÍCH</h1>
          <div className="banner-divider"></div>
        </div>
      </div>

      <main className="luxury-container">
        <div className="intro-text">
            <p>
                Tại Luxury Hotel, chúng tôi không chỉ cung cấp chỗ nghỉ, chúng tôi kiến tạo những trải nghiệm. 
                Từ thư giãn sâu lắng đến giải trí sôi động, mọi tiện ích đều được chăm chút tỉ mỉ.
            </p>
        </div>

        {/* Render danh sách theo kiểu Zig-Zag */}
        <div className="service-list">
            {allServices.map((item, index) => (
                <div key={item.id} className={`service-row ${index % 2 !== 0 ? 'reverse' : ''}`}>
                    
                    {/* Phần ẢNH */}
                    <div className="service-img-col">
                        <div className="img-frame">
                            <img src={item.img} alt={item.title} />
                        </div>
                    </div>

                    {/* Phần NỘI DUNG */}
                    <div className="service-text-col">
                        <span className="service-number">0{index + 1}</span>
                        <span className="service-cat">{item.category}</span>
                        <h3>{item.title}</h3>
                        <p>{item.desc}</p>
                        <button className="btn-explore">
                            KHÁM PHÁ THÊM <FaArrowRight />
                        </button>
                    </div>

                </div>
            ))}
        </div>

        {/* Closing Section */}
        <section className="service-cta">
             <h2>Sẵn sàng cho kỳ nghỉ trong mơ?</h2>
             <button className="btn-book-now">ĐẶT PHÒNG NGAY</button>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ServicePage;