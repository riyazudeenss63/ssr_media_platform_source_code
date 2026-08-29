const Video = require("../models/Video");

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVideo = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { title, description, category, uploadedBy } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile || !thumbnailFile) {
      return res.status(400).json({
        message: "Video and thumbnail are required"
      });
    }

    const video = new Video({
      title,
      description: description || "",
      category: category || "General",
      uploadedBy: uploadedBy || "admin",
      videoUrl: `/uploads/videos/${videoFile.filename}`,
      thumbnail: `/uploads/thumbnails/${thumbnailFile.filename}`,
    });

    const savedVideo = await video.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      video: savedVideo,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Update text fields
    const { title, description, category, uploadedBy } = req.body;

    if (title) video.title = title;
    if (description) video.description = description;
    if (category) video.category = category;
    if (uploadedBy) video.uploadedBy = uploadedBy;

    // Update video file if uploaded
    if (req.files && req.files.video) {
      video.videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
    }

    // Update thumbnail if uploaded
    if (req.files && req.files.thumbnail) {
      video.thumbnail = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    }

  const updatedVideo = await video.save();

    res.status(200).json(updatedVideo);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const deletedVideo = await Video.findByIdAndDelete(req.params.id);

    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addView = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.views += 1;
    await video.save();

    res.status(200).json({ message: "View added", views: video.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addWatchTime = async (req, res) => {
  try {
    const { watchTime } = req.body;

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.watchTime += Number(watchTime || 0);
    await video.save();

    res.status(200).json({
      message: "Watch time updated",
      watchTime: video.watchTime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllVideos,
  createVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  addView,
  addWatchTime,
};