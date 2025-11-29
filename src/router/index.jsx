import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "@/layouts/main-layout";
import AuthLayout from "@/layouts/auth-layout";

// Pages
import Login from "@/pages/login";
import Register from "@/pages/register";
import HomePage from "@/pages/home";
import NotFoundPage from "@/pages/not-found";

// Guard
import ProtectedRoutes from "@/components/auth/ProtectedRoute";

const router = createBrowserRouter([
  // AUTH ROUTES (Public, lekin token borlar kira olmaydi)
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  // PROTECTED ROUTES (Faqat tokeni borlar uchun)
  {
    element: <ProtectedRoutes />, // 1. Oldin token bormi tekshiradi
    children: [
      {
        element: <MainLayout />, // 2. Keyin Navbarni yuklaydi
        children: [
          {
            path: "/", // Home Page (Endi bu himoyalangan)
            element: <HomePage />,
          },
          // Boshqa himoyalangan sahifalar shu yerga qo'shiladi
          // { path: "/profile", element: <ProfilePage /> }
        ],
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
