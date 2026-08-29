const express = require("express");
const router = express.Router();

const {
  getTotalViews,
  getTotalWatchTime,
  getTopVideo,
  getVideoAnalytics,
  trackVideo,
  getDashboard,
  getTrendingVideos,
  getMostWatchedVideos 
} = require("../controllers/analyticsController");

router.get("/views", getTotalViews);
router.get("/watchtime", getTotalWatchTime);
router.get("/top-video", getTopVideo);
router.get("/videos", getVideoAnalytics);
router.get("/dashboard", getDashboard);
router.get("/trending", getTrendingVideos);
router.get("/most-watched", getMostWatchedVideos);
router.post("/:id", trackVideo);



module.exports = router;