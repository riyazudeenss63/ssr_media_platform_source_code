import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Upload", path: "/upload" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <header style={styles.navbar}>
      <div style={styles.left}>
        <div style={styles.logoWrap} onClick={() => navigate("/")}>
          <div>
            <h2 style={styles.title}>Smart OTT</h2>
            <p style={styles.sub}>Analytics Studio</p>
          </div>
        </div>
      </div>

      <form style={styles.searchWrap} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search videos, titles, categories..."
          style={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" style={styles.searchBtn}>Search</button>
      </form>

      <div style={styles.actions}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navBtn,
                ...(active ? styles.activeNavBtn : {}),
              }}
            >
              {item.label}
            </button>
          );
        })}
        {user ? (
          <>
            <span style={styles.userName}>Hi, {user.name}</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              style={styles.navBtn}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} style={styles.navBtn}>
              Sign In
            </button>
            <button onClick={() => navigate("/register")} style={{...styles.navBtn, ...styles.primaryBtn}}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    padding: "14px 20px",
    background: "#0f0f0f",
    borderBottom: "1px solid #222",
    flexWrap: "wrap",
  },
  left: {
    display: "flex",
    alignItems: "center",
    minWidth: "220px",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  title: {
    margin: 0,
    color: "#fff",
    fontSize: "22px",
    lineHeight: 1,
  },
  sub: {
    margin: "4px 0 0",
    color: "#a1a1aa",
    fontSize: "12px",
  },
  searchWrap: {
    flex: 1,
    minWidth: "260px",
    maxWidth: "620px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  searchInput: {
    flex: 1,
    height: "42px",
    borderRadius: "999px",
    border: "1px solid #303030",
    background: "#121212",
    color: "#fff",
    padding: "0 16px",
    outline: "none",
    fontSize: "14px",
  },
  searchBtn: {
    height: "42px",
    borderRadius: "999px",
    border: "1px solid #303030",
    background: "#222",
    color: "#fff",
    padding: "0 18px",
    cursor: "pointer",
    fontWeight: "600",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  navBtn: {
    border: "1px solid #2f2f2f",
    background: "#1c1c1c",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "600",
  },
  activeNavBtn: {
    background: "#fff",
    color: "#111",
    border: "1px solid #fff",
  },
  userName: {
    color: "#d4af37",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
  },
  primaryBtn: {
    background: "#d4af37",
    color: "#111827",
    border: "none",
  }
};