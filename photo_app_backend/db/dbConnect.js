const mongoose = require("mongoose");
require("dotenv").config();

function dbConnect() {
  mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/photoapp")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });
}

module.exports = dbConnect;
