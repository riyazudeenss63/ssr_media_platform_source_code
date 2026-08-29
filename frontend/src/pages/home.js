import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import VideoCard from "../components/videocard";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import ssrLogo from "../assests/ssr-logo.png"; // change file name if needed

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalWatchTime: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      const [videosRes, statsRes] = await Promise.all([
        API.get("/videos"),
        API.get("/analytics/dashboard"),
      ]);

      setVideos(Array.isArray(videosRes.data) ? videosRes.data : []);
      setStats(
        statsRes.data || {
          totalVideos: 0,
          totalViews: 0,
          totalWatchTime: 0,
          totalUsers: 0,
        }
      );
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const topStats = useMemo(
    () => [
      { label: "Videos", value: stats.totalVideos },
      { label: "Views", value: stats.totalViews },
      { label: "Watch Time", value: `${stats.totalWatchTime} sec` },
      { label: "Users", value: stats.totalUsers },
    ],
    [stats]
  );

  const filteredVideos = useMemo(() => {
    if (!searchQuery) return videos;
    return videos.filter((v) =>
      v.title?.toLowerCase().includes(searchQuery) ||
      v.description?.toLowerCase().includes(searchQuery) ||
      v.category?.toLowerCase().includes(searchQuery)
    );
  }, [videos, searchQuery]);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.layout}>
        <div style={styles.sidebarWrap}>
          <Sidebar />
        </div>

        <main style={styles.content}>
          <section style={styles.hero}>
            <div style={styles.heroLeft}>
              <img src={ssrLogo} alt="SSR Logo" style={styles.logo} />

              <div>
                <p style={styles.heroTag}>SSR Media Platform</p>
                <h1 style={styles.heroTitle}>Welcome back</h1>
                <p style={styles.heroText}>
                  Manage uploads, stream content, monitor views, and analyze
                  watch time with your own branded video platform.
                </p>
              </div>
            </div>

            <div style={styles.heroActions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => navigate("/dashboard")}
              >
                Open Dashboard
              </button>
              <button
                style={styles.primaryBtn}
                onClick={() => navigate("/upload")}
              >
                Upload Video
              </button>
            </div>
          </section>

          <section style={styles.statsGrid}>
            {topStats.map((item) => (
              <div key={item.label} style={styles.statCard}>
                <p style={styles.statLabel}>{item.label}</p>
                <h3 style={styles.statValue}>{item.value}</h3>
              </div>
            ))}
          </section>

          <section style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Latest Videos</h2>
              <p style={styles.sectionSubtext}>
                Browse uploaded videos in your SSR platform
              </p>
            </div>
          </section>

          {loading ? (
            <div style={styles.emptyBox}>Loading videos...</div>
          ) : filteredVideos.length === 0 ? (
            <div style={styles.emptyBox}>No videos found.</div>
          ) : (
            <section style={styles.videoGrid}>
              {filteredVideos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </section>
          )}
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
  sidebarWrap: {
    display: "block",
  },
  content: {
    flex: 1,
    padding: "24px",
  },
  hero: {
    background:
      "linear-gradient(135deg, rgba(212,175,55,0.14), rgba(56,189,248,0.08))",
    border: "1px solid #1f2a40",
    borderRadius: "24px",
    padding: "28px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },
  logo: {
    width: "84px",
    height: "84px",
    objectFit: "contain",
    borderRadius: "16px",
  },
  heroTag: {
    margin: 0,
    color: "#d4af37",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  heroTitle: {
    margin: "10px 0 0",
    fontSize: "40px",
    lineHeight: 1.1,
  },
  heroText: {
    marginTop: "12px",
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: 1.7,
    maxWidth: "720px",
  },
  heroActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    background: "#d4af37",
    color: "#111827",
    border: "none",
    padding: "13px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
  },
  secondaryBtn: {
    background: "#172033",
    color: "#fff",
    border: "1px solid #334155",
    padding: "13px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#111827",
    border: "1px solid #1f2a40",
    borderRadius: "18px",
    padding: "18px 20px",
  },
  statLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },
  statValue: {
    margin: "10px 0 0",
    fontSize: "30px",
    fontWeight: "700",
    color: "#fff",
  },
  sectionHeader: {
    marginBottom: "18px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "28px",
  },
  sectionSubtext: {
    marginTop: "8px",
    color: "#94a3b8",
    fontSize: "14px",
  },
  videoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px 16px",
  },
  emptyBox: {
    background: "#111827",
    border: "1px solid #1f2a40",
    borderRadius: "16px",
    padding: "28px",
    color: "#b3b3b3",
    textAlign: "center",
  },
};