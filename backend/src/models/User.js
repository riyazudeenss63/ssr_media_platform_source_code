const mongoose = require("mongoose");
const { users, getMongoConnected, generateId } = require("../config/inMemoryStore");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subscription: {
    type: String,
    enum: ["Free", "Premium"],
    default: "Free"
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

const RealUserModel = mongoose.models.User || mongoose.model("User", userSchema);

class MemoryUserDoc {
  constructor(data) {
    this._id = data._id || generateId();
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.subscription = data.subscription || "Free";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  async save() {
    this.updatedAt = new Date();
    const existingIndex = users.findIndex(u => String(u._id) === String(this._id));
    if (existingIndex >= 0) {
      users[existingIndex] = { ...this };
    } else {
      users.push({ ...this });
    }
    return this;
  }
}

class UserProxy {
  constructor(data) {
    if (getMongoConnected()) {
      return new RealUserModel(data);
    }
    return new MemoryUserDoc(data);
  }

  static async find(filter = {}) {
    if (getMongoConnected()) {
      return RealUserModel.find(filter);
    }
    let res = [...users];
    if (filter.subscription) {
      res = res.filter(u => u.subscription === filter.subscription);
    }
    const createQueryChain = (items) => {
      const p = Promise.resolve(items.map(i => ({ ...i })));
      p.sort = (sortObj) => {
        if (sortObj && sortObj.createdAt === -1) {
          items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return createQueryChain(items);
      };
      p.limit = (n) => {
        return createQueryChain(items.slice(0, n));
      };
      p.select = (fields) => {
        if (fields === "-password") {
          return Promise.resolve(items.map(({ password, ...rest }) => rest));
        }
        return Promise.resolve(items);
      };
      return p;
    };
    return createQueryChain(res);
  }

  static async findOne(filter = {}) {
    if (getMongoConnected()) {
      return RealUserModel.findOne(filter);
    }
    const item = users.find(u => {
      if (filter.email && u.email.toLowerCase() !== filter.email.toLowerCase()) return false;
      if (filter._id && String(u._id) !== String(filter._id)) return false;
      return true;
    });
    if (!item) return null;
    return new MemoryUserDoc(item);
  }

  static findById(id) {
    if (getMongoConnected()) {
      return RealUserModel.findById(id);
    }
    const item = users.find(u => String(u._id) === String(id));
    const doc = item ? new MemoryUserDoc(item) : null;
    const p = Promise.resolve(doc);
    p.select = (fields) => {
      if (!doc) return Promise.resolve(null);
      if (fields === "-password") {
        const { password, ...rest } = doc;
        return Promise.resolve(rest);
      }
      return Promise.resolve(doc);
    };
    return p;
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    if (getMongoConnected()) {
      return RealUserModel.findByIdAndUpdate(id, updateData, options);
    }
    const index = users.findIndex(u => String(u._id) === String(id));
    if (index === -1) return null;
    users[index] = { ...users[index], ...updateData, updatedAt: new Date() };
    return new MemoryUserDoc(users[index]);
  }

  static async findByIdAndDelete(id) {
    if (getMongoConnected()) {
      return RealUserModel.findByIdAndDelete(id);
    }
    const index = users.findIndex(u => String(u._id) === String(id));
    if (index === -1) return null;
    const [deleted] = users.splice(index, 1);
    return new MemoryUserDoc(deleted);
  }

  static async countDocuments(filter = {}) {
    if (getMongoConnected()) {
      return RealUserModel.countDocuments(filter);
    }
    let count = users.length;
    if (filter.subscription) {
      count = users.filter(u => u.subscription === filter.subscription).length;
    }
    return count;
  }
}

module.exports = UserProxy;
