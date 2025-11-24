const mongoose = require("mongoose");
const validator = require("validator");

const ALLOWED_GENDERS = ["Male", "Female", "Other"];


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },

    lastName : {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },

    age: {
        type: Number,
        min: 18,
        max: 100,
    },

    gender: {
        type : String ,
        enum : {
            values : ALLOWED_GENDERS,
            message : "{VALUE} is not supported",
        },
    },

    // The enum restricts the field’s value to a predefined list of allowed options.
    // It acts as a built-in validator that ensures only specific values can be saved in MongoDB for that field.
    // message → Custom error message when validation fails.

    bio: {
        type: String,
        trim : true,
        maxlength: 200,
    },

    skills : {
        type: [String],
        maxlength : 50,
    },

    emailId : {
        type: String,
        required: true,
        unique: true,
        trim : true,
        lowercase : true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid Email type");
            }
        }
    },

    password : {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 100,
        // No need to trim password , because during hashing spaces are also counted
        validate : {
            validator : (value)=>{
                validator.isStrongPassword(value, {
                    minLength : 6,
                    minLowercase : 1,
                    minUppercase : 1,
                    minNumbers : 1,
                    minSymbols : 1,
                });
            }
        },
        message : 'Password must include upper, lower, number (min length 6).',
    },

    photoURL: {
        type: String,
        // validate(value) {
        //     if(value && !validator.isURL(value)){
        //         throw new Error("Invalid URL");
        //     }
        // }
    },

    lastLoginAt : {
        type : Date,
    },

    countStreak : {
        type : Number,
        default : 0,
    }

}, 
{ timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;