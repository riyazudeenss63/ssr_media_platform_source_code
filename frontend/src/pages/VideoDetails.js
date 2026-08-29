import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getVideoById,
  getAllVideos,
  addView,
  addWatchTime,
} from "../services/videoServices";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import VideoCard from "../components/videocard";

const BASE_URL = process.env.REACT_APP_API_URL || "";

export default function VideoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const videoRef = useRef(null);
  const hasAddedViewRef = useRef(false);
  const lastTrackedTimeRef = useRef(0);
  const pendingWatchTimeRef = useRef(0);

  const fetchVideoDetails = useCallback(async () => {
    try {
      setLoading(true);

      const [videoData, allVideos] = await Promise.all([
        getVideoById(id),
        getAllVideos(),
      ]);

      setVideo(videoData);
      setVideos(
        Array.isArray(allVideos) ? allVideos.filter((v) => v._id !== id) : []
      );
    } catch (error) {
      console.error("Error loading video:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const flushWatchTime = useCallback(async () => {
    try {
      const seconds = Math.floor(pendingWatchTimeRef.current);
      if (seconds > 0) {
        await addWatchTime(id, seconds);
        pendingWatchTimeRef.current = 0;
        await fetchVideoDetails();
      }
    } catch (error) {
      console.error("Error updating watch time:", error);
    }
  }, [id, fetchVideoDetails]);

  useEffect(() => {
    fetchVideoDetails();
  }, [fetchVideoDetails]);

  useEffect(() => {
    return () => {
      flushWatchTime();
    };
  }, [flushWatchTime]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      lastTrackedTimeRef.current = videoRef.current.currentTime || 0;
    }
  };

  const handlePlay = async () => {
    try {
      if (!hasAddedViewRef.current) {
        await addView(id);
        hasAddedViewRef.current = true;
        await fetchVideoDetails();
      }
    } catch (error) {
      console.error("Error adding view:", error);
    }
  };

  const handleTimeUpdate = () => {
    const player = videoRef.current;
    if (!player) return;

    const currentTime = player.currentTime || 0;
    const diff = currentTime - lastTrackedTimeRef.current;

    if (diff > 0 && diff < 5) {
      pendingWatchTimeRef.current += diff;
    }

    lastTrackedTimeRef.current = currentTime;
  };

  const handlePause = async () => {
    await flushWatchTime();
  };

  const handleEnded = async () => {
    await flushWatchTime();
  };

  const videoUrl = useMemo(() => {
    if (!video?.video && !video?.videoUrl) return "";

    const rawPath = video.video || video.videoUrl;
    const cleanPath = String(rawPath).replace(/\\/g, "/");

    if (cleanPath.startsWith("http")) return cleanPath;
    if (cleanPath.startsWith("/")) return `${BASE_URL}${cleanPath}`;
    return `${BASE_URL}/${cleanPath}`;
  }, [video]);

  const thumbnailUrl = useMemo(() => {
    if (!video?.thumbnail) return "";

    const cleanPath = String(video.thumbnail).replace(/\\/g, "/");

    if (cleanPath.startsWith("http")) return cleanPath;
    if (cleanPath.startsWith("/")) return `${BASE_URL}${cleanPath}`;
    return `${BASE_URL}/${cleanPath}`;
  }, [video]);

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.layout}>
          <Sidebar />
          <div style={styles.loadingWrap}>Loading video...</div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.layout}>
          <Sidebar />
          <div style={styles.loadingWrap}>Video not found</div>
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
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            ← Back
          </button>

          <div style={styles.mainGrid}>
            <section style={styles.playerSection}>
              <div style={styles.videoWrapper}>
                <video
                  ref={videoRef}
                  controls
                  poster={thumbnailUrl}
                  style={styles.videoPlayer}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={handlePlay}
                  onTimeUpdate={handleTimeUpdate}
                  onPause={handlePause}
                  onEnded={handleEnded}
                >
                  <source src={videoUrl} />
                  Your browser does not support the video tag.
                </video>
              </div>

              <h1 style={styles.title}>{video.title}</h1>

              <div style={styles.metaRow}>
                <div style={styles.metaLeft}>
                  <span>{video.views || 0} views</span>
                  <span>•</span>
                  <span>{video.watchTime || 0} sec watch time</span>
                  <span>•</span>
                  <span>{video.category || "General"}</span>
                </div>

                <div style={styles.channelBox}>
                  By {video.uploadedBy || "Admin"}
                </div>
              </div>

              <div style={styles.descBox}>
                <p style={styles.descText}>
                  {video.description || "No description available"}
                </p>
              </div>
            </section>

            <aside style={styles.recommendSection}>
              <h3 style={styles.recommendTitle}>More from SSR</h3>

              <div style={styles.recommendList}>
                {videos.length === 0 ? (
                  <div style={styles.emptyRecommend}>No recommended videos.</div>
                ) : (
                  videos.map((item) => (
                    <VideoCard key={item._id} video={item} compact />
                  ))
                )}
              </div>
            </aside>
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
  loadingWrap: {
    flex: 1,
    padding: "24px",
    color: "#fff",
  },
  backBtn: {
    marginBottom: "16px",
    padding: "10px 16px",
    border: "1px solid #2f3b52",
    background: "#131c2e",
    color: "#fff",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "600",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(320px, 380px)",
    gap: "24px",
    alignItems: "start",
  },
  playerSection: {
    minWidth: 0,
  },
  videoWrapper: {
    width: "100%",
    background: "#000",
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid #1f2a40",
  },
  videoPlayer: {
    width: "100%",
    display: "block",
    maxHeight: "72vh",
    background: "#000",
  },
  title: {
    margin: "18px 0 0",
    fontSize: "28px",
    lineHeight: 1.35,
  },
  metaRow: {
    marginTop: "14px",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  metaLeft: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    color: "#c7d2fe",
    fontSize: "14px",
  },
  channelBox: {
    background: "#1a2540",
    padding: "10px 14px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "600",
  },
  descBox: {
    marginTop: "16px",
    background: "#111827",
    border: "1px solid #1f2a40",
    borderRadius: "18px",
    padding: "18px",
  },
  descText: {
    margin: 0,
    color: "#d1d5db",
    lineHeight: 1.7,
  },
  recommendSection: {
    background: "transparent",
  },
  recommendTitle: {
    marginTop: 0,
    marginBottom: "14px",
    fontSize: "20px",
  },
  recommendList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  emptyRecommend: {
    background: "#111827",
    border: "1px solid #1f2a40",
    borderRadius: "14px",
    padding: "18px",
    color: "#9ca3af",
  },
};