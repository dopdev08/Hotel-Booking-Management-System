import React, { useState, useEffect } from 'react';
import './gallerys.css'; 
import Header from '../Header/header'; 
import Footer from '../footer/footer';
import { FaTimes, FaPlus } from 'react-icons/fa'; // Cài: npm install react-icons

// Import ảnh
import gallery1 from '../../../assets/gallery1.jpg';
import gallery2 from '../../../assets/haisan2.webp';
import gallery3 from '../../../assets/khachsan.jpg';
import gallery4 from '../../../assets/gallery4.jpg';
import gallery5 from '../../../assets/Noithat.jpg';
import gallery6 from '../../../assets/haisan.jpg';
import gallery7 from '../../../assets/gallery7.jpg';
import gallery8 from '../../../assets/gallery8.jpg';

const Gallery2 = ({ auth, onLogout }) => {
  const [filter, setFilter] = useState('all');
  const [selectedImg, setSelectedImg] = useState(null); // State cho Lightbox

  // Định nghĩa dữ liệu ảnh kèm thuộc tính size và category
  // size: 'normal', 'wide' (ngang), 'tall' (dọc), 'big' (to bự)
  const images = [
    { id: 1, src: gallery1, category: 'room', size: 'big' },
    { id: 2, src: gallery2, category: 'food', size: 'tall' },
    { id: 3, src: gallery3, category: 'exterior', size: 'normal' },
    { id: 4, src: gallery4, category: 'room', size: 'wide' },
    { id: 5, src: gallery5, category: 'exterior', size: 'normal' },
    { id: 6, src: gallery6, category: 'food', size: 'tall' },
    { id: 7, src: gallery7, category: 'room', size: 'wide' },
    { id: 8, src: gallery8, category: 'exterior', size: 'big' },
  ];

  // Lọc ảnh
  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter);

  // Scroll lên đầu trang khi vào
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header auth={auth} onLogout={onLogout} />

      {/* BANNER LUXURY */}
      <div className="gallery-luxury-banner">
        <div className="banner-text">
          <span>KHOẢNH KHẮC ĐÁNG NHỚ</span>
          <h2>THƯ VIỆN HÌNH ẢNH</h2>
          <div className="line-deco"></div>
        </div>
      </div>

      <div className="gallery-main-content">
        
        {/* THANH FILTER */}
        <div className="gallery-filter-bar">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >Tất Cả</button>
          <button 
            className={filter === 'room' ? 'active' : ''} 
            onClick={() => setFilter('room')}
          >Phòng Nghỉ</button>
          <button 
            className={filter === 'food' ? 'active' : ''} 
            onClick={() => setFilter('food')}
          >Ẩm Thực</button>
          <button 
            className={filter === 'exterior' ? 'active' : ''} 
            onClick={() => setFilter('exterior')}
          >Kiến Trúc</button>
        </div>

        {/* LƯỚI ẢNH MOSAIC */}
        <div className="gallery-mosaic-grid">
          {filteredImages.map((item) => (
            <div 
              key={item.id} 
              className={`mosaic-item ${item.size}`}
              onClick={() => setSelectedImg(item.src)} // Mở lightbox
            >
              <img src={item.src} alt="Gallery" />
              <div className="hover-overlay">
                <FaPlus className="plus-icon" />
                <span>Xem chi tiết</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL (Hiển thị khi click vào ảnh) */}
      {selectedImg && (
        <div className="lightbox-modal" onClick={() => setSelectedImg(null)}>
          <button className="close-btn" onClick={() => setSelectedImg(null)}>
            <FaTimes />
          </button>
          <img src={selectedImg} alt="Full Screen" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <Footer />
    </>
  );
};

export default Gallery2;