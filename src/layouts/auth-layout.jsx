import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  // Ixtiyoriy: Agar userda token bo'lsa, Login pagega kiritmasdan Homega haydash
  const token = localStorage.getItem("access_token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        {/* Login yoki Register shu yerga tushadi */}
        Layout
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
