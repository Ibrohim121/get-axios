import { create } from "zustand";
import authService from "../services/authService";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Login funksiyasi
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // 1. Tokenlarni olish
      const { access_token, refresh_token } = await authService.login(email, password);

      // 2. LocalStoragega yozish
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // 3. User profilini yuklash (Token headerda avtomatik ketadi - axiosClient orqali)
      const user = await authService.getProfile();

      set({
        user: user,
        isAuthenticated: true,
        loading: false
      });

      return true; // Login muvaffaqiyatli
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        loading: false
      });
      return false;
    }
  },

  // Logout funksiyasi
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, isAuthenticated: false });
  },

  // Sahifa yangilanganda (Refresh) user borligini tekshirish
  checkAuth: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      // Token bor ekan, demak user ma'lumotini tortib olamiz
      const user = await authService.getProfile();
      set({ user: user, isAuthenticated: true });
    } catch (error) {
      // Agar token eskirgan bo'lsa va refresh ishlamasa -> logout
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      set({ user: null, isAuthenticated: false });
    }
  }
}));

export default useAuthStore;
