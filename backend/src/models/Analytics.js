const mongoose = require("mongoose");
const { analytics, videos, getMongoConnected, generateId } = require("../config/inMemoryStore");

const analyticsSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    totalWatchTime: {
      type: Number,
      default: 0
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const RealAnalyticsModel = mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);

class MemoryAnalyticsDoc {
  constructor(data) {
    this._id = data._id || generateId();
    this.videoId = data.videoId;
    this.views = Number(data.views) || 0;
    this.totalWatchTime = Number(data.totalWatchTime) || 0;
    this.date = data.date ? new Date(data.date) : new Date();
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  async save() {
    this.updatedAt = new Date();
    const existingIndex = analytics.findIndex(a => String(a._id) === String(this._id));
    if (existingIndex >= 0) {
      analytics[existingIndex] = { ...this };
    } else {
      analytics.push({ ...this });
    }
    return this;
  }
}

class AnalyticsProxy {
  constructor(data) {
    if (getMongoConnected()) {
      return new RealAnalyticsModel(data);
    }
    return new MemoryAnalyticsDoc(data);
  }

  static async findOne(filter = {}) {
    if (getMongoConnected()) {
      return RealAnalyticsModel.findOne(filter);
    }
    const item = analytics.find(a => {
      if (filter.videoId && String(a.videoId) !== String(filter.videoId)) return false;
      if (filter.date) {
        const itemDate = new Date(a.date);
        if (filter.date.$gte && itemDate < new Date(filter.date.$gte)) return false;
        if (filter.date.$lt && itemDate >= new Date(filter.date.$lt)) return false;
      }
      return true;
    });
    return item ? new MemoryAnalyticsDoc(item) : null;
  }

  static find(filter = {}) {
    if (getMongoConnected()) {
      return RealAnalyticsModel.find(filter);
    }
    let items = [...analytics];
    if (filter.videoId) {
      items = items.filter(a => String(a.videoId) === String(filter.videoId));
    }

    const createQueryChain = (currentItems) => {
      const p = Promise.resolve(currentItems.map(item => new MemoryAnalyticsDoc(item)));
      p.sort = (sortObj = {}) => {
        const sorted = [...currentItems].sort((a, b) => {
          if (sortObj.views === -1) {
            return (b.views || 0) - (a.views || 0);
          }
          if (sortObj.totalWatchTime === -1) {
            return (b.totalWatchTime || 0) - (a.totalWatchTime || 0);
          }
          return 0;
        });
        return createQueryChain(sorted);
      };
      p.limit = (n) => {
        return createQueryChain(currentItems.slice(0, n));
      };
      p.populate = (popField) => {
        if (popField === "videoId") {
          return Promise.resolve(
            currentItems.map(item => {
              const matchedVideo = videos.find(v => String(v._id) === String(item.videoId));
              return {
                ...item,
                videoId: matchedVideo ? { ...matchedVideo } : null
              };
            })
          );
        }
        return Promise.resolve(currentItems);
      };
      return p;
    };

    return createQueryChain(items);
  }

  static async aggregate(pipeline = []) {
    if (getMongoConnected()) {
      return RealAnalyticsModel.aggregate(pipeline);
    }

    let result = [...analytics];

    for (const stage of pipeline) {
      if (stage.$match) {
        if (stage.$match.date && stage.$match.date.$gte) {
          const minDate = new Date(stage.$match.date.$gte);
          result = result.filter(r => new Date(r.date) >= minDate);
        }
      }
      if (stage.$group) {
        const groups = {};
        for (const item of result) {
          const d = new Date(item.date);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (!groups[dateStr]) {
            groups[dateStr] = { _id: dateStr, views: 0, watchTime: 0 };
          }
          groups[dateStr].views += item.views || 0;
          groups[dateStr].watchTime += item.totalWatchTime || 0;
        }
        result = Object.values(groups);
      }
      if (stage.$sort) {
        if (stage.$sort._id === 1) {
          result.sort((a, b) => a._id.localeCompare(b._id));
        } else if (stage.$sort._id === -1) {
          result.sort((a, b) => b._id.localeCompare(a._id));
        }
      }
    }

    return result;
  }
}

module.exports = AnalyticsProxy;
