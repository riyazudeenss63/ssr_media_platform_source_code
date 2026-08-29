import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const defaultSettings = {
  profileName: "Admin",
  theme: "dark",
  apiBaseUrl: "http://localhost:5050",
  defaultCategory: "General",
  autoPlay: true,
  showAnalytics: true,
  compactView: false,
  notifications: true,
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ott_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("ott_settings", JSON.stringify(settings));
    setMessage("Settings saved successfully");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.setItem("ott_settings", JSON.stringify(defaultSettings));
    setMessage("Settings reset successfully");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.layout}>
        <Sidebar />

        <main style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.title}>Settings</h1>
            <p style={styles.sub}>
              Manage your app preferences and homepage behavior
            </p>
          </div>

          {message && <div style={styles.message}>{message}</div>}

          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Profile</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Profile Name</label>
              <input
                type="text"
                name="profileName"
                value={settings.profileName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>App Preferences</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Theme</label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>API Base URL</label>
              <input
                type="text"
                name="apiBaseUrl"
                value={settings.apiBaseUrl}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Default Video Category</label>
              <input
                type="text"
                name="defaultCategory"
                value={settings.defaultCategory}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Homepage Options</h3>

            <label style={styles.toggleRow}>
              <input
                type="checkbox"
                name="autoPlay"
                checked={settings.autoPlay}
                onChange={handleChange}
              />
              <span>Enable Auto Play</span>
            </label>

            <label style={styles.toggleRow}>
              <input
                type="checkbox"
                name="showAnalytics"
                checked={settings.showAnalytics}
                onChange={handleChange}
              />
              <span>Show Analytics Cards on Homepage</span>
            </label>

            <label style={styles.toggleRow}>
              <input
                type="checkbox"
                name="compactView"
                checked={settings.compactView}
                onChange={handleChange}
              />
              <span>Enable Compact Video Card View</span>
            </label>

            <label style={styles.toggleRow}>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
              />
              <span>Enable Notifications</span>
            </label>
          </div>

          <div style={styles.actions}>
            <button onClick={handleSave} style={styles.saveBtn}>
              Save Settings
            </button>
            <button onClick={handleReset} style={styles.resetBtn}>
              Reset
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    color: "#fff",
  },
  layout: {
    display: "flex",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    padding: "24px",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "34px",
  },
  sub: {
    marginTop: "8px",
    color: "#9ca3af",
  },
  message: {
    marginBottom: "18px",
    padding: "12px 16px",
    borderRadius: "12px",
    background: "#052e16",
    color: "#86efac",
    border: "1px solid #14532d",
  },
  card: {
    background: "#181818",
    border: "1px solid #2a2a2a",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "20px",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "18px",
    fontSize: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
  },
  label: {
    marginBottom: "8px",
    color: "#e5e7eb",
    fontWeight: "600",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "#111",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    color: "#e5e7eb",
    fontSize: "15px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  saveBtn: {
    background: "#ff0000",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
  },
  resetBtn: {
    background: "#272727",
    color: "#fff",
    border: "1px solid #3a3a3a",
    padding: "12px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
  },
};