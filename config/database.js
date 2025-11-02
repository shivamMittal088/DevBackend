const mongoose = require("mongoose");

const password = "pNwJsC1jP8KU2T6V"

const URI = `mongodb+srv://DEVTINDER:${password}@shivam.wk0c4nk.mongodb.net/DevTinderBackend`;

const connectDB = async()=>{
    try{
        await mongoose.connect(URI);
    }
    catch(err){
        console.log(err);
    }
}

module.exports = { connectDB };

