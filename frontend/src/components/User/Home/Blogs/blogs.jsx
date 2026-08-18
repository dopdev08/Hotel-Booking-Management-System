import "./blogs.css";
import React from 'react';
import { FaArrowRight } from "react-icons/fa"; // Cài: npm install react-icons

// Import ảnh
import img1 from "../../../../assets/Noithat.jpg"; 
import img2 from "../../../../assets/LE-GRENIER_13490-1.jpg";
import img3 from "../../../../assets/khachsan.jpg";

const Blogs = () => {
    const blogPosts = [
        { 
            id: 1, 
            imageSrc: img1, 
            date: "12 THG 10",
            category: "TIỆN ÍCH",
            title: "Trải nghiệm phòng nghỉ đẳng cấp Hoàng Gia", 
            description: "Khám phá không gian nội thất sang trọng với những tiện nghi bậc nhất, mang lại giấc ngủ trọn vẹn."
        },
        { 
            id: 2, 
            imageSrc: img2, 
            date: "05 THG 11",
            category: "ẨM THỰC",
            title: "Hương vị Á - Âu tại nhà hàng 5 sao", 
            description: "Thưởng thức tinh hoa ẩm thực được chế biến bởi những đầu bếp hàng đầu trong không gian lãng mạn." 
        },
        { 
            id: 3, 
            imageSrc: img3, 
            date: "20 THG 11",
            category: "KIẾN TRÚC",
            title: "Sảnh đường - Nơi cảm xúc thăng hoa", 
            description: "Sự kết hợp hoàn hảo giữa ánh sáng, kiến trúc và nghệ thuật sắp đặt ngay từ bước chân đầu tiên." 
        },
    ];

    return (
        <section className="journal-section">
            <div className="journal-header">
                <span className="sub-heading">TIN TỨC & SỰ KIỆN</span>
                <h2>NHẬT KÝ HÀNH TRÌNH</h2>
                <div className="header-line"></div>
            </div>

            <div className="journal-container">
                {blogPosts.map(post => (
                    <div key={post.id} className="journal-card">
                        
                        {/* Phần Ảnh có chứa Date Badge */}
                        <div className="journal-image-wrapper">
                            <img src={post.imageSrc} alt={post.title} />
                            <div className="date-badge">
                                {post.date}
                            </div>
                        </div>
                        
                        {/* Phần Nội dung */}
                        <div className="journal-content">
                            <span className="journal-category">{post.category}</span>
                            <h3 className="journal-title">{post.title}</h3>
                            <p className="journal-desc">{post.description}</p>
                            
                            <button className="read-more-btn">
                                Xem chi tiết <FaArrowRight className="arrow-icon" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Blogs;