// middleware
const User = require("../models/user");

const lastActive = async (req, res, next) => {
  try {
    if (!req.user) return next();

    const now = new Date();
    req.user.lastActiveAt = now;
    req.user.lastActiveAt = now; // keeping same name for clarity — or remove duplicate assignment

    // if req.user is a mongoose document, this will work:
    if (typeof req.user.save === "function") {
      await req.user.save();
    } else {
      // fallback for plain object (optional)
      await User.findByIdAndUpdate(req.user._id, { $set: { lastActiveAt: now } }).exec();
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { lastActive };
