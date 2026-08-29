const multer = require("multer");
const path = require("path");
const fs = require("fs");

const thumbnailDir = path.join(__dirname, "../../uploads/thumbnails");
const videoDir = path.join(__dirname, "../../uploads/videos");

fs.mkdirSync(thumbnailDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "thumbnail") {
      cb(null, thumbnailDir);
    } else if (file.fieldname === "video") {
      cb(null, videoDir);
    } else {
      cb(new Error("Invalid file field name"));
    }
  },

  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = Date.now() + "-" + safeName;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const imageTypes = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
  const videoTypes = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"];

  if (file.fieldname === "thumbnail" && imageTypes.includes(ext)) {
    cb(null, true);
  } else if (file.fieldname === "video" && videoTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type for field: " + file.fieldname), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit
});

module.exports = upload;
