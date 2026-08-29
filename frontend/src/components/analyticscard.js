import React from "react";

export default function AnalyticsCard({ title, value }) {
  return (
    <div style={styles.card}>
      <p style={styles.title}>{title}</p>
      <h2 style={styles.value}>{value}</h2>
    </div>
  );
}

const styles = {
  card: {
    background: "#181818",
    border: "1px solid #2a2a2a",
    borderRadius: "18px",
    padding: "18px",
  },
  title: {
    margin: 0,
    color: "#9ca3af",
    fontSize: "14px",
  },
  value: {
    margin: "10px 0 0",
    color: "#fff",
    fontSize: "28px",
  },
};