import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
// Đổi isAdmin thành checkIsAdmin
import { setAuth as saveAuth, checkIsAdmin } from '../../../utils/auth'; 
import "../auth/auth.css";

function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const preRoomId = location.state?.roomId || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:9192/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Email hoặc mật khẩu không đúng");
        return;
      }

      // 1. Chuẩn hóa dữ liệu và lưu vào localStorage thông qua hàm utils
      const authData = saveAuth(data);

      if (!authData || !authData.token) {
        setError("Lỗi: Không tìm thấy Token xác thực");
        return;
      }

      // 2. Cập nhật State cho App ngay lập tức để Header đổi giao diện
      setAuth(authData);

      // 3. Điều hướng dựa trên quyền hạn (Dùng hàm mới checkIsAdmin)
      if (checkIsAdmin(authData)) {
        navigate('/trangchu', { replace: true });
      } else {
        navigate(from, { state: { roomId: preRoomId }, replace: true });
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Đăng nhập</h1>
        {error && <div className="auth-alert auth-alert--error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label>Mật khẩu</label>
            <input type="password" className="auth-input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="auth-btn auth-btn--primary">
            {loading ? "Đang xác thực..." : "Đăng nhập"}
          </button>
        </form>
        <p className="auth-switch">Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
      </div>
    </div>
  );
}

export default Login;