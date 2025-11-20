const mongoose = require("mongoose");
const User = require("./user");

const ALLOWED_STATUS = ["interested" , "ignored" ,"accepted" ,"rejected"];

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type :  mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },

    toUserId : {
        type :  mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },

    status : {
        type :  String,
        required : true,
        enum : {
            values : ALLOWED_STATUS,
            message : "{VALUE} is incoorect status type"
        },
        lowercase : true
    }

},{timestamps:true })

// It is a middleware .
connectionRequestSchema.pre("save",function (next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send request to yourself");
    }
    next();
})





const connectionRequest = new mongoose.model("connectionRequest",connectionRequestSchema)

module.exports = connectionRequest;