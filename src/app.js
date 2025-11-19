const express = require("express");
const { connectDB } = require("../config/database");
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

const port = 5555;


// Importing Routes .
const authRouter = require("../Routes/auth");
const profileRouter = require("../Routes/profile");
const connectionRequest = require("../Routes/connectionRequest");
const userRouter = require("../Routes/user");


// global middlewares .
app.use(express.json()) // <-- parses application/json
// It is a middlewre that helps us to parse the incoming request body in JSON format.
app.use(cookieParser()); // <-- parses cookies from incoming requests
app.use(cors({
  origin: 'http://localhost:3000', // frontend url
  credentials: true, // to allow cookies to be sent
}))




app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/",connectionRequest);
app.use("/",userRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(5555, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed");
  });
