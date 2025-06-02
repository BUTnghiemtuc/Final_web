const express = require("express");
const multer = require("multer");
const path = require("path");
const Photo = require("../db/photoModel");

const router = express.Router();

// Cấu hình nơi lưu trữ ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// API POST /upload
router.post("/", upload.single("photo"), async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "Chưa đăng nhập" });

  try {
    const newPhoto = new Photo({
      file_name: req.file.filename,
      user_id: req.session.user._id,
      date_time: new Date()
    });

    await newPhoto.save();
    res.status(201).send({ message: "Ảnh đã lưu", photo: newPhoto });
  } catch (err) {
    res.status(500).send({ error: "Lỗi server khi lưu ảnh" });
  }
});

module.exports = router;
