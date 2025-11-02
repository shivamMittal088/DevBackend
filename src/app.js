const express = require("express");
const { connectDB } = require("../config/database");
const cookieParser = require('cookie-parser');
const app = express();

const port = 5555;


// Importing Routes .
const authRouter = require("../Routes/auth");
const profileRouter = require("../Routes/profile");


// global middlewares .
app.use(express.json()) // <-- parses application/json
// It is a middlewre that helps us to parse the incoming request body in JSON format.
app.use(cookieParser()); // <-- parses cookies from incoming requests




app.use("/", authRouter);
app.use("/", profileRouter);

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
