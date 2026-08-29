const User = require("../models/User");
const Video = require("../models/Video");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVideos = await Video.countDocuments();

    const videos = await Video.find();

    const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
    const totalWatchTime = videos.reduce((sum, v) => sum + v.watchTime, 0);

    const premiumUsers = await User.countDocuments({ subscription: "Premium" });
    const freeUsers = await User.countDocuments({ subscription: "Free" });

    res.json({
      totalUsers,
      totalVideos,
      totalViews,
      totalWatchTime,
      premiumUsers,
      freeUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminVideos = async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
};

const getAdminUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const getAdminTopVideo = async (req, res) => {
  const video = await Video.findOne().sort({ views: -1 });

  if (!video) {
    return res.status(404).json({ message: "No videos available" });
  }

  res.json(video);
};

const getRecentUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(5);
  res.json(users);
};

module.exports = {
  getAdminStats,
  getAdminVideos,
  getAdminUsers,
  getAdminTopVideo,
  getRecentUsers
};