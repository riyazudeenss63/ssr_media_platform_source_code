const Video = require("../models/Video");
const User = require("../models/User");
const Analytics = require("../models/Analytics");

const getTotalViews = async (req, res) => {
  try {
    const videos = await Video.find();
    const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
    res.json({ totalViews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTotalWatchTime = async (req, res) => {
  try {
    const videos = await Video.find();
    const totalWatchTime = videos.reduce(
      (sum, v) => sum + (v.watchTime || 0),
      0
    );
    res.json({ totalWatchTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopVideo = async (req, res) => {
  try {
    const video = await Video.findOne().sort({ views: -1 });

    if (!video) {
      return res.status(404).json({ message: "No videos available" });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVideoAnalytics = async (req, res) => {
  try {
    const videos = await Video.find();

    const stats = videos.map((v) => ({
      id: v._id,
      title: v.title,
      views: v.views || 0,
      watchTime: v.watchTime || 0,
      avgWatchTime:
        v.views > 0 ? ((v.watchTime || 0) / v.views).toFixed(2) : 0,
    }));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackVideo = async (req, res) => {
  try {
    const { watchTime } = req.body;
    const videoId = req.params.id;

    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    let analytics = await Analytics.findOne({
      videoId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (!analytics) {
      analytics = new Analytics({
        videoId,
        views: 0,
        totalWatchTime: 0,
        date: today,
      });
    }

    analytics.views += 1;
    analytics.totalWatchTime += Number(watchTime) || 0;

    await analytics.save();

    res.json({
      message: "Analytics updated",
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const range = req.query.range || "28d";
    const totalVideos = await Video.countDocuments();
    const totalUsers = await User.countDocuments();

    const videos = await Video.find();

    const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalWatchTime = videos.reduce(
      (sum, v) => sum + (v.watchTime || 0),
      0
    );

    let days = 28;
    if (range === "7d") days = 7;
    if (range === "90d") days = 90;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - (days - 1));
    fromDate.setHours(0, 0, 0, 0);

    const viewsData = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: fromDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },
          views: { $sum: "$views" },
          watchTime: { $sum: "$totalWatchTime" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const viewsOverTime = {
      labels: viewsData.map((item) => item._id),
      views: viewsData.map((item) => item.views),
      watchTime: viewsData.map((item) => item.watchTime),
    };

    const topVideos = await Video.find()
      .sort({ views: -1, watchTime: -1 })
      .limit(5)
      .select("title views watchTime");

    res.json({
      totalVideos,
      totalUsers,
      totalViews,
      totalWatchTime,
      viewsOverTime,
      topVideos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrendingVideos = async (req, res) => {
  try {
    const trending = await Analytics.find()
      .sort({ views: -1 })
      .limit(5)
      .populate("videoId");

    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMostWatchedVideos = async (req, res) => {
  try {
    const mostWatched = await Analytics.find()
      .sort({ totalWatchTime: -1 })
      .limit(5)
      .populate("videoId");

    res.json(mostWatched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTotalViews,
  getTotalWatchTime,
  getTopVideo,
  getVideoAnalytics,
  trackVideo,
  getDashboard,
  getTrendingVideos,
  getMostWatchedVideos,
};