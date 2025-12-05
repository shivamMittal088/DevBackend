const express = require("express");
const userAuth= require("../middlewares/userAuth");
const { Chat } = require("../models/chat");
const User = require("../models/user")
const chatRouter = express.Router();
const connectionRequest = require("../models/connectionRequest");
const mongoose = require("mongoose");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

   // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  // Ensure user exists
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ error: "User not found" });
  }

  // Prevent chatting with yourself
  if (String(targetUserId) === String(req.user._id)) {
    return res.status(400).json({ error: "Cannot chat with yourself" });
  }

  const connection = await connectionRequest.findOne({
  $or: [
    { fromUserId: req.user._id, toUserId: targetUserId, status: "accepted" },
    { fromUserId: targetUserId, toUserId: req.user._id, status: "accepted" },
  ]
});

if (!connection) {
  return res.status(403).json({ error: "You are not connected with this user" });
}


  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error(err);
  }
});

module.exports = chatRouter;