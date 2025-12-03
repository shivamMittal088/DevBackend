const mongoose = require("mongoose");
require("dotenv").config(); 

const URI = `mongodb+srv://DEVTINDER:${process.env.MONGODB_PASSWORD}@shivam.wk0c4nk.mongodb.net/DevTinderBackend`;

const connectDB = async()=>{
    try{
        await mongoose.connect(URI);
    }
    catch(err){
        console.log(err);
    }
}

module.exports = { connectDB };

