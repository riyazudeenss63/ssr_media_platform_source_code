import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import API from "../services/api";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import AnalyticsCard from "../components/analyticscard";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [range, setRange] = useState("28d");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get(`/analytics/dashboard?range=${range}`);
        setData(res.data);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };
    fetchDashboard();
  }, [range]);

  if (!data) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.layout}>
          <Sidebar />
          <div style={styles.loading}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.layout}>
        <Sidebar />

        <main style={styles.content}>
          <div style={styles.topRow}>
            <div>
              <h2 style={styles.heading}>SSR Analytics Dashboard</h2>
              <p style={styles.sub}>
                Track engagement, performance, and platform growth
              </p>
            </div>

            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              style={styles.select}
            >
              <option value="7d">Last 7 days</option>
              <option value="28d">Last 28 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          <div style={styles.grid}>
            <AnalyticsCard title="Total Views" value={data.totalViews || 0} />
            <AnalyticsCard
              title="Watch Time"
              value={`${data.totalWatchTime || 0} sec`}
            />
            <AnalyticsCard title="Users" value={data.totalUsers || 0} />
            <AnalyticsCard title="Videos" value={data.totalVideos || 0} />
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.cardTitle}>Performance Over Time</h3>
            {data.viewsOverTime && data.viewsOverTime.labels.length > 0 ? (
              <div style={{ height: 360, position: 'relative' }}>
                <Line
                  data={{
                    labels: data.viewsOverTime.labels || [],
                    datasets: [
                      {
                        label: "Views",
                        data: data.viewsOverTime.views || [],
                        borderColor: "#d4af37",
                        backgroundColor: "rgba(212,175,55,0.12)",
                        fill: true,
                        tension: 0.35,
                      },
                      {
                        label: "Watch Time",
                        data: data.viewsOverTime.watchTime || [],
                        borderColor: "#38bdf8",
                        backgroundColor: "rgba(56,189,248,0.10)",
                        fill: true,
                        tension: 0.35,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: "#ffffff" },
                      },
                    },
                    scales: {
                      x: {
                        ticks: { color: "#cbd5e1" },
                        grid: { color: "rgba(255,255,255,0.08)" },
                      },
                      y: {
                        ticks: { color: "#cbd5e1" },
                        grid: { color: "rgba(255,255,255,0.08)" },
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <div style={{ padding: '60px 0', textAlign: 'center', color: '#9ca3af' }}>
                No analytics data available for this time range.
              </div>
            )}
          </div>

          <div style={styles.listCard}>
            <h3 style={styles.cardTitle}>Top Videos</h3>

            {!data.topVideos || data.topVideos.length === 0 ? (
              <p style={styles.empty}>No top videos found.</p>
            ) : (
              data.topVideos.map((video, index) => (
                <div key={video._id || index} style={styles.videoRow}>
                  <div>
                    <div style={styles.videoTitle}>{video.title}</div>
                    <div style={styles.videoMeta}>
                      {video.views || 0} views • {video.watchTime || 0} sec
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0f19",
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
  loading: {
    color: "#aaa",
    marginTop: "30px",
    padding: "24px",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  heading: {
    margin: 0,
    fontSize: "30px",
  },
  sub: {
    marginTop: "8px",
    color: "#94a3b8",
  },
  select: {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#131c2e",
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },
  chartCard: {
    background: "#111827",
    border: "1px solid #1f2a40",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "22px",
  },
  listCard: {
    background: "#111827",
    border: "1px solid #1f2a40",
    borderRadius: "18px",
    padding: "20px",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "20px",
  },
  empty: {
    color: "#9ca3af",
  },
  videoRow: {
    padding: "14px 0",
    borderBottom: "1px solid #1f2a40",
  },
  videoTitle: {
    fontWeight: "600",
    color: "#fff",
    fontSize: "16px",
  },
  videoMeta: {
    fontSize: "14px",
    color: "#94a3b8",
    marginTop: "6px",
  },
};