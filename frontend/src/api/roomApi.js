import apiClient from "./client";

/**
 * Lấy danh sách tất cả các phòng nghỉ.
 * @returns {Promise<Response>}
 */
export const getAllRooms = () => {
  return apiClient.get("/rooms/all-rooms");
};

/**
 * Tìm kiếm phòng theo ngày nhận, ngày trả và loại phòng.
 * @param {Object} searchParams - { checkIn, checkOut, roomType }
 * @returns {Promise<Response>}
 */
export const searchRooms = ({ checkIn, checkOut, roomType } = {}) => {
  const params = new URLSearchParams();
  if (checkIn) params.append("checkIn", checkIn);
  if (checkOut) params.append("checkOut", checkOut);
  if (roomType) params.append("roomType", roomType);

  const queryString = params.toString();
  const endpoint = queryString ? `/rooms/search?${queryString}` : "/rooms/search";
  return apiClient.get(endpoint);
};

/**
 * Lấy thông tin chi tiết phòng theo ID.
 * @param {string|number} roomId
 * @returns {Promise<Response>}
 */
export const getRoomById = (roomId) => {
  return apiClient.get(`/rooms/room/${roomId}`);
};

/**
 * Thêm phòng mới (hỗ trợ FormData gồm roomType, roomPrice, photo).
 * @param {FormData|Object} roomData
 * @returns {Promise<Response>}
 */
export const addNewRoom = (roomData) => {
  return apiClient.post("/rooms/add/new-room", roomData);
};

/**
 * Cập nhật thông tin phòng (hỗ trợ FormData gồm roomType, roomPrice, photo).
 * @param {string|number} roomId
 * @param {FormData|Object} roomData
 * @returns {Promise<Response>}
 */
export const updateRoom = (roomId, roomData) => {
  return apiClient.put(`/rooms/update/${roomId}`, roomData);
};

/**
 * Xóa phòng theo ID.
 * @param {string|number} roomId
 * @returns {Promise<Response>}
 */
export const deleteRoom = (roomId) => {
  return apiClient.delete(`/rooms/delete/room/${roomId}`);
};
