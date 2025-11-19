const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userAuth = require("../middlewares/userAuth");




authRouter.post("/signup", async (req, res) => {
  try {
    const { emailId, password, firstName, lastName, age, gender ,photoURL ,bio} = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    // console.log(hashPassword);

    // creating new instance of User model
    const newUser = new User({
      emailId,
      password: hashPassword,
      firstName,
      lastName,
      age,
      gender,
      photoURL,
      bio,
    });

    // saving user to database
    const savedUser = await newUser.save(); // generally all mongoose operations are async in nature

    // we want to create a jwt token for the user
    // to increase security , otherwise anyone can access our API's without even logging in .

    // this function helps us create a jwt token
    // It contains three arguments
    // 1. payload → data we want to store inside the token
    // 2. secret key → used to sign the token (should be kept secret and not exposed publicly)
    // 3. options → additional settings for the token, such as expiration time
    const token = jwt.sign(
      {_id: savedUser._id,},
      "MySecretKey",
      {expiresIn: "1h",}
    );

    // sending response back to client
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    // console.log("Token created:", token);
    // console.log("Cookie set with token",req.cookies);
    // console.log("Hello");

    res.send("user signed up successfully");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});









authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // find user by emailId
    const user = await User.findOne({
      emailId: emailId,
    });

    if (!user) {
      return res.status(400).send({
        message: "Invalid credentials",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {_id: user._id, },
      "MySecretKey",
      {expiresIn: "1h",}
    );

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    req.user = user._id;
    console.log(user);
    res.send(user);

    // If we want to send multiple things in response , we can send json object
    // In json object their is only one message key and one data key
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});





authRouter.post("/logout", userAuth ,(req,res)=>{
  const user = req.user;
  // console.log(user);

  res.cookie(
    "token" , null , {
      expires : new Date(Date.now())
    }
  )
  res.send("logout successfully");
})









module.exports = authRouter;

// in router we need to paas middleware as a callback function , hence we need to export userAuth
// as a function not as an object .
