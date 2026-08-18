import React from 'react';

import "../pop.css";
const Modal = ({ isOpen, onClose, content }) => {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* Title */}
                <h2 className="modal-title">{content.title}</h2>

                {/* Optional Image */}
                {content.imageSrc && (
                    <img
                        src={content.imageSrc}
                        alt={content.title}
                        className="modal-image"
                    />
                )}

                {/* Nội dung mô tả MỚI — tập trung vào tiện ích và giải trí */}
                <div className="modal-body">

                    <p className="modal-heading">🏖️ Hơn Cả Nghỉ Dưỡng – Tận Hưởng Trọn Vẹn Cuộc Sống!</p>

                    <p>
                        **Khách sạn của chúng tôi** là một khu phức hợp giải trí và thư giãn đẳng cấp, 
                        đảm bảo mọi thành viên trong gia đình bạn đều tìm thấy hoạt động yêu thích của mình.
                    </p>

                    <p className="modal-heading">💧 Khu Vực Giải Trí & Thư Giãn</p>
                    
                    <ul>
                        <li>
                            <strong>Hồ Bơi Vô Cực:</strong> Trải nghiệm bơi lội với tầm nhìn bao quát.
                        </li>
                        <li>
                            <strong>Công Viên Nước Mini:</strong> Khu vực vui chơi an toàn và sôi động dành cho trẻ em.
                        </li>
                        <li>
                            <strong>Oasis Spa & Massage:</strong> Đắm mình trong không gian thư giãn tuyệt đối với các liệu pháp **massage độc quyền** giúp phục hồi sức khỏe.
                        </li>
                        <li>
                            <strong>Phòng Gym 24/7:</strong> Trang bị hiện đại, giúp duy trì thói quen tập luyện.
                        </li>
                    </ul>

                    <p className="modal-heading">🎯 Dịch Vụ Giải Trí & Trải Nghiệm</p>

                    <ul>
                        <li>
                            <strong>Kids' Club:</strong> Các hoạt động sáng tạo, lớp học thủ công và trò chơi có giám sát chuyên nghiệp.
                        </li>
                        <li>
                            <strong>Phòng Karaoke & Bar:</strong> Đêm sôi động với âm nhạc, đồ uống hảo hạng, hoàn hảo cho việc giao lưu.
                        </li>
                        <li>
                            <strong>Sân Thể Thao Đa Năng:</strong> Phục vụ các hoạt động như Tennis, bóng chuyền bãi biển hoặc Yoga buổi sáng.
                        </li>
                    </ul>
                    
                    <p>
                        Chúng tôi cam kết biến mọi khoảnh khắc tại đây thành những kỷ niệm đáng nhớ.
                        Đừng bỏ lỡ cơ hội khám phá trọn vẹn khu nghỉ dưỡng của chúng tôi!
                    </p>

                </div>
                <button className="modal-close-btn" onClick={onClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default Modal;