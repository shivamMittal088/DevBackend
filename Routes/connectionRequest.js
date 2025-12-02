const express = require("express");
const connectionRequestRouter = express.Router();

const connectionRequest = require("../models/connectionRequest");
const userAuth = require("../middlewares/userAuth");
const User = require("../models/user");
const { lastActive }= require("../middlewares/lastActive");

connectionRequestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  lastActive,
  async (req, res) => {
    try {
      // 1️⃣ Extract data
      const fromUserId = req.user._id; // logged-in user (sender)
      const toUserId = req.params.userId; // receiver
      const status = req.params.status;   // "interested" or "ignored"

      // 2️⃣ Validate status
      const ALLOWED_STATUS = ["interested", "ignored"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ message: "Invalid status type" });
      }

      // 3️⃣ Check if target user exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // 4️⃣ Prevent sending request to self
      if (fromUserId.equals(toUserId)) {
        return res
          .status(400)
          .json({ message: "Cannot send connection request to yourself" });
      }

      // 5️⃣ Check if request already exists (in either direction)
      const existingConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "connection request already exists" });
      }

      // 6️⃣ Create a new connection request
      const newRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const savedRequest = await newRequest.save();

      // 7️⃣ Success response
      res.status(200).json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data: savedRequest,
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);





connectionRequestRouter.patch("/request/review/:status/:requestId" , 
  userAuth ,
  lastActive,
  async (req,res)=>{
  try{
    const loggedInUser = req.user;
    const { status , requestId } = req.params;


  // API level validation .
  const ALLOWED_STATUS = [ "accepted" , "rejected" ];

  if(!ALLOWED_STATUS.includes(status)){
    res.send("Invalid status type :" + status);
  }

  // checking API request id is present in our DB or not .
  const user = connectionRequest.findOne(
    {
      fromUserId : requestId,
    }
  )

  if(!user){
    res.send("No such user exist with userId : " + requestId);
  }

  // if exist .
  // then review the request .
  let admin = await connectionRequest.findOne(
    {
      fromUserId : requestId,
      toUserId : loggedInUser._id,
      status : "interested",
    }
  )

  if(!admin){
    res.send("No request to review")
  }

  admin.status = status;
  const data = await admin.save();

  res.json({ message: "Connection request " + status, data });

  }
  catch(err){
    res.send("error message : " + err)
  }

})

module.exports = connectionRequestRouter;
