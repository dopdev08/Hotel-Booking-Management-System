import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBed,
  FaCalendarAlt,
  FaUsers,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import "./Homebar.css";

export default function Homebar() {
  const menuItems = [
    { path: "/trangchu", label: "Trang chủ", Icon: FaHome },
    { path: "/managerooms", label: "Quản lý phòng", Icon: FaBed },
    { path: "/Bookingroom", label: "Quản lý đặt phòng", Icon: FaCalendarAlt },
    { path: "/customers", label: "Quản lý khách hàng", Icon: FaUsers },
  ];

  return (
    <aside className="sidebar">
      {/* ===== HEADER ===== */}
      <div className="sidebar-header">
        <FaTachometerAlt className="logo-icon" />
        <span className="logo-text">Dashboard</span>
      </div>

      {/* ===== MENU ===== */}
      <nav className="sidebar-menu">
        {menuItems.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <Icon className="menu-icon" />
            <span className="menu-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ===== FOOTER ===== */}
      <div className="sidebar-footer">
        <NavLink to="/" className="menu-item logout">
          <FaSignOutAlt className="menu-icon" />
          <span className="menu-label">Thoát</span>
        </NavLink>
      </div>
    </aside>
  );
}
