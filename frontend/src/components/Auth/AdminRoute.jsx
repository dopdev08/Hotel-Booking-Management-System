import { Navigate, Outlet } from "react-router-dom";
// Đảm bảo đường dẫn import tới file auth.js là chính xác
import { checkIsAdmin } from "../../utils/auth"; 

export default function AdminRoute({ auth }) {
  // Sử dụng hàm checkIsAdmin đã được export từ utils
  const isAdmin = checkIsAdmin(auth);

  if (!isAdmin) {
    // Nếu không phải Admin, điều hướng về trang chủ
    return <Navigate to="/" replace />;
  }

  // Nếu là Admin, cho phép hiển thị các component con thông qua Outlet
  return <Outlet />;
}