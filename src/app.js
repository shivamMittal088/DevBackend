const express = require("express");
const { connectDB } = require("../config/database");
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
// const { startStreakBadge } = require('../Components/StreakBadge')
const http = require("http");
const { Chat } = require("../models/chat");

const port = process.env.PORT;

// Importing Routes .
const authRouter = require("../Routes/auth");
const profileRouter = require("../Routes/profile");
const connectionRequest = require("../Routes/connectionRequest");
const userRouter = require("../Routes/user");
const chatRouter = require("../Routes/chat");

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
app.use("/",chatRouter);



const server = http.createServer(app);
const socket = require("socket.io");


const io = socket(server,
  {
    cors : {
      origin : "http://localhost:3000"
    },
  }
);

console.log("--------------------------------------------------------------------------");

io.on("connection",(socket)=>{
  console.log("socket connected");

  socket.on("joinChat", ( {firstName ,targetUserId , loggedInUserId} )=>{
    const roomId = [loggedInUserId,targetUserId].sort().join("_");
    console.log(firstName + " joining Room",roomId);
    socket.join(roomId);
  })

  socket.on(
      "sendMessage",
      async ({ firstName, lastName, loggedInUserId, targetUserId, text }) => {
        // Save messages to the database
        try {
          const roomId = [loggedInUserId , targetUserId].sort().join("_");
          console.log(firstName + " " + lastName + " " + text);
          io.to(roomId).emit("messageReceived",{firstName , lastName ,text});

          // saving this message to the database .
          let chat = await Chat.findOne({
            participants: { $all: [loggedInUserId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [loggedInUserId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: loggedInUserId,
            text,
          });

          await chat.save();

        }
        catch (err) {
          console.log(err);
        }
      }
      )

  socket.on("disconnect", () => {});

  
});

    







connectDB()
  .then(() => {
    console.log("Database connected successfully");
    // startStreakBadge();
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed");
  });
