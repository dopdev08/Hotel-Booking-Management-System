import apiClient from "./client";

/**
 * Lấy danh sách toàn bộ người dùng hệ thống (Admin).
 * @returns {Promise<Response>}
 */
export const getAllUsers = () => {
  return apiClient.get("/users/all");
};

/**
 * Cập nhật thông tin người dùng theo email (Admin).
 * @param {string} email - Email người dùng
 * @param {Object} userData - Dữ liệu cập nhật { firstName, lastName, phone, ... }
 * @returns {Promise<Response>}
 */
export const updateUser = (email, userData) => {
  return apiClient.put(`/users/update/${encodeURIComponent(email)}`, userData);
};

/**
 * Xóa người dùng theo email (Admin).
 * @param {string} email - Email người dùng cần xóa
 * @returns {Promise<Response>}
 */
export const deleteUser = (email) => {
  return apiClient.delete(`/users/delete/${encodeURIComponent(email)}`);
};
