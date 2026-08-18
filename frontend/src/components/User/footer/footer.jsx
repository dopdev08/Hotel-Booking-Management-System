import React from "react";
import { Link } from "react-router-dom"; 
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaPaperPlane } from "react-icons/fa"; 
import "./footer.css";
// import logo from "../../assets/Logo.png"; // Bỏ comment nếu muốn dùng ảnh logo

const Footer = () => {

    const contactItems = [
        { Icon: FaMapMarkerAlt, text: "Av. Gustave Eiffel, Paris" },
        { Icon: FaPhone, text: "+01 123 456 789" },
        { Icon: FaEnvelope, text: "booking@luxuryhotel.com" },
    ];

    const menuLinks = [
        { name: "Trang chủ", href: "/" },
        { name: "Dịch vụ", href: "/services" },
        { name: "Phòng nghỉ", href: "/rooms" },
        { name: "Thư viện ảnh", href: "/gallerys" },
        { name: "Tin tức", href: "/blogs" },
        { name: "Liên hệ", href: "/contactus" },
    ];

    const socialIcons = [
        { Icon: FaFacebookF, href: "https://facebook.com" }, 
        { Icon: FaTwitter, href: "https://twitter.com" },
        { Icon: FaLinkedinIn, href: "https://linkedin.com" },
        { Icon: FaYoutube, href: "https://youtube.com" },
    ];

    return (
        <footer className="luxury-footer">
            <div className="footer-content">
                
                {/* CỘT 1: GIỚI THIỆU THƯƠNG HIỆU */}
                <div className="footer-column brand-column">
                    <h2 className="footer-logo">LUXURY<span>HOTEL</span></h2>
                    <p className="brand-desc">
                        Trải nghiệm kỳ nghỉ đẳng cấp thượng lưu với kiến trúc độc đáo và dịch vụ tận tâm. Nơi cảm xúc thăng hoa trong từng khoảnh khắc.
                    </p>
                    <div className="social-icons">
                        {socialIcons.map((icon, index) => (
                            <a key={index} href={icon.href} target="_blank" rel="noopener noreferrer">
                                <icon.Icon />
                            </a>
                        ))}
                    </div>
                </div>

                {/* CỘT 2: LIÊN KẾT NHANH */}
                <div className="footer-column links-column">
                    <h3>Khám Phá</h3>
                    <ul className="footer-links">
                        {menuLinks.map((link, index) => (
                            <li key={index}>
                                <Link to={link.href}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CỘT 3: LIÊN HỆ */}
                <div className="footer-column contact-column">
                    <h3>Liên Hệ</h3>
                    <div className="contact-list">
                        {contactItems.map((item, index) => (
                            <div key={index} className="contact-row">
                                <div className="icon-wrapper">
                                    <item.Icon />
                                </div>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CỘT 4: BẢN TIN (NEWSLETTER) */}
                <div className="footer-column newsletter-column">
                    <h3>Bản Tin</h3>
                    <p>Đăng ký để nhận ưu đãi độc quyền và tin tức mới nhất.</p>
                    <form className="newsletter-form">
                        <div className="input-wrap">
                            <input type="email" placeholder="Email của bạn..." required />
                            <button type="submit"><FaPaperPlane /></button>
                        </div>
                    </form>
                </div>

            </div>

            {/* DÒNG BẢN QUYỀN CUỐI CÙNG */}
            <div className="footer-bottom">
                <p>&copy; 2024 Luxury Hotel. All Rights Reserved.</p>
                <div className="footer-bottom-links">
                    <Link to="#">Điều khoản</Link>
                    <Link to="#">Bảo mật</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;