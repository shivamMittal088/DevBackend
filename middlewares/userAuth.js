const express = require('express');
const authRouter = express.Router();
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");


const userAuth = async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send({message : "No token found"});
        }
        const decodedObj = await jwt.verify(token,"MySecretKey");
        console.log("Decoded Object from token:",decodedObj);


        const {_id} = decodedObj;
        // attaching userId to request object
        // so that next middlewares or route handlers can access it
        // now we can easily identify the user making the request

        const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
    }
    catch(err){
        res.status(401).send(
            {
                message : "token not verified ",
                error : err.message,
            }
        );
    }
}

// we hve created a middleware function named userAuth
// this function will verify the jwt token sent by the client in cookies
// if token is valid , it will allow the request to proceed to next middleware or route handler
// otherwise it will send an error response indicating token verification failure

// now it will act as a middleware in routes where authentication is required and to get userId of logged in user

module.exports = userAuth;