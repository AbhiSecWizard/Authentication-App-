require("dotenv").config();
const path = require("path");
const _dirname = path.resolve();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/mongodb");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

const app = express();
const port = process.env.PORT || 5000;

// ✅ DB Connect
connectDB();

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Dynamic CORS (dev + prod)
const allowedOrigins = [
  "https://authentication-app-5-1icl.onrender.com",
  process.env.CLIENT_URL, // production client URL
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ API Routes FIRST
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ Health route (optional)
app.get("/api/health", (req, res) => {
  res.send("API WORKING");
});

// ✅ Serve React build AFTER api routes
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
  });
}
// ✅ Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});