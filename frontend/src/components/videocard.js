import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "";

export default function VideoCard({ video, compact = false }) {
  const [imageError, setImageError] = useState(false);

  const thumbnailUrl = useMemo(() => {
    if (!video?.thumbnail) return "";

    const cleanPath = String(video.thumbnail).replace(/\\/g, "/");

    if (cleanPath.startsWith("http")) return cleanPath;
    if (cleanPath.startsWith("/")) return `${BASE_URL}${cleanPath}`;
    return `${BASE_URL}/${cleanPath}`;
  }, [video]);

  return (
    <Link
      to={`/video/${video._id}`}
      style={{
        ...styles.card,
        ...(compact ? styles.compactCard : {}),
      }}
    >
      <div
        style={{
          ...styles.thumbWrap,
          ...(compact ? styles.compactThumbWrap : {}),
        }}
      >
        {!imageError && thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={video?.title || "video thumbnail"}
            style={styles.thumbnail}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={styles.fallback}>No Thumbnail</div>
        )}
      </div>

      <div style={styles.content}>
        <h3
          style={{
            ...styles.title,
            ...(compact ? styles.compactTitle : {}),
          }}
        >
          {video?.title || "Untitled Video"}
        </h3>

        <p style={styles.channel}>{video?.uploadedBy || "Admin Channel"}</p>

        <p style={styles.meta}>
          {video?.views || 0} views • {video?.watchTime || 0} sec watch time
        </p>

        {!compact && (
          <div style={styles.bottomRow}>
            <span style={styles.category}>
              {video?.category || "General"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

const styles = {
  card: {
    textDecoration: "none",
    color: "#fff",
    display: "block",
    transition: "transform 0.2s ease",
  },
  compactCard: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
  },
  thumbWrap: {
    width: "100%",
    aspectRatio: "16 / 9",
    background: "#232323",
    borderRadius: "14px",
    overflow: "hidden",
  },
  compactThumbWrap: {
    width: "168px",
    minWidth: "168px",
    aspectRatio: "16 / 9",
    borderRadius: "12px",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  fallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    background: "#272727",
    fontWeight: "600",
  },
  content: {
    paddingTop: "10px",
  },
  title: {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.4,
    color: "#fff",
    fontWeight: "600",
  },
  compactTitle: {
    fontSize: "14px",
  },
  channel: {
    margin: "8px 0 0",
    color: "#a1a1aa",
    fontSize: "13px",
  },
  meta: {
    margin: "4px 0 0",
    color: "#9ca3af",
    fontSize: "12px",
    lineHeight: 1.5,
  },
  bottomRow: {
    marginTop: "10px",
  },
  category: {
    display: "inline-block",
    background: "#272727",
    color: "#e5e7eb",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },
};