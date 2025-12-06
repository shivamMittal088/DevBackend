# DevTinder
- A developer matchmaking and networking backend built with Node.js and Express, featuring user authentication, connection requests, and real-time chat capabilities.

## Overview
---
- DevTinder is a RESTful API backend designed to help developers discover, connect, and communicate with each other.
- The backend provides secure user authentication using JWT tokens, a connection request workflow, real-time chat support, and a structured feed system for discovering new developers.
- It is fully integrated with MongoDB for data storage and can be extended to later by extensible features such as daily streak tracking, activity logs, and profile personalization
-----


## 🧰 Tech Stack
### Backend

- **Node.js** – JavaScript runtime for backend services
- **Express.js** – Lightweight framework for building REST APIs
- **MongoDB** – NoSQL database for storing users, chats, and connections
- **Mongoose** – Schema modeling for MongoDB
- **JWT** (JSON Web Tokens) – Secure authentication
- **bcrypt** – Password hashing

---------
### ☁️ Cloud & Deployment (AWS)

- **AWS EC2** – Hosts the backend server
- **PM2** – Process manager to keep Node.js running 24×7
  - Auto-restart on crash
  - Auto-start after reboot
  - Zero-downtime reloads
- **NGINX** – Reverse proxy for:
  - Routing traffic to Node.js backend
  - SSL termination (HTTPS)
  - Handling load efficiently
  - Serving static assets (optional)

------
### ⚡ Real-Time Communication
- **Socket.IO** (optional / planned)
- Live messaging

--------
### 🛠️ Development Tools

- **Nodemon** – Hot-reloading during development
- **Postman** - Client – API testing
- **MongoDB Compass** – GUI for exploring data
- **VS Code** – Primary development environment

------
### 🧬 Environment 

- **dotenv** – Environment variable management
- **npm** – Package manager
- **MongoDB Atlas** – (Optional) Cloud DB alternative

-----
### 🏗️ Software Architecture

- Modular folder structure (Routes, Models, Middlewares, Utils)
- RESTful API design
- Middleware-based authentication & authorization
- Timestamps & versioning included in schema


-------
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
├─Components/            # Reusable backend components (streaks, badges, helpers)
│
├─config/                # DB connections, environment configs
│  └─config.js
│
├─middlewares/           # Authentication, activity tracking
│  ├─lastActive.js
│  └─userAuth.js
│
├─models/                # Mongoose models (DB schemas)
│  ├─chat.js
│  ├─connectionRequest.js
│  └─user.js
│
├─Routes/                # API route handlers
│  ├─auth.js
│  ├─chat.js
│  ├─connectionRequest.js
│  ├─profile.js
│  └─user.js
│
├─src/                   # Main server logic
│ ├─app.js             # Express app entry
│ └─socket.js          # Socket.IO setup

```


## 🗄️Database Schema

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


---
## ⚙️ Setup Instructions

### 1. Clone the Repository
- git clone https://github.com/shivamMittal088/DevBackend
- cd DevBackend

### 2. Install Dependencies
npm install

### 3. Create .env File
- PORT=5555
- MONGODB_PASSWORD=your_mongodb_password
- JWT_SECRET=your_jwt_secret

### 4. Start Development Server
- npm run dev

#### Backend will run on:
- http://localhost:5555


## ✅ TODOs (Learning + Development Roadmap)

#### 🔹 Project Initialization

- Create a repository
- Initialize the repository
- Add node_modules, package.json, package-lock.json
- Install Express
- Create a server
- Listen to port 7777
- Write request handlers for /test, /hello
- Install nodemon & update scripts
- Understand dependencies
- Learn the use of -g in npm
- Learn difference between ^ and ~

---
#### 🔹 Git & GitHub
- Initialize Git
- Create .gitignore
- Create remote repo on GitHub
- Push code to origin

---
#### 🔹 Routing (Express)
- Play with routes: /hello, /, /xyz, /hello/2
- Understand route order importance
- Install Postman & test APIs
- Implement GET, POST, PATCH, DELETE
- Explore route modifiers (?, +, *, ())
- Use regex in routes (/a/, /.*fly$/)
- Read query params
- Read dynamic route params

----
#### 🔹 Middlewares
- Practice multiple route handlers & next()
- Learn app.use() vs app.all()
- Create dummy admin auth middleware
- Create dummy user-route middleware (except /user/login)
- Centralized error handling middleware

-----
#### 🔹 MongoDB + Mongoose
- Create a free MongoDB Atlas cluster
- Install Mongoose
- Connect application using connection string
- Call connectDB() before starting app
- Create user schema & user model
- POST /signup → Save data to D
- Test with Postman
- Handle errors with try/catch

-----
#### 🔹 JSON, Body Parsing, and Input Handling
- Learn JS object vs JSON
- Add express.json()
- Make signup API dynamic
- Handle duplicate emails with findOne()
- API: Get user by email
- API: GET /feed → fetch all user
- API: Get user by Id
- API: Delete use
- Patch vs Pu
- API: Update use
- Explore Mongoose model method
- Learn findOneAndUpdate option

--------
#### 🔹 Schema Validation + Sanitization
- Explore SchemaType option
- Add required, unique, lowercase, min, maxlength, trim, default
- Add custom validator for gender
- Add timestamps
- Validate Patch & Signup API's
- Install validator library
- Validate: password, email, photoURL
- NEVER TRUST req.body

-------
#### 🔹 Authentication
- Validate data in signup
- Install bcrypt
- Hash password with bcrypt.hash
- Create login API
- Compare password
- Install cookie-parser
- Send dummy cookie
- GET /profile → read cookies
- Install jsonwebtoken
- Create JWT token in login API
- Read token in profile API
- Create userAuth middleware
- Protect profile + connection request route
- JWT & cookie expiry = 7 day
- Add schema methods (getJWT(), comparePassword()

------
#### 🔹 DevTinder Feature
- Explore Tinder API
- List all APIs for DevTinde
- Group routes with express.Router(
- Create authRouter, profileRouter, requestRoute
- POST /logou
- PATCH /profile/edi
- PATCH /profile/passwor
- Validate all POST, PATCH API

------
#### 🔹 Connection Request
- Create ConnectionRequest schemA
- Build send-request API
- Proper data validation
- Handle all corner cases
- Use $or, $and queries
- Explore schema.pre("save")
- Learn indexing
- Understand compound indexes

----
#### 🔹 Review Requests + Connection
- Implement POST /request/review/:status/:requestId
- GET /user/requests/receives
- GET /user/connections
- Learn ref & populate

----
#### 🔹 Feed Algorithm
- Build logic for GET /feed
- Use $nin, $ne, $and
- Implement pagination



----
## 📜 License
- This project is licensed under the **MIT License**.  
- You are free to use, modify, and distribute this project with proper credit.
- The author and contributors are **not responsible for any damage, issues, or losses** caused by the use of this software.  

**Copyright (c) 2025 Shivam Mittal**







