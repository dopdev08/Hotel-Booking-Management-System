import React from 'react';
import './contact.css'; 
import Header from '../Header/header.jsx';
import Footer from '../footer/footer.jsx';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const ContactUs2 = ({ auth, onLogout }) => {
  return (
    <div className="contact-page-root">
      <div className="header-wrapper">
         <Header auth={auth} onLogout={onLogout} />
      </div>

      <div className="contact-hero-section">
        <div className="hero-overlay"></div>
        
        <div className="contact-content-wrapper">
            
            {/* THÔNG TIN LIÊN HỆ (Giữ nguyên) */}
            <div className="contact-intro">
                <span className="sub-title">HỖ TRỢ 24/7</span>
                <h1>LIÊN HỆ VỚI CHÚNG TÔI</h1>
                <p>Mọi thắc mắc của quý khách sẽ được giải đáp trong thời gian sớm nhất.</p>
                
                <div className="info-grid">
                    <div className="info-box">
                        <FaMapMarkerAlt className="icon" />
                        <div>
                            <h4>Địa chỉ</h4>
                            <p>Tầng 72, Landmark Tower</p>
                        </div>
                    </div>
                    <div className="info-box">
                        <FaPhoneAlt className="icon" />
                        <div>
                            <h4>Hotline</h4>
                            <p>+84 90 123 4567</p>
                        </div>
                    </div>
                    <div className="info-box">
                        <FaEnvelope className="icon" />
                        <div>
                            <h4>Email</h4>
                            <p>support@luxuryhotel.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FORM ĐƯỢC LÀM RÕ HƠN (Solid Card) */}
            <div className="contact-form-card">
                <h3>Gửi tin nhắn</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="input-row">
                        <div className="input-group">
                            <input type="text" required placeholder=" " />
                            <label>Tên của bạn</label>
                        </div>
                        <div className="input-group">
                            <input type="text" required placeholder=" " />
                            <label>Số điện thoại</label>
                        </div>
                    </div>

                    <div className="input-group">
                        <input type="email" required placeholder=" " />
                        <label>Email liên hệ</label>
                    </div>

                    <div className="input-group">
                        <textarea rows="4" required placeholder=" "></textarea>
                        <label>Lời nhắn...</label>
                    </div>
                    
                    <button type="submit" className="btn-gold-send">
                        GỬI YÊU CẦU <FaPaperPlane />
                    </button>
                </form>
            </div>
        </div>
      </div>

      {/* BẢN ĐỒ ĐƯỢC ĐÓNG KHUNG */}
      <section className="map-section-framed">
        <div className="map-container">
            <div className="map-frame">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.992224151322!2d2.292209715783321!3d48.85825367928734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x87d165c71d87f71e!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1677840000000!5m2!1sen!2sfr" 
                    allowFullScreen="" 
                    loading="lazy"
                    title="Hotel Location"
                ></iframe>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs2;