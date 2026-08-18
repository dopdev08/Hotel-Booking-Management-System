import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../auth/auth.css";

// Validation từng field
const validateField = (name, value) => {
  switch (name) {
    case "firstName":
      if (!value) return "Họ không được để trống";
      if (value.trim().length < 2) return "Họ phải ít nhất 2 ký tự";
      return "";
    case "lastName":
      if (!value) return "Tên không được để trống";
      if (value.trim().length < 1) return "Tên phải ít nhất 1 ký tự";
      return "";
    case "email":
      if (!value) return "Email không được để trống";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Email không hợp lệ";
      return "";
    case "phone":
      if (!value) return "Số điện thoại không được để trống";
      const phoneDigits = value.replace(/\D/g, "");
      if (phoneDigits.length < 9 || phoneDigits.length > 11) return "Số điện thoại phải từ 9–11 chữ số";
      return "";
    case "birthDate":
      if (!value) return "Ngày sinh không được để trống";
      const birth = new Date(value);
      const today = new Date();
      if (birth > today) return "Ngày sinh không hợp lệ";
      const eighteenAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      if (birth > eighteenAgo) return "Chưa đủ 18 tuổi";
      return "";
    case "password":
      if (!value) return "Mật khẩu không được để trống";
      if (value.length < 6) return "Mật khẩu phải từ 6 ký tự trở lên";
      return "";
    default:
      return "";
  }
};

// Validate toàn bộ form
const validateAll = (form) => {
  const errors = {};
  Object.keys(form).forEach((key) => {
    const err = validateField(key, form[key]);
    if (err) errors[key] = err;
  });
  return errors;
};

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, form[name]) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      birthDate: true,
      password: true,
    });
    const newErrors = validateAll(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch("http://localhost:9192/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        // Đọc body trả về an toàn (có thể là JSON hoặc plain text) để debug
        const text = await res.text();
        let errMessage = res.statusText;
        try {
          const errJson = JSON.parse(text);
          errMessage = errJson.message || JSON.stringify(errJson);
        } catch (e) {
          if (text) errMessage = text;
        }
        console.error("Register failed", res.status, res.statusText, errMessage);
        alert(`Đăng ký thất bại: ${res.status} ${errMessage}`);
        return;
      }

      const data = await res.json();
      console.log("Đăng ký thành công:", data);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      console.error("Lỗi server:", err);
      alert("Lỗi kết nối backend.");
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Đăng ký</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          {/* First Name */}
          <div className="auth-field">
            <label>Họ</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth-input ${touched.firstName && errors.firstName ? "auth-input--error" : ""}`}
              placeholder="Họ"
            />
            {touched.firstName && errors.firstName && <div className="auth-error-text">{errors.firstName}</div>}
          </div>

          {/* Last Name */}
          <div className="auth-field">
            <label>Tên</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth-input ${touched.lastName && errors.lastName ? "auth-input--error" : ""}`}
              placeholder="Tên"
            />
            {touched.lastName && errors.lastName && <div className="auth-error-text">{errors.lastName}</div>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth-input ${touched.email && errors.email ? "auth-input--error" : ""}`}
              placeholder="Email"
            />
            {touched.email && errors.email && <div className="auth-error-text">{errors.email}</div>}
          </div>

          {/* Phone */}
          <div className="auth-field">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth-input ${touched.phone && errors.phone ? "auth-input--error" : ""}`}
              placeholder="Số điện thoại"
            />
            {touched.phone && errors.phone && <div className="auth-error-text">{errors.phone}</div>}
          </div>

          {/* Birth Date */}
          <div className="auth-field">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              onBlur={handleBlur}
              max={todayStr}
              className={`auth-input ${touched.birthDate && errors.birthDate ? "auth-input--error" : ""}`}
            />
            {touched.birthDate && errors.birthDate && <div className="auth-error-text">{errors.birthDate}</div>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth-input ${touched.password && errors.password ? "auth-input--error" : ""}`}
              placeholder="Mật khẩu"
            />
            {touched.password && errors.password && <div className="auth-error-text">{errors.password}</div>}
          </div>

          <button type="submit" className="auth-btn auth-btn--primary">Đăng ký</button>
        </form>

        <p className="auth-switch">
          Đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập</Link>
        </p>

        <p className="auth-back-home">
          <Link to="/">← Quay về trang chủ</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
