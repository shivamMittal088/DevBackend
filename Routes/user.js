const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose");


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


    const page = parseInt( req.query.page ) || 1;
    let limit = parseInt( req.query.limit ) || 5;
    limit = limit > 5 ? 5 : limit;
    const skip = (page - 1) * limit ;


    // same filter used for both countDocuments() and find()
    const filter = {
      $or: [
        { fromUserId: id, status: "accepted" },
        { toUserId: id, status: "accepted" },
      ],
    };


    const connections = await connectionRequest
    .find(filter)
    .skip(skip)
    .limit(limit)
    .populate("fromUserId" ,fields)
    .populate("toUserId",fields)

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    const total = await connectionRequest.countDocuments(filter);

    const totalPages = total / limit ;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;


    res.status(200).json(
        {
            message : "user connections fetched successfully",
            page,
            limit,
            data : data,
            totalPages,
            hasNextPage,
            hasPrevPage,
            count : data.length,
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


userRouter.get("/user/mutualConnections/:otherId", userAuth , async(req,res)=>{

  try{
    const loggedInUser = req.user;
    const id = req.user._id;
    // console.log("loggedInUserID is :",id);
    const otherId = req.params.otherId;
    // console.log("other id is :",otherId);

      if (!otherId) return res.status(400).json({ error: "otherId required" });

    //  we will find all conections of admin and otherId
    const docsA = await connectionRequest.find(
      {
      status : "accepted",
        $or:[
          { fromUserId : id },
          { toUserId : id },
        ]
      } )

    const docsB = await connectionRequest.find(
      {
        status : "accepted",
        $or:[
          { fromUserId : otherId },
          { toUserId : otherId }
        ]
      } )

    // now need to find intersection of both friends list .
    // Intersection of friendsA and friendsB .

    // extract friend ID's for user A
    const friendsA = docsA.map((entity) => {
  if (entity.fromUserId.toString() === id.toString()) {
    return entity.toUserId.toString();  
  } else {
    return entity.fromUserId.toString();
  }
});


// extract friend ID's for user B
    const friendsB = docsB.map((entity) => {
  if (entity.fromUserId.toString() === otherId.toString()) {
    return entity.toUserId.toString();  
  } else {
    return entity.fromUserId.toString();
  }
});

// now need to take intersection of friendsA and friendsB
// we will iterate through smaller so that TC decreases .
let small = friendsA;
let large = new Set(friendsB);

if(friendsA.length > friendsB.length){
  small = friendsB;
  large = new Set(friendsA);
}


const mutualIDsSet = new Set();

// we have identified smaller and larger array .
 small.filter((entity)=>{
  if(large.has(entity)){
    mutualIDsSet.add(entity);
  }
})

const mutualIDs = Array.from(mutualIDsSet); // array of user id strings

const mutualIDUsers = await User.find(
  {
    _id: { $in: mutualIDs.map(id => new mongoose.Types.ObjectId(id)) },
  }
)

res.json(
  {
    message : "Mutual requests fetched successfully",
    length : mutualIDs.length,
    data : mutualIDUsers
  }
)


  }
  catch(err){
     console.error("mutualConnections error:", err);        // <-- log real error
    return res.status(500).json({ error: err.message || "Server error" }); // better feedback
  }
})

module.exports = userRouter;
