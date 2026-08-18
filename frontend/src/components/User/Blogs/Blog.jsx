import Header from "../Header/header.jsx";
import Footer from "../footer/footer.jsx";
import "./Blog.css";
import React, { useState } from "react"; // Nhớ import useState
import { FaCalendarAlt, FaUser, FaArrowRight, FaTimes } from "react-icons/fa"; 

import img1 from "../../../assets/Noithat.jpg"; 
import img2 from "../../../assets/LE-GRENIER_13490-1.jpg";
import img3 from "../../../assets/khachsan.jpg";
import img4 from "../../../assets/message.jpg.webp";
import img5 from "../../../assets/event.jpg";
import img6 from "../../../assets/History.png";

export default function Blog({ auth, onLogout }) {
    // State quản lý bài viết đang đọc
    const [selectedPost, setSelectedPost] = useState(null);

    // Dữ liệu mẫu - ĐÃ THÊM PHẦN 'CONTENT' (Nội dung bài đọc)
    const blogPosts = [
        { 
            id: 1, 
            imageSrc: img1, 
            title: "Nghệ thuật bài trí phòng ngủ", 
            category: "NỘI THẤT", 
            date: "25 Oct, 2023", 
            description: "Khám phá cách chúng tôi lựa chọn từng món đồ nội thất để mang lại giấc ngủ trọn vẹn nhất.",
            // ĐÂY LÀ PHẦN BÀI ĐỌC CỦA BẠN
            content: `
                <p>Giấc ngủ là nền tảng của một kỳ nghỉ trọn vẹn. Tại Luxury Hotel, chúng tôi không chỉ đặt vào phòng một chiếc giường, chúng tôi kiến tạo một không gian nghệ thuật.</p>
                <h4>1. Ánh sáng và Màu sắc</h4>
                <p>Chúng tôi sử dụng gam màu trung tính kết hợp với ánh sáng vàng ấm (3000K) để kích thích sự thư giãn của não bộ ngay khi bạn bước vào phòng.</p>
                <h4>2. Chất liệu thượng hạng</h4>
                <p>Ga trải giường được làm từ 100% Cotton Ai Cập với mật độ sợi cao, mang lại cảm giác mềm mịn như lụa. Nệm được thiết kế riêng để nâng đỡ cột sống hoàn hảo.</p>
                <p>Hãy đến và cảm nhận sự khác biệt mà sự tinh tế mang lại.</p>
            `
        },
        { 
            id: 2, 
            imageSrc: img2, 
            title: "Tinh hoa ẩm thực Á - Âu", 
            category: "NHÀ HÀNG", 
            date: "02 Nov, 2023", 
            description: "Hành trình vị giác đầy cảm xúc với thực đơn được thiết kế bởi các đầu bếp 5 sao.",
            content: `
                <p>Nhà hàng của chúng tôi là nơi giao thoa của các nền văn hóa. Bạn có thể bắt đầu buổi sáng với Phở truyền thống Việt Nam và kết thúc buổi tối bằng món Bò Beefsteak chuẩn vị Pháp.</p>
                <p>Tất cả nguyên liệu đều được tuyển chọn tươi ngon mỗi ngày từ các trang trại organic địa phương và nhập khẩu trực tiếp từ Châu Âu.</p>
            `
        },
        // ... Các bài khác bạn có thể thêm content tương tự ...
        { id: 3, imageSrc: img3, title: "Ấn tượng đầu tiên tại sảnh", category: "KIẾN TRÚC", date: "15 Nov, 2023", description: "Không gian sảnh chờ là nơi bắt đầu của mọi câu chuyện.", content: "<p>Nội dung đang cập nhật...</p>" },
        { id: 4, imageSrc: img4, title: "Dịch vụ quản gia cao cấp", category: "DỊCH VỤ", date: "20 Nov, 2023", description: "Sự tận tâm trong từng chi tiết nhỏ.", content: "<p>Nội dung đang cập nhật...</p>" },
        { id: 5, imageSrc: img5, title: "Tổ chức sự kiện đẳng cấp", category: "SỰ KIỆN", date: "05 Dec, 2023", description: "Biến ý tưởng thành hiện thực.", content: "<p>Nội dung đang cập nhật...</p>" },
        { id: 6, imageSrc: img6, title: "Dấu ấn lịch sử 100 năm", category: "VĂN HÓA", date: "12 Dec, 2023", description: "Giá trị truyền thống được gìn giữ.", content: "<p>Nội dung đang cập nhật...</p>" }
    ];

    const featuredPost = blogPosts[0];
    const recentPosts = blogPosts.slice(1);

    // Hàm mở Modal
    const handleReadMore = (post) => {
        setSelectedPost(post);
        document.body.style.overflow = 'hidden'; // Khóa cuộn trang chính
    };

    // Hàm đóng Modal
    const handleCloseModal = () => {
        setSelectedPost(null);
        document.body.style.overflow = 'auto'; // Mở khóa cuộn
    };

    return (
        <div className="blog-page-wrapper">
            <Header auth={auth} onLogout={onLogout} />

            <div className="blog-main-header">
                <div className="header-overlay">
                    <span className="blog-subtitle">GÓC CHIA SẺ</span>
                    <h1>TIN TỨC & CÂU CHUYỆN</h1>
                    <div className="header-divider"></div>
                </div>
            </div>
                
            <div className="blog-content-container">
                {/* PHẦN FEATURED */}
                <section className="featured-section">
                    <div className="featured-card" onClick={() => handleReadMore(featuredPost)}>
                        <div className="featured-img">
                            <img src={featuredPost.imageSrc} alt={featuredPost.title} />
                            <div className="category-tag">{featuredPost.category}</div>
                        </div>
                        <div className="featured-info">
                            <div className="meta-info">
                                <span><FaCalendarAlt /> {featuredPost.date}</span>
                                <span><FaUser /> Admin</span>
                            </div>
                            <h2>{featuredPost.title}</h2>
                            <p>{featuredPost.description}</p>
                            <button className="btn-read-more">
                                Đọc tiếp <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </section>

                {/* PHẦN GRID */}
                <section className="recent-posts-section">
                    <h3 className="section-title">Bài Viết Gần Đây</h3>
                    <div className="posts-grid">
                        {recentPosts.map(post => (
                            <div key={post.id} className="post-card" onClick={() => handleReadMore(post)}>
                                <div className="card-thumb">
                                    <img src={post.imageSrc} alt={post.title} />
                                    <span className="post-cat">{post.category}</span>
                                </div>
                                <div className="card-body">
                                    <div className="card-meta">
                                        <FaCalendarAlt /> {post.date}
                                    </div>
                                    <h4>{post.title}</h4>
                                    <p>{post.description}</p>
                                    <span className="link-text">Xem chi tiết</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* --- MODAL HIỂN THỊ NỘI DUNG BÀI ĐỌC --- */}
            {selectedPost && (
                <div className="blog-modal-overlay" onClick={handleCloseModal}>
                    <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseModal}>
                            <FaTimes />
                        </button>
                        
                        <div className="modal-header-img">
                            <img src={selectedPost.imageSrc} alt={selectedPost.title} />
                        </div>
                        
                        <div className="modal-body">
                            <span className="modal-cat">{selectedPost.category}</span>
                            <h2>{selectedPost.title}</h2>
                            <div className="modal-meta">
                                <span>{selectedPost.date}</span> • <span>Đăng bởi Admin</span>
                            </div>
                            
                            <div className="modal-text-content">
                                {/* Hiển thị HTML nội dung */}
                                <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}