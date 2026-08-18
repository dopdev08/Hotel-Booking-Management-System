import React, { useState, useRef } from "react"; // Thêm useRef nếu bạn dùng cách fix dropdown ở câu trước
import "./header.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/Logo.png";
import { checkIsAdmin } from "../../../utils/auth";

// ... (Giữ nguyên các import Icon)
import { 
  FaHome, FaBed, FaImages, FaBlog, FaPhoneAlt, 
  FaUserCircle, FaSignOutAlt, FaSignInAlt, FaConciergeBell
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

export default function Header({ auth, onLogout }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = React.useRef(null); // Ref cho dropdown (nếu dùng cách delay)

  const handleLogout = () => {
    onLogout();
    navigate("/");
    setShowDropdown(false);
  };

  const isUserAuthenticated = !!auth;
  const isUserAdmin = checkIsAdmin(auth);

  // Xử lý dropdown mượt mà (giữ lại logic từ câu trước)
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowDropdown(false), 300);
  };

  return (
    <header className="header">
      
      {/* 1. LOGO ĐÃ CHỈNH SỬA: KẾT HỢP ẢNH + CHỮ */}
      <div className="logo-container">
        <NavLink to="/" className="brand-wrapper">
          <img src={logo} alt="Luxury Hotel Logo" className="logo-img" />
          <div className="brand-text">
             <span className="brand-title">LUXURY</span>
             <span className="brand-subtitle">HOTEL & RESORT</span>
          </div>
        </NavLink>
      </div>

      {/* 2. Menu chính (Giữ nguyên) */}
      <nav className="nav-menu">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <FaHome className="nav-icon" /> <span>Home</span>
        </NavLink>
        {/* ... Các link khác giữ nguyên ... */}
        <NavLink to="/services" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <FaConciergeBell className="nav-icon" /> <span>Services</span>
        </NavLink>
        <NavLink to="/gallerys" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <FaImages className="nav-icon" /> <span>Gallery</span>
        </NavLink>
        <NavLink to="/rooms" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <FaBed className="nav-icon" /> <span>Rooms</span>
        </NavLink>
        <NavLink to="/blogs" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <FaBlog className="nav-icon" /> <span>Blog</span>
        </NavLink>
        <NavLink to="/contactus" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <FaPhoneAlt className="nav-icon" /> <span>Contact</span>
        </NavLink>
      </nav>

      {/* 3. Khu vực User/Login (Giữ nguyên) */}
      <div className="auth-section">
        {!isUserAuthenticated ? (
          <NavLink to="/login" className="login-btn">
            <FaSignInAlt /> <span>Login</span>
          </NavLink>
        ) : (
          <div 
            className="user-dropdown-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="user-trigger">
              <FaUserCircle className="user-avatar-icon" />
              <span className="user-email">{auth?.email}</span>
              <IoIosArrowDown className={`arrow-icon ${showDropdown ? 'rotate' : ''}`} />
            </div>

            {showDropdown && (
              <div 
                className="dropdown-menu"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <NavLink to="/profile" className="dropdown-item">
                  <FaUserCircle /> Hồ sơ cá nhân
                </NavLink>

                {isUserAdmin && (
                  <NavLink to="/trangchu" className="dropdown-item admin-link">
                    <MdAdminPanelSettings /> Quản trị Admin
                  </NavLink>
                )}
                
                <div className="divider"></div>

                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <FaSignOutAlt /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}