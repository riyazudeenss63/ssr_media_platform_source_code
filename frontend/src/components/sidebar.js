import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/upload", label: "Upload Video", icon: "⬆" },
    { to: "/settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.section}>
        {links.map((link) => {
          const active = location.pathname === link.to;

          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...styles.link,
                ...(active ? styles.activeLink : {}),
              }}
            >
              <span style={styles.icon}>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    minWidth: "220px",
    background: "#0f0f0f",
    borderRight: "1px solid #222",
    padding: "14px 12px",
    minHeight: "calc(100vh - 73px)",
    position: "sticky",
    top: "73px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    color: "#e5e7eb",
    padding: "12px 14px",
    borderRadius: "14px",
    background: "transparent",
    fontWeight: "500",
  },
  activeLink: {
    background: "#272727",
    color: "#fff",
  },
  icon: {
    width: "20px",
    textAlign: "center",
    fontSize: "16px",
  },
};