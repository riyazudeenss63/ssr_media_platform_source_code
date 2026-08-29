import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ssrLogo from "../assests/ssr-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <img src={ssrLogo} alt="Logo" style={styles.logo} />
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to continue to SSR Media Platform</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div style={styles.formOptions}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" style={styles.checkbox} />
              Remember me
            </label>
            <Link to="#" style={styles.forgotLink}>Forgot password?</Link>
          </div>

          <button type="submit" style={styles.submitBtn}>
            Sign In
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0f19",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  container: {
    background: "#111827",
    border: "1px solid #1f2a40",
    borderRadius: "24px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logo: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)",
    background: "#1e293b",
    padding: "8px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: "700",
  },
  subtitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "15px",
  },
  errorBox: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#cbd5e1",
    fontWeight: "500",
  },
  input: {
    background: "#0b0f19",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "14px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #d4af37, #fde047)",
    color: "#111827",
    border: "none",
    padding: "16px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
    boxShadow: "0 4px 14px rgba(212, 175, 55, 0.4)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  formOptions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#cbd5e1",
    cursor: "pointer",
  },
  checkbox: {
    accentColor: "#d4af37",
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },
  forgotLink: {
    color: "#d4af37",
    textDecoration: "none",
    fontWeight: "500",
  },
  footerText: {
    marginTop: "24px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "14px",
  },
  link: {
    color: "#d4af37",
    textDecoration: "none",
    fontWeight: "600",
  }
};
