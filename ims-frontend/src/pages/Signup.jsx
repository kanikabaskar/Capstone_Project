import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function Signup() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!Object.values(form).every(Boolean))
      return setError("Please complete all fields.");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");
    register(form);
    nav("/login");
  };
  return (
    <div className="auth-page single">
      <div className="auth-card-wrap">
        <form className="auth-card signup-card" onSubmit={submit}>
          <div className="mobile-logo">
            <div className="brand-mark">IMS</div>
          </div>
          <span className="eyebrow">REGISTRATION</span>
          <h2>Create your IMS account</h2>
          
          {error && <div className="form-alert">{error}</div>}
          <label>
            Full Name
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </label>
          <label>
            Username
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <div className="two">
            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            <label>
              Confirm Password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </label>
          </div>
          <button className="btn primary full">Register</button>
          <p className="auth-foot">
            Already registered? <Link to="/login">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
