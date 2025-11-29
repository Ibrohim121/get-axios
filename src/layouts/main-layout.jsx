import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <header style={{ padding: '20px', background: '#eee' }}>
        <h1>Platzi</h1>
        {/* Bu yerda Logout tugmasi va Menu bo'ladi */}
      </header>

      <main style={{ padding: '20px' }}>
        {/* Child sahifalar (Home, Profile) shu yerga tushadi */}
        <Outlet />
      </main>

      <footer style={{ marginTop: 'auto', padding: '20px', background: '#333', color: '#fff' }}>
        <p>Footer qismi</p>
      </footer>
    </div>
  );
};

export default MainLayout;
