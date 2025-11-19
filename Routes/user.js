const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


const fields = "firstName lastName photoURL age gender bio skills";


userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // console.log(loggedInUser);
    const id = loggedInUser._id;

    const requests = await connectionRequest
      .find({
        status: "interested",
        toUserId: loggedInUser._id,
      })
      .populate("fromUserId", fields)
      .select("fromUser status")
    // populate is used to use fields and ref is used to make connections between two tables .

    console.log(requests);
    res.json({
      message: "All connection requests received Successfully",
      data: requests,
    });
  } 
  catch (err) {
    res.status(500).send("error Occured" + err);
  }
});






// get all the connections .
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try{
    const loggedInUser = req.user;
    const id = req.user._id;

    const connections = await connectionRequest.find(
        {
            $or : [
                {
                    fromUserId : id,
                    status : "accepted",
                },

                {
                    toUserId : id,
                    status : "accepted",
                }
            ]
        }
    )
    .populate("fromUserId" ,fields)
    .populate("toUserId",fields)

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });


    res.status(200).json(
        {
            message : "user connections fetched successfully",
            data : data,
        }
    )
  }
  catch(err){
    res.status(500).send("error occured" + err)
  }
});





userRouter.get("/feed", userAuth , async (req,res)=>{
    try{
        // 1. user does not see his own card .
    // 2. does not see cards of accepted , rejectd , ignored , interested .

    const loggedInUser = req.user;
    const id = req.user._id;

     const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;


    const connectionRequests = await connectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }
    ]   ,
    })
    .select("fromUserId  toUserId");


    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });


    const users = await User.find({
      $and: [
        { _id : { $nin: Array.from(hideUsersFromFeed) } },
        { _id : { $ne: loggedInUser._id } },
      ],
    })
      .select(fields)
      .skip(skip)
      .limit(limit);


      res.json({ data: users });
    }
    catch(err){
        res.send("error messge" + err)
    }

})

module.exports = userRouter;
