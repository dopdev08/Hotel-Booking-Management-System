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

        {/* Nội dung mô tả mới */}
        <div className="modal-body">
          <p className="modal-heading">🌟 Chào Đón Quý Khách Tại Sảnh Tiếp Tân Sang Trọng Của Chúng Tôi 🏨</p>

          <p>
            Bước qua cánh cửa, quý khách sẽ lập tức được bao bọc bởi bầu không khí ấm cúng nhưng không kém phần tráng lệ tại sảnh tiếp đón của chúng tôi. Với thiết kế tinh tế, kết hợp hài hòa giữa nét kiến trúc hiện đại và các chi tiết trang trí cổ điển thanh lịch, đây không chỉ là nơi làm thủ tục nhận/trả phòng mà còn là không gian để quý khách bắt đầu hành trình thư giãn hoặc kết thúc một ngày làm việc hiệu quả.
          </p>

          <p>
            Ánh đèn dịu nhẹ, hương thơm thoang thoảng cùng tiếng nhạc du dương tạo nên một cảm giác thanh bình và thư thái. Đội ngũ tiếp tân chuyên nghiệp và thân thiện của chúng tôi luôn sẵn sàng chào đón quý khách bằng nụ cười rạng rỡ, cung cấp sự hỗ trợ chu đáo và nhanh chóng nhất. Hãy ngồi xuống chiếc sofa êm ái, nhâm nhi một chút đồ uống mát lạnh và cảm nhận sự chăm sóc đẳng cấp ngay từ những giây phút đầu tiên.
          </p>

          <p>
            Sảnh tiếp đón của chúng tôi không chỉ là lối vào, mà là lời chào mời chân thành đến một trải nghiệm lưu trú hoàn hảo.
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
