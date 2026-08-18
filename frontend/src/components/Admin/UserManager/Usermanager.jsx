import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Homebar from "../Head/Homebar.jsx";
import { getAuth } from "../../../utils/auth";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaEnvelope,
  FaPhoneAlt,
  FaUserShield,
  FaUserTag,
} from "react-icons/fa";
import "../Trangchu.css";
import "./Usermanager.css";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const navigate = useNavigate();

  /* ================= LOAD USERS ================= */
  const loadUsers = async () => {
    const token = getAuth()?.token;
    if (!token) return navigate("/login");

    try {
      const res = await fetch("http://localhost:9192/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return navigate("/login");

      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = users.filter((u) =>
      u.email.toLowerCase().includes(term) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
      (u.phone || "").includes(term)
    );
    setFilteredUsers(result);
  }, [searchTerm, users]);

  /* ================= HELPERS ================= */
  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  const renderRole = (user) => {
    let role = "ROLE_USER";
    if (user.roles?.length) role = user.roles[0].name || user.roles[0];
    if (user.role) role = user.role;

    const isAdmin = role.includes("ADMIN");

    return (
      <span className={`role ${isAdmin ? "admin" : "user"}`}>
        {isAdmin ? <FaUserShield /> : <FaUserTag />}
        {isAdmin ? "Admin" : "User"}
      </span>
    );
  };

  /* ================= DELETE ================= */
  const handleDelete = async (email) => {
    if (!window.confirm(`Xóa tài khoản ${email}?`)) return;

    const token = getAuth()?.token;
    try {
      const res = await fetch(
        `http://localhost:9192/users/delete/${email}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) loadUsers();
      else alert("❌ Xóa thất bại");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = getAuth()?.token;

    try {
      const res = await fetch(
        `http://localhost:9192/users/update/${editingUser.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingUser),
        }
      );

      if (res.ok) {
        setEditingUser(null);
        loadUsers();
      } else {
        alert("❌ Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <Homebar />
      </aside>

      {/* ===== CONTENT ===== */}
      <main className="content">
        {/* HEADER */}
        <div className="page-header">
          <div>
            <h1>Quản lý thành viên</h1>
            <p>Danh sách tài khoản trong hệ thống</p>
          </div>

          <div className="toolbar">
            <div className="search">
              <FaSearch />
              <input
                type="text"
                placeholder="Tìm theo tên, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="count">{filteredUsers.length}</span>
          </div>
        </div>

        {/* TABLE */}
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Liên hệ</th>
                <th className="center">Vai trò</th>
                <th className="center">Trạng thái</th>
                <th className="center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    {/* USER */}
                    <td>
                      <div className="user">
                        <div className="avatar">
                          {getInitials(u.firstName)}
                        </div>
                        <div>
                          <div className="name">
                            {u.lastName} {u.firstName}
                          </div>
                          <div className="uid">ID #{u.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="contact">
                      <span>
                        <FaEnvelope /> {u.email}
                      </span>
                      <span>
                        <FaPhoneAlt /> {u.phone || "---"}
                      </span>
                    </td>

                    {/* ROLE */}
                    <td className="center">{renderRole(u)}</td>

                    {/* STATUS */}
                    <td className="center">
                      <span className="status">Hoạt động</span>
                    </td>

                    {/* ACTION */}
                    <td className="center">
                      <button
                        className="icon edit"
                        onClick={() => setEditingUser(u)}
                        title="Sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="icon delete"
                        onClick={() => handleDelete(u.email)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ===== MODAL EDIT ===== */}
      {editingUser && (
        <div className="overlay">
          <div className="modal">
            <header>
              <h3>Chỉnh sửa người dùng</h3>
              <button onClick={() => setEditingUser(null)}>
                <FaTimes />
              </button>
            </header>

            <form onSubmit={handleUpdate}>
              <div className="modal-user">
                <div className="avatar-lg">
                  {getInitials(editingUser.firstName)}
                </div>
                <div>
                  <strong>{editingUser.email}</strong>
                  <p>ID #{editingUser.id}</p>
                </div>
              </div>

              <input
                placeholder="Họ"
                value={editingUser.lastName || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, lastName: e.target.value })
                }
              />

              <input
                placeholder="Tên"
                value={editingUser.firstName || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, firstName: e.target.value })
                }
              />

              <input
                placeholder="Số điện thoại"
                value={editingUser.phone || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
              />

              <div className="actions">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                >
                  Hủy
                </button>
                <button type="submit" className="primary">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
