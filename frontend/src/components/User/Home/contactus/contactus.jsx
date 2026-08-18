import "./contactus.css";
import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from "react-icons/fa"; // Cài: npm install react-icons

const ContactUs = () => {
    const contactInfo = {
        address: "Av. Gustave Eiffel, 75007 Paris, France",
        phone: "+33 1 23 45 67 89",
        email: "booking@luxuryhotel.com",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615509614!3d48.85837007928757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1634567890123!5m2!1sen!2sfr"
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Cảm ơn quý khách! Yêu cầu đã được gửi.');
    };

    return (
        <section id="contact-split-section">
            <div className="contact-wrapper">
                
                {/* CỘT 1: THÔNG TIN & BẢN ĐỒ (Nền tối) */}
                <div className="info-panel">
                    <div className="info-content">
                        <span className="sub-title">KẾT NỐI VỚI CHÚNG TÔI</span>
                        <h2>Liên Hệ</h2>
                        <p className="intro-text">
                            Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn 24/7. Hãy để lại lời nhắn hoặc ghé thăm chúng tôi trực tiếp.
                        </p>

                        <div className="contact-details">
                            <div className="detail-item">
                                <div className="icon-box"><FaMapMarkerAlt /></div>
                                <div>
                                    <h4>Địa chỉ</h4>
                                    <p>{contactInfo.address}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="icon-box"><FaPhoneAlt /></div>
                                <div>
                                    <h4>Hotline</h4>
                                    <p>{contactInfo.phone}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="icon-box"><FaEnvelope /></div>
                                <div>
                                    <h4>Email</h4>
                                    <p>{contactInfo.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bản đồ nhỏ nằm gọn trong cột thông tin */}
                        <div className="mini-map-container">
                            <iframe 
                                src={contactInfo.mapEmbedUrl} 
                                title="Hotel Location"
                                allowFullScreen="" 
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* CỘT 2: FORM LIÊN HỆ (Nền sáng) */}
                <div className="form-panel">
                    <form onSubmit={handleSubmit} className="luxury-form">
                        <h3>Gửi tin nhắn</h3>
                        
                        <div className="input-group">
                            <input type="text" required placeholder=" " />
                            <label>Họ và Tên</label>
                        </div>

                        <div className="input-group">
                            <input type="email" required placeholder=" " />
                            <label>Địa chỉ Email</label>
                        </div>

                        <div className="input-group">
                            <input type="tel" required placeholder=" " />
                            <label>Số điện thoại</label>
                        </div>

                        <div className="input-group">
                            <textarea required rows="4" placeholder=" "></textarea>
                            <label>Lời nhắn của bạn</label>
                        </div>

                        <button type="submit" className="btn-send">
                            GỬI YÊU CẦU <FaPaperPlane />
                        </button>
                    </form>
                </div>

            </div>
        </section>
    );
};

export default ContactUs;