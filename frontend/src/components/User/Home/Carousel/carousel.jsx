import { useEffect, useState, useRef } from "react"; // Thêm useRef
import "./carousel.css";
// import "../../Header/header.css"; // Tạm ẩn nếu không dùng
import img1 from "../../../../assets/hotel.jpg";
import img2 from "../../../../assets/hotel1.jpg";
import img3 from "../../../../assets/Copy-of-Le317Bistro-07.202010091-HDR-1.jpg";


export default function Carousel() {
  const slides = [img1, img2, img3];
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null); // Dùng để lưu reference của timer

  // Hàm reset timer khi người dùng bấm nút thủ công
  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  // useEffect xử lý auto-play
  useEffect(() => {
    resetTimeout(); // Reset timer cũ trước khi tạo cái mới
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {
      resetTimeout(); // Dọn dẹp khi unmount
    };
  }, [index, slides.length]); // Chạy lại mỗi khi index thay đổi

  // Xử lý nút Next
  const handleNext = () => {
    setIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Xử lý nút Previous
  const handlePrev = () => {
    setIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    // Lớp vỏ tạo khung bên ngoài
    <div className="carousel-frame-wrapper">
      <div className="carousel-container">
        {/* Mũi tên trái */}
        <button className="carousel-arrow left-arrow" onClick={handlePrev}>
            {/* Icon SVG mũi tên trái */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </button>

        {/* Mũi tên phải */}
        <button className="carousel-arrow right-arrow" onClick={handleNext}>
             {/* Icon SVG mũi tên phải */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </button>

        <div
          className="carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((img, i) => (
            <div className="carousel-slide" key={i}>
              <img src={img} alt={`Slide ${i}`} />
            </div>
          ))}
        </div>

        <div className="carousel-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}