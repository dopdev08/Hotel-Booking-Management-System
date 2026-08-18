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

                {/* Nội dung mô tả MỚI — tập trung vào lịch sử và kiến trúc Á - Âu */}
                <div className="modal-body">

                    <p className="modal-heading">🏛️ Di Sản Tuyệt Tác: Nơi Hội Tụ Nét Đẹp Á – Âu</p>

                    <p>
                        Mỗi góc nhỏ tại **Khách sạn của chúng tôi** đều ẩn chứa một câu chuyện, một linh hồn độc đáo. 
                        Chúng tôi là một **biểu tượng kiến trúc giao thoa**, nơi Đông và Tây gặp gỡ trong sự hòa quyện hoàn hảo.
                    </p>

                    <p className="modal-heading">📜 Tinh Hoa Kiến Trúc: Độc Đáo và Thanh Lịch</p>
                    
                    <p>
                        Khách sạn được xây dựng với tầm nhìn tạo nên một kiệt tác kiến trúc, thể hiện sự sang trọng của Châu Âu kết hợp với sự ấm áp, tinh tế của Châu Á qua **phong cách Đông Dương (Indochine)**:
                    </p>
                    
                    <ul>
                        <li>
                            <strong>Sự Kết Hợp Hoàn Hảo:</strong> Sự vững chắc, tráng lệ của <strong>kiến trúc cổ điển Châu Âu</strong> được bổ sung bằng các vật liệu tự nhiên, ấm cúng của Châu Á như **gỗ, tre và gốm sứ**.
                        </li>
                        <li>
                            <strong>Bảo tồn Tinh Tế:</strong> Các chi tiết nguyên bản như **sàn gỗ được chạm khắc tinh xảo** và **cầu thang đá cẩm thạch tráng lệ** vẫn được chăm chút cẩn thận, mang lại cảm giác hoài cổ và thanh lịch vượt thời gian.
                        </li>
                    </ul>

                    <p>
                        Khi bạn chọn **Khách sạn của chúng tôi**, bạn không chỉ đặt một phòng nghỉ; bạn đang bước vào một không gian sống, nơi sự sang trọng hiện đại được neo giữ bởi những câu chuyện vĩnh cửu của quá khứ Á – Âu.
                    </p>

                    <p>
                        <strong>✨ Hãy ghé thăm và chiêm ngưỡng sự giao thoa kiến trúc tuyệt vời này. ✨</strong>
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