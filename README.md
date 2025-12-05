## API Endpoints

| Method | Endpoint                                      | Description                                      | Auth Required |
|--------|-----------------------------------------------|--------------------------------------------------|--------------|
| POST   | /signup                                       | Register a new user                              | No           |
| POST   | /login                                        | Login and get authentication token               | No           |
| POST   | /logout                                       | Logout user                                      | Yes          |
| GET    | /feed                                         | Fetch user feed / recommendations                | Yes          |
| PATCH  | /profile/edit                                 | Edit user profile                                | Yes          |
| PATCH  | /profile/password                             | Update user password                             | Yes          |
| GET    | /profile/view                                 | View own profile                                 | Yes          |
| GET    | /user/requests/received                       | Get received connection requests                 | Yes          |
| GET    | /user/connections                             | Get approved/connected users                     | Yes          |
| GET    | /user/mutualConnections                       | Get list of mutual connections                   | Yes          |
| POST   | /request/send/:status/:userId                 | Send connection request                          | Yes          |
| PATCH  | /request/review/:status/:requestId            | Review (accept/reject) a connection request      | Yes          |
| GET    | /webChat/:targetUserId                        | Get chat messages with a specific user           | Yes          |



## FOLDER Structure

```
DevBackend/
├── Components/                 # Reusable backend components (streaks, badges, helpers)
│   └── StreakBadge.js          # Right now , not working .
│
├── config/                     # DB connections, environment configs
│   └── config.js
│
├── middlewares/                # Authentication, activity tracking
│   ├── lastActive.js
│   └── userAuth.js
│
├── models/                     # Mongoose models (DB schemas)
│   ├── chat.js
│   ├── connectionRequest.js
│   └── user.js
│
├── Routes/                     # API route handlers
│   ├── auth.js
│   ├── chat.js
│   ├── connectionRequest.js
│   ├── profile.js
│   └── user.js
│
├── src/                        # Main server logic
│   ├── app.js                  # Express app entry
│   └── socket.js               # Socket.IO setup
│
├── utils/                      # Utility functions (tokens, validations) 
│   └── *.js                    # Right now , blank file .
│
├── .env                        # Environment variables (not committed)
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

```





# 🗄️Database Schema

### User Schema
- _id (ObjectId, primary key)
- firstName (string, required)
- lastName (string)
- emailId (string, unique, required)
- password (string, hashed, required)
- skills (array of strings)
- age (number)
- gender (string: "Male" | "Female" | "Other")
- bio (string, optional)
- photoURL (string: base64 / image URL)
- countStreak (number, default: 0)
- lastLoginAt (timestamp)
- lastActiveAt (timestamp)
- createdAt (timestamp, auto-created)
- updatedAt (timestamp, auto-updated)
- __v (internal version key)


-------------------
### Connection Requests Schema
- _id (ObjectId, primary key)
- fromUserId (ObjectId → users._id, sender of the request)
- toUserId (ObjectId → users._id, receiver of the request)
- status (string: "interested" | "accepted" | "ignored")
- createdAt (timestamp, auto-created)
- updatedAt (timestamp, auto-updated)
- __v (internal version key)

---------------------------------------------

### Chats Collection Schema
- _id (ObjectId, primary key)
- participants (array of ObjectId → users._id)
- exactly 2 participants in a one-to-one chat
- messages (array of message objects)
- Each message contains:
  - senderId (ObjectId → users._id)
  - text (string)
  - _id (ObjectId)
  - createdAt (timestamp)
  - updatedAt (timestamp)
  - createdAt (timestamp, auto-created)
  - updatedAt (timestamp, auto-updated)
  - __v (internal version key)





