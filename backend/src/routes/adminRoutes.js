const express = require("express");
const router = express.Router();

const {
  getAdminStats,
  getAdminVideos,
  getAdminUsers,
  getAdminTopVideo,
  getRecentUsers
} = require("../controllers/adminController");

router.get("/stats", getAdminStats);
router.get("/videos", getAdminVideos);
router.get("/users", getAdminUsers);
router.get("/top-video", getAdminTopVideo);
router.get("/recent-users", getRecentUsers);

module.exports = router;