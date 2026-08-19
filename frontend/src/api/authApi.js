import apiClient from "./client";

/**
 * Đăng ký tài khoản người dùng mới.
 * @param {Object} userData - Thông tin người dùng { firstName, lastName, email, phone, birthDate, password }
 * @returns {Promise<Response>}
 */
export const register = (userData) => {
  return apiClient.post("/auth/register", userData);
};

/**
 * Đăng nhập tài khoản.
 * @param {Object} credentials - Thông tin đăng nhập { email, password }
 * @returns {Promise<Response>}
 */
export const login = (credentials) => {
  return apiClient.post("/auth/login", credentials);
};
