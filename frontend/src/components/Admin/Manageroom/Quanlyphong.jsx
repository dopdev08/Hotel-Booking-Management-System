import React, { useEffect, useState } from "react";
import Head from "../Head/Homebar.jsx";
import { getAllRooms, addNewRoom, updateRoom, deleteRoom } from "../../../api";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaCamera } from "react-icons/fa";

import "./Quanlyphong.css";

export default function QuanLyPhong() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State quản lý Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({
    id: "",
    roomType: "",
    roomPrice: "",
    photo: null,
    previewUrl: null 
  });

  // ================= LOAD ROOMS =================
  const loadRooms = async () => {
    try {
      const res = await getAllRooms();
      if (!res.ok) throw new Error("Lỗi kết nối server");
      const data = await res.json();
      setRooms(data);
      setFilteredRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const result = rooms.filter(room => 
      room.roomType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRooms(result);
  }, [searchTerm, rooms]);

  // ================= HANDLERS =================
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setCurrentRoom({ id: "", roomType: "", roomPrice: "", photo: null, previewUrl: null });
    setShowModal(true);
  };

  const handleOpenEdit = (room) => {
    setIsEditMode(true);
    setCurrentRoom({
      id: room.id,
      roomType: room.roomType,
      roomPrice: room.roomPrice,
      photo: null, // Reset file input
      previewUrl: room.photo ? `data:image/jpeg;base64,${room.photo}` : null
    });
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentRoom({
        ...currentRoom,
        photo: file,
        previewUrl: URL.createObjectURL(file) // Tạo url xem trước ảnh ngay lập tức
      });
    }
  };

  const handleSave = async () => {
    if (!currentRoom.roomType || !currentRoom.roomPrice) {
      alert("Vui lòng nhập tên và giá phòng!");
      return;
    }

    const formData = new FormData();
    formData.append("roomType", currentRoom.roomType.trim());
    formData.append("roomPrice", currentRoom.roomPrice.toString());
    
    // Nếu là Add hoặc (Edit và có chọn ảnh mới) thì mới append ảnh
    if (currentRoom.photo) {
      formData.append("photo", currentRoom.photo);
    }

    try {
      const res = isEditMode
        ? await updateRoom(currentRoom.id, formData)
        : await addNewRoom(formData);

      if (!res.ok) throw new Error("Thao tác thất bại");
      
      alert(isEditMode ? "✅ Đã cập nhật!" : "✅ Đã thêm mới!");
      setShowModal(false);
      loadRooms();
    } catch (error) {
      alert("❌ Có lỗi xảy ra: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa phòng này chứ?")) return;
    try {
      const res = await deleteRoom(id);
      if (!res.ok) throw new Error("Xóa thất bại");
      loadRooms();
    } catch (error) {
      alert("❌ Lỗi xóa phòng");
    }
  };

  // ================= RENDER =================
  return (
    <div className="admin-layout">
      <Head />
      <div className="page-content">
        <div className="manager-container">
          {/* --- HEADER --- */}
          <div className="manager-header">
            <div>
              <h1 className="page-title">Quản Lý Phòng</h1>
              <p className="page-subtitle">Quản lý danh sách và giá phòng khách sạn</p>
            </div>
            <button className="btn-add" onClick={handleOpenAdd}>
              <FaPlus /> Thêm Phòng
            </button>
          </div>

          {/* --- TOOLBAR (SEARCH) --- */}
          <div className="manager-toolbar">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Tìm kiếm loại phòng..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="total-badge">
              Tổng số: <strong>{filteredRooms.length}</strong> phòng
            </div>
          </div>

          {/* --- DATA TABLE --- */}
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hình ảnh</th>
                  <th>Loại phòng</th>
                  <th>Giá (VND)</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room, index) => (
                    <tr key={room.id}>
                      <td>#{room.id}</td>
                      <td>
                        <div className="img-thumbnail">
                          {room.photo ? (
                            <img src={`data:image/jpeg;base64,${room.photo}`} alt="Room" />
                          ) : (
                            <span className="no-img">No Img</span>
                          )}
                        </div>
                      </td>
                      <td className="fw-bold">{room.roomType}</td>
                      <td className="text-price">{Number(room.roomPrice).toLocaleString()} đ</td>
                      <td>
                        <button className="action-btn edit" onClick={() => handleOpenEdit(room)}>
                          <FaEdit />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(room.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">Không tìm thấy dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL POPUP --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditMode ? "Cập Nhật Phòng" : "Thêm Phòng Mới"}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            
            <div className="modal-body">
              {/* Cột Upload Ảnh */}
              <div className="form-group upload-section">
                <label htmlFor="photo-upload" className="upload-box">
                  {currentRoom.previewUrl ? (
                    <img src={currentRoom.previewUrl} alt="Preview" className="img-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <FaCamera size={30} />
                      <span>Chọn ảnh</span>
                    </div>
                  )}
                </label>
                <input id="photo-upload" type="file" hidden accept="image/*" onChange={handleFileChange}/>
              </div>

              {/* Cột Thông tin */}
              <div className="form-inputs">
                <div className="form-group">
                  <label>Tên loại phòng</label>
                  <input 
                    type="text" 
                    value={currentRoom.roomType}
                    onChange={(e) => setCurrentRoom({...currentRoom, roomType: e.target.value})}
                    placeholder="VD: Deluxe King" 
                  />
                </div>
                <div className="form-group">
                  <label>Giá mỗi đêm</label>
                  <input 
                    type="number" 
                    value={currentRoom.roomPrice}
                    onChange={(e) => setCurrentRoom({...currentRoom, roomPrice: e.target.value})}
                    placeholder="VD: 500000" 
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy bỏ</button>
              <button className="btn-save" onClick={handleSave}>
                {isEditMode ? "Lưu thay đổi" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}