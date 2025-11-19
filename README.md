# DevTinder Backend (Node.js + Express + MongoDB)

A production-ready backend API for a Tinder-like app built with the **MERN** stack. This service powers features like user signup/login, profile management, connection requests, and a feed, with secure authentication and clean API design.
---

## ✨ Features

- **Auth**: Signup, Login with **hashed passwords (bcrypt)** and **JWT** issued as **HTTP-only cookies**.
- **Profile**: View & update profile, update password (with current-password check).
- **Connections**: Send/accept/ignore connection requests (`interested`, `ignored`) with validation to prevent self-requests and duplicates.
- **Feed**: Basic feed endpoint (filtering/pagination ready).
- **Security**: Input validation/sanitization, auth middleware, error handling.
- **DX**: Nodemon for dev, env-based config, modular route/controllers, Mongoose models with refs & middleware.

---

## 🧱 Tech Stack

- **Runtime**: Node.js (>= 18)
- **Framework**: Express.js
- **DB**: MongoDB + Mongoose
- **Auth**: JWT, HTTP-only cookies
- **Crypto**: bcrypt
- **Env**: dotenv
- **Utils**: cookie-parser, express-json

---

## 📁 Project Structure

```
src/
├─ app.js                 # App bootstrap & middlewares
├─ config/                # DB connection, constants
├─ middlewares/
│  └─ userAuth.js         # JWT auth (sets req.user)
├─ models/
│  ├─ user.js
│  └─ connectionRequest.js
├─ routes/
│  ├─ auth.js
│  ├─ profile.js
│  ├─ user.js
│  └─ connectionRequest.js
└─ ... (utils, validators, etc.)
```

---

<!-- ## ⚙️ Environment Variables

Create a `.env` file in the project root:

```
PORT=5555
MONGODB_URI=mongodb://127.0.0.1:27017/devtinder
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=1h
COOKIE_NAME=token
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173 -->
<!-- ```

--- -->

## 🚀 Getting Started

```bash
# 1) Install deps
npm install

# 2) Start MongoDB (local or Atlas)
#    For local: ensure mongod is running

npm run src/app.js   # e.g., nodemon src/app.js
---

## 📜 License

MIT © {Shivam Mittal}
