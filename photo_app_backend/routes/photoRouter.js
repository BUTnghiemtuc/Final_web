const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Photo = require("../db/photoModel.js");
const User = require("../db/userModel.js");

// GET: Danh sách ảnh của 1 user, bao gồm thông tin người bình luận
router.get("/photosOfUser/:id", async (req, res) => {
  try {
    const photos = await Photo.find({ user_id: req.params.id }).lean();

    // Lấy toàn bộ user_id trong comment
    const allUserIds = new Set();
    photos.forEach(photo => {
      (photo.comments || []).forEach(cmt => {
        if (cmt.user_id) allUserIds.add(cmt.user_id.toString());
      });
    });

    // Truy vấn thông tin user
    const users = await User.find({
      _id: { $in: [...allUserIds].map(id => new mongoose.Types.ObjectId(id)) }
    }).select("_id first_name last_name").lean();

    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    // Gắn thông tin user vào mỗi comment
    photos.forEach(photo => {
      photo.comments = photo.comments.map(cmt => {
        const uid = cmt.user_id?.toString();
        return {
          ...cmt,
          user: userMap[uid] || null
        };
      });
    });

    res.json(photos);
  } catch (err) {
    console.error("Lỗi GET /photosOfUser:", err);
    res.status(500).send("Lỗi server khi lấy ảnh.");
  }
});

// POST: Thêm bình luận vào ảnh
router.post("/comments/:photo_id", async (req, res) => {
  const { comment } = req.body;
  const user = req.session.user;
  if (!user) return res.status(401).send("Bạn cần đăng nhập để bình luận.");

  try {
    const photo = await Photo.findById(req.params.photo_id);
    if (!photo) return res.status(404).send("Ảnh không tồn tại.");

    photo.comments.push({
      comment,
      date_time: new Date(),
      user_id: new mongoose.Types.ObjectId(user._id)
    });

    await photo.save();
    res.status(200).send("Bình luận thành công!");
  } catch (err) {
    console.error("Lỗi POST /comments:", err);
    res.status(500).send("Lỗi server khi thêm bình luận.");
  }
});

module.exports = router;
