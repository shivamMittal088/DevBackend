const userAuth = require("../middlewares/userAuth");
const express = require("express");
const app = express();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password -__v");

    res.send(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});




profileRouter.patch("/profile/edit" , userAuth , async (req,res)=>{
    try{
        const {firstName , lastName ,gender ,age ,bio ,skills ,profileURL } = req.body;
        // we does not want that anybody will change email id 
        // and their is a special way to change password 
        // we can never rely on data coming in request body .

        const loggedInUser = req.user;
        Object.keys(req.body).forEach(
            (key)=>{
                loggedInUser[key] = req.body[key]
            }
        )

        await loggedInUser.save();


        res.json(
            {
                message : `${loggedInUser.firstName} Profile Updated Successfully`,
                data : req.user,
            }
        )
    }
    catch(err){
        res.status(401).send(err);
    }
})



// Forgot password API .
profileRouter.patch("/profile/password", userAuth , async (req,res)=>{
    try{
        const { currentPassword , newPassword ,confirmPassword } = req.body;

        if( newPassword != confirmPassword ){
            res.send("Invalid Credentials");
        }


        const loggedInUser = req.user;

        const isMatch = await bcrypt.compare(currentPassword , loggedInUser.password)
        if(!isMatch){
            res.send("Invalid Credentials")
        }

        // first encrypting password .
        const saltedRound = 10;
        const hashPassword = await bcrypt.hash(newPassword,saltedRound)
        loggedInUser.password = hashPassword;

         // Optional: track password change time to invalidate old JWTs by checking iat < passwordChangedAt in userAuth
        loggedInUser.passwordChangedAt = new Date();

        await loggedInUser.save();
        res.send("Password Updted successfully with password " + newPassword);


    }
    catch(err){
        res.send("error message : " + err);
    }



})


module.exports = profileRouter