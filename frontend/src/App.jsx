import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// UTILS: Đảm bảo file auth.js đã sửa lỗi export AUTH_KEY
import { getAuth, logout as doLogout } from "./utils/auth";

/* ===== ADMIN COMPONENTS ===== */
import Admin from "./components/Admin/Home/Trangchu.jsx";
import ManageRoom from "./components/Admin/Manageroom/Quanlyphong.jsx";
import Bookingmanage from "./components/Admin/bookingmanage/bookingmanage.jsx";
import AdminRoute from "./components/Auth/AdminRoute";
import UserManage from "./components/Admin/UserManager/Usermanager.jsx";

/* ===== USER COMPONENTS ===== */
import Home from "./components/User/Home/Home.jsx";
import Blog from "./components/User/Blogs/Blog.jsx";
import Contactus from "./components/User/Contactus/contact.jsx";
import Login from "./components/User/Login/login.jsx";
import Signin from "./components/User/Sign-in/Sign-in.jsx";
import Gallery from "./components/User/Gallerys/gallerys.jsx";
import Rooms from "./components/User/Rooms/rooms.jsx";
import ServicePage from "./components/User/Services/services.jsx";
import Profile from "./components/User/Header/profile.jsx";

/* ===== MODAL COMPONENTS ===== */
import BedRoom from "./components/User/Blogs/information/bedroom/bedroom.jsx";
import Restaurant from "./components/User/Blogs/information/Restaurant/restaurant.jsx";
import HotelLobby from "./components/User/Blogs/information/HotelLobby/hotellobby.jsx";
import Services from "./components/User/Blogs/information/Service/service.jsx";
import Event from "./components/User/Blogs/information/Event/event.jsx";
import History from "./components/User/Blogs/information/History/History.jsx";

// Bản đồ ánh xạ Modal
const MODAL_COMPONENTS = {
  BedRoom,
  Restaurant,
  HotelLobby,
  Services,
  Events: Event,
  History,
};

function App() {
  /* ===== 1. AUTH STATE (QUẢN LÝ TẬP TRUNG) ===== */
  // Khi setAuth được gọi ở Login, toàn bộ App sẽ render lại
  const [auth, setAuth] = useState(() => getAuth());

  const handleLogout = () => {
    doLogout();
    setAuth(null); // Reset state về null để các Header cập nhật ngay
  };

  /* ===== 2. MODAL STATE ===== */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (data) => {
    setModalContent(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  /* ===== 3. ROOMS DATA STATE ===== */
  const [rooms, setRooms] = useState([]);

  const loadRooms = async () => {
    try {
      const res = await fetch("http://localhost:9192/rooms/all-rooms");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Lỗi load rooms:", error);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  /* ===== 4. DYNAMIC MODAL RENDERER ===== */
  const ActiveModal = modalContent ? MODAL_COMPONENTS[modalContent.type] : null;

  return (
    <BrowserRouter>
      <Routes>
        {/* ===== USER ROUTES ===== */}
        {/* Tất cả các trang User đều nhận auth và onLogout để truyền vào Header của chính nó */}
        <Route path="/" element={<Home auth={auth} onLogout={handleLogout} />} />
        <Route path="/blogs" element={<Blog auth={auth} onLogout={handleLogout} openModal={openModal} />} />
        <Route path="/contactus" element={<Contactus auth={auth} onLogout={handleLogout} />} />
        <Route path="/gallerys" element={<Gallery auth={auth} onLogout={handleLogout} />} />
        <Route path="/services" element={<ServicePage auth={auth} onLogout={handleLogout} />} />
        
        <Route
          path="/rooms"
          element={
            <Rooms 
              rooms={rooms} 
              auth={auth} 
              onLogout={handleLogout} 
              setAuth={setAuth} 
            />
          }
        />
        <Route path="/profile" element={<Profile auth={auth} onLogout={handleLogout}/>}/>
        {/* ===== AUTH ROUTES ===== */}
        {/* Nếu đã login (auth != null) thì không cho vào trang Login nữa */}
        <Route
          path="/login"
          element={auth ? <Navigate to="/" replace /> : <Login setAuth={setAuth} />}
        />
        <Route
          path="/register"
          element={auth ? <Navigate to="/" replace /> : <Signin />}
        />

        {/* ===== ADMIN ROUTES (PROTECTED) ===== */ }
        <Route element={<AdminRoute auth={auth} />}>
          <Route path="/trangchu" element={<Admin />} />
          <Route 
            path="/managerooms" 
            element={<ManageRoom rooms={rooms} setRooms={setRooms} reloadRooms={loadRooms} />} 
          />
          <Route path="/Bookingroom" element={<Bookingmanage />} />
          <Route path="/customers" element={<UserManage />} />
        </Route>

        {/* Điều hướng mặc định */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ===== MODAL PORTAL ===== */}
      {ActiveModal && (
        <ActiveModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          content={modalContent} 
        />
      )}
    </BrowserRouter>
  );
}

export default App;