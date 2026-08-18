import "./Aboutus.css";
// import "../../Header/header.css"; // Tạm tắt nếu không cần thiết để tránh xung đột
import img1 from "../../../../assets/History.png";

export default function AboutUs() {
  return (
    <section className="about-luxury-section">
      <div className="container">
        
        {/* Khối hình ảnh nằm dưới */}
        <div className="about-image-wrapper">
            <img src={img1} alt="Khách sạn di sản" />
        </div>

        {/* Khối nội dung nằm đè lên ảnh */}
        <div className="about-content-card">
            <div className="decorative-line"></div>
            <h4 className="sub-heading">CÂU CHUYỆN CỦA CHÚNG TÔI</h4>
            <h2 className="main-heading">Di Sản & Sự Tinh Tế</h2>
            
            <p className="description">
                Khởi đầu từ một kiến trúc cổ điển đầy hoài niệm, khách sạn đã trải qua hành trình phát triển bền bỉ qua nhiều thập kỷ. Từ một điểm dừng chân khiêm tốn, nơi đây dần chuyển mình thành biểu tượng của sự sang trọng, chứng kiến bao thăng trầm của thời đại.
            </p>
            
            <p className="description">
                Dù đã qua nhiều lần trùng tu để đáp ứng tiêu chuẩn tiện nghi hiện đại, chúng tôi vẫn giữ trọn vẹn nét đẹp di sản cùng cam kết về lòng hiếu khách tận tâm.
            </p>

            <button className="btn-luxury">
                KHÁM PHÁ NGAY
            </button>
        </div>

      </div>
    </section>
  );
}