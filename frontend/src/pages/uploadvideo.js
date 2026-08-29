import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVideo } from "../services/videoServices";
import Navbar from "../components/navbar";

export default function UploadVideo() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    uploadedBy: "",
    video: null,
    thumbnail: null,
  });

  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files && files[0] ? files[0] : null;

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    if (name === "video" && file) {
      setVideoPreview(URL.createObjectURL(file));
    }

    if (name === "thumbnail" && file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      uploadedBy: "",
      video: null,
      thumbnail: null,
    });
    setVideoPreview("");
    setThumbnailPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.video ||
      !formData.thumbnail
    ) {
      setError("Please fill all required fields and select both files.");
      return;
    }

    try {
      setLoading(true);

      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("category", formData.category);
      uploadData.append("uploadedBy", formData.uploadedBy);
      uploadData.append("video", formData.video);
      uploadData.append("thumbnail", formData.thumbnail);

      const response = await createVideo(uploadData);

      setMessage(response.message || "Video uploaded successfully!");
      resetForm();

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.card}>
        <h2 style={styles.heading}>Upload Video</h2>
        <p style={styles.subText}>Upload a video file and thumbnail image</p>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter video description"
              rows="4"
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Movie / Series / Sports / Kids"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Uploaded By</label>
            <input
              type="text"
              name="uploadedBy"
              value={formData.uploadedBy}
              onChange={handleChange}
              placeholder="Admin name"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Video File *</label>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
              style={styles.input}
            />
            {videoPreview && (
              <video controls style={styles.previewVideo}>
                <source src={videoPreview} />
              </video>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Thumbnail Image *</label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.input}
            />
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                style={styles.previewImage}
              />
            )}
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "760px",
    background: "#181818",
    margin: "0 auto",
    padding: "28px",
    borderRadius: "18px",
    border: "1px solid #2a2a2a",
  },
  heading: {
    marginBottom: "8px",
    fontSize: "28px",
    color: "#fff",
  },
  subText: {
    marginBottom: "20px",
    color: "#a1a1aa",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "6px",
    fontWeight: "600",
    color: "#fff",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #333",
    fontSize: "14px",
    outline: "none",
    background: "#111",
    color: "#fff",
  },
  textarea: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #333",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    background: "#111",
    color: "#fff",
  },
  button: {
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#ff0000",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  success: {
    background: "#052e16",
    color: "#86efac",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  error: {
    background: "#450a0a",
    color: "#fca5a5",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  previewImage: {
    marginTop: "12px",
    width: "220px",
    borderRadius: "10px",
    border: "1px solid #333",
  },
  previewVideo: {
    marginTop: "12px",
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #333",
  },
};