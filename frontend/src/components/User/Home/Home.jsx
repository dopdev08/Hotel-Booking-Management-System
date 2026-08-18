import React from 'react';
import Header from '../Header/header.jsx';
import Footer from '../footer/footer.jsx';

import Aboutus from './Aboutus/Aboutus.jsx';
import Carousel from './Carousel/carousel.jsx';
import Room from './Room/room.jsx';
import Gallery from './Gallery/gallery.jsx';
import Blogs from './Blogs/blogs.jsx';
import ContactUs from './contactus/contactus.jsx';

// Nhận props auth và onLogout từ App.jsx
export default function Home({ auth, onLogout }) {
    return (
        <div className="home-container">
            {/* Truyền props xuống Header để hiển thị đúng trạng thái Login/Admin */}
            <Header auth={auth} onLogout={onLogout} />

            <Carousel />

            <Aboutus />

            {/* Nếu component Room hoặc Blogs của bạn cũng cần biết thông tin user, 
                bạn có thể truyền auth xuống cho chúng tương tự */}
            <Room auth={auth} />

            <Gallery />

            <Blogs />

            <ContactUs />

            <Footer />
        </div>
    );
}