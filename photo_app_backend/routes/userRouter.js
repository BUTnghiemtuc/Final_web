const express = require("express");
const router = express.Router();
const User = require("../db/userModel.js");

// GET /user/list - Trả về danh sách người dùng
router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.json(users);
  } catch (err) {
    res.status(500).send("Lỗi server khi lấy danh sách người dùng.");
  }
});

// GET /user/:id - Lấy thông tin chi tiết người dùng
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) return res.status(404).send("Không tìm thấy người dùng.");
    res.json(user);
  } catch (err) {
    res.status(500).send("Lỗi server khi lấy người dùng.");
  }
});

module.exports = router;