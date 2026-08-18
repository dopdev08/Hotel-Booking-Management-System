import React from 'react';

import "../pop.css";
const Modal = ({ isOpen, onClose, content }) => {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* Nút đóng */}
                

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

                {/* Nội dung mô tả — chuyển từ markdown sang HTML thủ công */}
                <div className="modal-body">

                    <p className="modal-heading">👑 Nơi Nghỉ Dưỡng Thượng Lưu</p>

                    <p>
                        Bước vào phòng, quý khách sẽ cảm nhận ngay sự giao thoa hoàn hảo
                        giữa nét cổ điển thanh lịch và tiện nghi hiện đại. 
                        <strong> Nội thất </strong>
                        được chế tác từ gỗ óc chó tự nhiên, kết hợp cùng các chi tiết mạ đồng tinh tế,
                        tạo nên không gian ấm cúng và sang trọng. Chiếc giường King-size phủ lớp
                        chăn ga gối đệm lụa Ai Cập cao cấp hứa hẹn mang lại giấc ngủ sâu và thư thái tuyệt đối.
                    </p>

                    <p>
                        <strong> Không gian </strong>
                        của phòng rộng rãi, được tối ưu hóa để tận dụng tối đa ánh sáng tự nhiên.
                        Mùi hương dịu nhẹ của tinh dầu hoa oải hương lan tỏa khắp phòng, 
                        cùng với hệ thống chiếu sáng thông minh điều chỉnh theo tâm trạng.
                    </p>

                    <p>
                        Đặc biệt, <strong> khung cảnh bên ngoài </strong> là điểm nhấn không thể quên.
                        Từ ban công riêng, quý khách có thể chiêm ngưỡng toàn cảnh biển xanh biếc.
                        Khung cửa sổ cao từ sàn đến trần tạo nên bức tranh sống động thay đổi theo ánh sáng.
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
