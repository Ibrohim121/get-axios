import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";

const ProtectedRoutes = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const location = useLocation();

  // Sahifa yangilanganda, state o'chib ketadi. 
  // Shuning uchun token borligini tekshirib olishimiz kerak.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Agar token localStorageda ham yo'q bo'lsa -> Login
  const token = localStorage.getItem("access_token");

  if (!token && !isAuthenticated) {
    // replace: true -> orqaga qaytish tugmasini bosganda yana himoyalangan sahifaga qaytib qolmasligi uchun
    // state: { from: location } -> login qilgandan keyin yana o'sha sahifaga qaytarish uchun
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Hammasi joyida bo'lsa, ichki sahifalarni ko'rsat (Outlet)
  return <Outlet />;
};

export default ProtectedRoutes;
