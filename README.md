# 🧰 Tech Stack
### Backend

- Node.js – JavaScript runtime for backend services
- Express.js – Lightweight framework for building REST APIs
- MongoDB – NoSQL database for storing users, chats, and connections
- Mongoose – Schema modeling for MongoDB
- JWT (JSON Web Tokens) – Secure authentication
- bcrypt – Password hashing

---------
### ☁️ Cloud & Deployment (AWS)

- AWS EC2 – Hosts the backend server
- PM2 – Process manager to keep Node.js running 24×7
  - Auto-restart on crash
  - Auto-start after reboot
  - Zero-downtime reloads
- NGINX – Reverse proxy for:
  - Routing traffic to Node.js backend
  - SSL termination (HTTPS)
  - Handling load efficiently
  - Serving static assets (optional)

------
### ⚡ Real-Time Communication
- Socket.IO (optional / planned)
- Live messaging

--------
### 🛠️ Development Tools

- Nodemon – Hot-reloading during development
- Postman - Client – API testing
- MongoDB Compass – GUI for exploring data
- VS Code – Primary development environment

------
### 🧬 Environment 

- dotenv – Environment variable management
- npm – Package manager
- MongoDB Atlas – (Optional) Cloud DB alternative

-----
### 🏗️ Software Architecture

- Modular folder structure (Routes, Models, Middlewares, Utils)
- RESTful API design
- Middleware-based authentication & authorization
- Timestamps & versioning included in schema




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


-----------------------------
### Connection Requests Schema
------------------------------
- _id (ObjectId, primary key)
- fromUserId (ObjectId → users._id, sender of the request)
- toUserId (ObjectId → users._id, receiver of the request)
- status (string: "interested" | "accepted" | "ignored")
- createdAt (timestamp, auto-created)
- updatedAt (timestamp, auto-updated)
- __v (internal version key)

---------------------------------------------
### Chats Collection Schema
---------------------------------------------
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









