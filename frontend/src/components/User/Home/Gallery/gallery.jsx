import "./gallery.css";
import React from 'react';

// Giữ nguyên các import ảnh của bạn
import img1 from "../../../../assets/tongquan.jpg";
import img2 from "../../../../assets/Copy-of-Deluxe-Twins.jpg";
import img3 from "../../../../assets/Copy-of-Le317Bistro-07.202010091-HDR-1.jpg";
import img4 from "../../../../assets/khachsan.jpg";
import img5 from "../../../../assets/Copy-of-Deluxe-Twins.jpg";
import img6 from "../../../../assets/Copy-of-Le317Bistro-07.202010091-HDR-1.jpg";
import img7 from "../../../../assets/phong1.jpg";
import img8 from "../../../../assets/Copy-of-Le317Bistro-07.202010091-HDR-1.jpg";

const Gallery = () => {
    const galleryImages = [
        { id: 1, src: img1, alt: "Phòng khách sang trọng" },
        { id: 2, src: img2, alt: "Deluxe Twin Red" },
        { id: 3, src: img3, alt: "City View Bistro" },
        { id: 4, src: img4, alt: "Phòng ngủ Double" },
        { id: 5, src: img5, alt: "Phòng ánh sáng tím" },
        { id: 6, src: img6, alt: "Black & White Suite" },
        { id: 7, src: img7, alt: "Sảnh chờ Guest" },
        { id: 8, src: img8, alt: "Góc thư giãn" }
    ];

    return (
        <section id="royal-gallery">
            <div className="gallery-title">
                <span className="ornament">❧</span>
                <h2>THƯ VIỆN ẢNH</h2>
                <span className="ornament">❧</span>
            </div>
            
            <div className="royal-grid">
                {galleryImages.map((image) => (
                    <div key={image.id} className="frame-container">
                        <div className="outer-frame">
                            <div className="inner-mat">
                                <img src={image.src} alt={image.alt} />
                            </div>
                            {/* Nhãn tên dán trên khung */}
                            <div className="frame-label">
                                {image.alt}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;