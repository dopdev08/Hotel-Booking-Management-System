import apiClient from "./client";

/**
 * Tính toán trước chi phí đặt phòng (Estimate).
 * @param {string|number} roomId - ID của phòng
 * @param {Object} estimateData - { guestEmail, checkInDate, checkOutDate, totalNumberOfGuest, selectedServices }
 * @returns {Promise<Response>}
 */
export const estimateBooking = (roomId, estimateData) => {
  return apiClient.post(`/bookings/room/${roomId}/estimate`, estimateData);
};

/**
 * Tạo đơn đặt phòng mới.
 * @param {string|number} roomId - ID của phòng
 * @param {Object} bookingData - { checkInDate, checkOutDate, totalNumberOfGuest, selectedServices }
 * @returns {Promise<Response>}
 */
export const createBooking = (roomId, bookingData) => {
  return apiClient.post(`/bookings/room/${roomId}/booking`, bookingData);
};

/**
 * Lấy danh sách lịch sử đặt phòng của một người dùng theo email.
 * @param {string} userEmail
 * @returns {Promise<Response>}
 */
export const getUserBookings = (userEmail) => {
  return apiClient.get(`/bookings/user/${encodeURIComponent(userEmail)}/bookings`);
};

/**
 * Lấy số liệu thống kê tổng quan hệ thống cho Admin Dashboard.
 * @returns {Promise<Response>}
 */
export const getGlobalStats = () => {
  return apiClient.get("/bookings/admin/global-stats");
};

/**
 * Lấy danh sách toàn bộ các đơn đặt phòng (Admin).
 * @returns {Promise<Response>}
 */
export const getAllBookings = () => {
  return apiClient.get("/bookings/all-bookings");
};

/**
 * Hủy đơn đặt phòng theo ID (Admin).
 * @param {string|number} bookingId
 * @returns {Promise<Response>}
 */
export const deleteBooking = (bookingId) => {
  return apiClient.delete(`/bookings/booking/${bookingId}/delete`);
};
