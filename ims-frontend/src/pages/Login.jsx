import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const r = login(form.username, form.password, form.remember);
    if (r.ok) nav(loc.state?.from || "/dashboard", { replace: true });
    else setError(r.message);
  };
  return (
    <div className="auth-page">
      <div className="auth-art">
        <div className="auth-brand">
          <div className="brand-mark">IMS</div>
          <div>
            <strong>Glory Textiles Inventory Management System</strong>
            
          </div>
        </div>
        <div className="art-copy">
          <span className="pill"><strong>GLORY TEXTILES</strong></span>
          <h1>Manage every purchase with confidence.</h1>
          <p>
            A single workspace for vendors, materials, purchase entry and
            reporting.
          </p>
          <div className="art-stats">
            <div>
              <strong>03</strong>
              <span>Core services</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Visibility</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-card-wrap">
        <form className="auth-card" onSubmit={submit}>
          <div className="mobile-logo">
            <div className="brand-mark">IMS</div>
          </div>
          
          <h2>Sign in to IMS</h2>
          
          {error && <div className="form-alert">{error}</div>}
          <label>
            Username
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
              placeholder="Enter username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              placeholder="Enter password"
            />
          </label>
          <div className="form-row">
            <label className="check">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) =>
                  setForm({ ...form, remember: e.target.checked })
                }
              />{" "}
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="text-btn"
              onClick={() =>
                alert(
                  "Password recovery requires a real authentication backend; none is present in the supplied services.",
                )
              }
            >
              Forgot password?
            </button>
          </div>
          <button className="btn primary full">Sign in</button>
          <p className="auth-foot">
            New to IMS? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
