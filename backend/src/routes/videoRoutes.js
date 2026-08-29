const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getAllVideos,
  createVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  addView,
  addWatchTime
} = require("../controllers/videoController");

router.get("/", getAllVideos);

router.post(
  "/",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  createVideo
);

router.get("/:id", getVideoById);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);
router.post("/:id/view", addView);
router.post("/:id/watch", addWatchTime);

module.exports = router;