const mongoose = require("mongoose");
const { videos, getMongoConnected, generateId } = require("../config/inMemoryStore");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    views: {
      type: Number,
      default: 0,
    },
    watchTime: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: String,
      default: "admin",
    },
    category: {
      type: String,
      default: "General",
    },
  },
  { timestamps: true }
);

const RealVideoModel = mongoose.models.Video || mongoose.model("Video", videoSchema);

class MemoryVideoDoc {
  constructor(data) {
    this._id = data._id || generateId();
    this.title = data.title;
    this.description = data.description || "";
    this.videoUrl = data.videoUrl || data.video || "";
    this.thumbnail = data.thumbnail || "";
    this.views = Number(data.views) || 0;
    this.watchTime = Number(data.watchTime) || 0;
    this.uploadedBy = data.uploadedBy || "admin";
    this.category = data.category || "General";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  async save() {
    this.updatedAt = new Date();
    const existingIndex = videos.findIndex(v => String(v._id) === String(this._id));
    if (existingIndex >= 0) {
      videos[existingIndex] = { ...this };
    } else {
      videos.unshift({ ...this });
    }
    return this;
  }
}

class VideoProxy {
  constructor(data) {
    if (getMongoConnected()) {
      return new RealVideoModel(data);
    }
    return new MemoryVideoDoc(data);
  }

  static find(filter = {}) {
    if (getMongoConnected()) {
      return RealVideoModel.find(filter);
    }
    let items = [...videos];
    if (filter.category) {
      items = items.filter(v => v.category.toLowerCase() === filter.category.toLowerCase());
    }

    const createQueryChain = (currentItems) => {
      const p = Promise.resolve(currentItems.map(item => new MemoryVideoDoc(item)));
      p.sort = (sortObj = {}) => {
        const sorted = [...currentItems].sort((a, b) => {
          if (sortObj.createdAt === -1) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          if (sortObj.views === -1 && sortObj.watchTime === -1) {
            return (b.views + b.watchTime) - (a.views + a.watchTime);
          }
          if (sortObj.views === -1) {
            return (b.views || 0) - (a.views || 0);
          }
          return 0;
        });
        return createQueryChain(sorted);
      };
      p.limit = (n) => {
        return createQueryChain(currentItems.slice(0, n));
      };
      p.select = (fieldsStr) => {
        const fields = fieldsStr.split(" ").filter(Boolean);
        return Promise.resolve(
          currentItems.map(item => {
            const picked = { _id: item._id };
            fields.forEach(f => {
              picked[f] = item[f];
            });
            return picked;
          })
        );
      };
      return p;
    };

    return createQueryChain(items);
  }

  static findOne(filter = {}) {
    if (getMongoConnected()) {
      return RealVideoModel.findOne(filter);
    }
    let items = [...videos];
    const createQueryChain = (currentItems) => {
      const item = currentItems[0] ? new MemoryVideoDoc(currentItems[0]) : null;
      const p = Promise.resolve(item);
      p.sort = (sortObj = {}) => {
        const sorted = [...currentItems].sort((a, b) => {
          if (sortObj.views === -1) {
            return (b.views || 0) - (a.views || 0);
          }
          return 0;
        });
        return createQueryChain(sorted);
      };
      return p;
    };
    return createQueryChain(items);
  }

  static async findById(id) {
    if (getMongoConnected()) {
      return RealVideoModel.findById(id);
    }
    const item = videos.find(v => String(v._id) === String(id));
    return item ? new MemoryVideoDoc(item) : null;
  }

  static async findByIdAndDelete(id) {
    if (getMongoConnected()) {
      return RealVideoModel.findByIdAndDelete(id);
    }
    const index = videos.findIndex(v => String(v._id) === String(id));
    if (index === -1) return null;
    const [deleted] = videos.splice(index, 1);
    return new MemoryVideoDoc(deleted);
  }

  static async countDocuments(filter = {}) {
    if (getMongoConnected()) {
      return RealVideoModel.countDocuments(filter);
    }
    return videos.length;
  }
}

module.exports = VideoProxy;
