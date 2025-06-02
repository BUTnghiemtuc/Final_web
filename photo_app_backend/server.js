const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const photoRouter = require("./routes/photoRouter");
const authRouter = require("./routes/authRouter");
const uploadRouter = require("./routes/uploadRouter");

const app = express();
const port = 3000;

// CORS cho frontend
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

// Kết nối MongoDB
mongoose.connect("mongodb://localhost/photoapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false
}));

app.use("/upload", uploadRouter);
app.use("/uploads", express.static("public/uploads")); // truy cập ảnh tĩnh

// Gắn router
app.use("/user", userRouter);
app.use("/photo", photoRouter);
app.use("/auth", authRouter);

// Test route
app.get("/", (req, res) => {
  res.send("🎉 Backend PhotoApp đang chạy...");
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
