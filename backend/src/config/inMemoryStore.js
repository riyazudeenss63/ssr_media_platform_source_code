const bcrypt = require("bcryptjs");

let isMongoConnected = false;

function setMongoConnected(status) {
  isMongoConnected = !!status;
}

function getMongoConnected() {
  return isMongoConnected;
}

// In-Memory Collections
const defaultPasswordHash = bcrypt.hashSync("password123", 10);

const users = [
  {
    _id: "660000000000000000000001",
    name: "Admin User",
    email: "admin@ott.com",
    password: defaultPasswordHash,
    subscription: "Premium",
    createdAt: new Date(Date.now() - 30 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: "660000000000000000000002",
    name: "Riyazudeen",
    email: "riyaz@ott.com",
    password: defaultPasswordHash,
    subscription: "Free",
    createdAt: new Date(Date.now() - 15 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: "660000000000000000000003",
    name: "Demo Creator",
    email: "creator@ott.com",
    password: defaultPasswordHash,
    subscription: "Premium",
    createdAt: new Date(Date.now() - 5 * 86400000),
    updatedAt: new Date(),
  },
];

const videos = [
  {
    _id: "661000000000000000000001",
    title: "Big Buck Bunny - 4K Open Source Film",
    description: "A large and lovable rabbit deals with bullying forest creatures in this iconic open-source animation.",
    category: "Animation",
    uploadedBy: "Blender Foundation",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60",
    views: 1240,
    watchTime: 36200,
    createdAt: new Date(Date.now() - 3 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: "661000000000000000000002",
    title: "Elephants Dream - Sci-Fi Thriller",
    description: "The first open movie made with open-source tools exploring a strange machine world.",
    category: "Sci-Fi",
    uploadedBy: "Orange Studio",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60",
    views: 890,
    watchTime: 24500,
    createdAt: new Date(Date.now() - 5 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: "661000000000000000000003",
    title: "For Bigger Blazes - Action Showcase",
    description: "High-octane visual showcase highlighting dynamic camera angles and HDR color grading.",
    category: "Action",
    uploadedBy: "SSR Media",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1578836537282-3171d77f8632?w=800&auto=format&fit=crop&q=60",
    views: 2150,
    watchTime: 58200,
    createdAt: new Date(Date.now() - 7 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: "661000000000000000000004",
    title: "Tears of Steel - Cyberpunk VFX",
    description: "Set in a dystopian future exploring robotics, cybernetics, and visual effects.",
    category: "Sci-Fi",
    uploadedBy: "SSR Media",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=60",
    views: 1620,
    watchTime: 41200,
    createdAt: new Date(Date.now() - 10 * 86400000),
    updatedAt: new Date(),
  },
];

// Seed Analytics for the last 30 days
const analytics = [];
let analyticsIdCounter = 1;

for (let d = 27; d >= 0; d--) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - d);
  targetDate.setHours(12, 0, 0, 0);

  videos.forEach((vid, idx) => {
    const dailyViews = Math.floor(15 + Math.random() * 45 * (idx + 1));
    const dailyWatchTime = dailyViews * Math.floor(25 + Math.random() * 35);

    analytics.push({
      _id: `66200000000000000000${String(analyticsIdCounter++).padStart(4, "0")}`,
      videoId: vid._id,
      views: dailyViews,
      totalWatchTime: dailyWatchTime,
      date: targetDate,
      createdAt: targetDate,
      updatedAt: targetDate,
    });
  });
}

function generateId() {
  return (
    Math.floor(Date.now() / 1000).toString(16) +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
      .slice(0, 16)
  );
}

module.exports = {
  users,
  videos,
  analytics,
  setMongoConnected,
  getMongoConnected,
  generateId,
};
