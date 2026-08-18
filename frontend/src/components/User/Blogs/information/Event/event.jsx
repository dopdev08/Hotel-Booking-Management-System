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

                {/* Nội dung mô tả MỚI — tập trung vào sự kiện riêng do khách sạn tổ chức */}
                <div className="modal-body">

                    <p className="modal-heading">📅 Đặc Quyền Lưu Trú: Trải Nghiệm Sự Kiện Độc Quyền</p>

                    <p>
                        Tại **Khách sạn của chúng tôi**, kỳ nghỉ của bạn sẽ trở nên sống động hơn bao giờ hết.
                        Chúng tôi kiến tạo một lịch trình đầy ắp các **sự kiện và hoạt động độc đáo** được tổ chức hàng tuần, 
                        dành riêng cho khách lưu trú và cả những người yêu thích trải nghiệm đẳng cấp.
                    </p>

                    <p className="modal-heading">✨ Lịch Trình Sự Kiện Đời Sống Nổi Bật:</p>
                    
                    <ul>
                        <li>
                            <strong>🍷 Đêm Thử Rượu Vang & Cocktail:</strong> Tổ chức vào tối Thứ Sáu hàng tuần tại Sky Bar. Thưởng thức đồ uống hảo hạng dưới sự hướng dẫn của chuyên gia và âm nhạc Jazz.
                        </li>
                        <li>
                            <strong>🧘 Lớp Học Yoga & Thiền Buổi Sáng:</strong> Bắt đầu ngày mới tràn đầy năng lượng trên bãi cỏ xanh mát hoặc sân thượng với tầm nhìn tuyệt đẹp. Miễn phí cho khách lưu trú.
                        </li>
                        <li>
                            <strong>🧑‍🍳 Lớp Học Nấu Ăn Văn Hóa Địa Phương:</strong> Trải nghiệm ẩm thực đích thực, tự tay chế biến các món ăn đặc sản cùng Bếp trưởng.
                        </li>
                        <li>
                            <strong>🎶 Chương Trình Ca Nhạc Sống:</strong> Các đêm nhạc acoustic hoặc ban nhạc sôi động tại nhà hàng hoặc khu vực hồ bơi, tạo không khí giải trí lãng mạn.
                        </li>
                    </ul>

                    <p>
                        Tham gia các sự kiện riêng này là cách tuyệt vời để bạn **giao lưu, kết nối** và tận hưởng trọn vẹn đặc quyền lưu trú tại **Khách sạn của chúng tôi**.
                    </p>
                    
                    <p>
                        <strong>➡️ Kiểm tra Lịch Sự Kiện Hàng Tuần tại Quầy Lễ Tân để không bỏ lỡ hoạt động hấp dẫn nào!</strong>
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