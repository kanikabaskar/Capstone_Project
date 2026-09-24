import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const links = [
    ["/dashboard", "dashboard", "Dashboard"],
    ["/vendors", "vendor", "Vendor Service"],
    ["/materials", "material", "Material Service"],
    ["/purchase", "purchase", "Purchase Entry"],
    ["/reports", "report", "Purchase Reports"],
  ];
  const doLogout = () => {
    logout();
    nav("/login");
  };
  const pageTitle = location.pathname.startsWith("/purchase/success")
    ? "Purchase Successful"
    : location.pathname.startsWith("/purchase")
      ? "Materials Purchased Entry"
      : location.pathname.startsWith("/reports")
        ? "Vendor Purchase Report"
        : location.pathname.startsWith("/vendors")
          ? "Vendor Service Data"
          : location.pathname.startsWith("/materials")
            ? "Material Service Data"
            : "Dashboard";
  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">IMS</div>
          <div>
            <strong>Glory Textiles<small> Inventory Management System</small></strong>
            
          </div>
        </div>
        <nav>
          {links.map(([to, icon, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="logout-link" onClick={doLogout}>
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </aside>
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}
      <section className="main-shell">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="topbar-title">
            <h1>{pageTitle}</h1>
          </div>
          <div className="user-area">
            <div className="avatar">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </div>
            <div className="user-copy">
              <strong>{user?.name || "User"}</strong>
              <small>{user?.username || ""}</small>
            </div>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </section>
    </div>
  );
}
