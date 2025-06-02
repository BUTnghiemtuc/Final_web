const express = require("express");
const router = express.Router();
const User = require("../db/userModel");

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const existing = await User.findOne({ login_name: req.body.login_name });
    if (existing) return res.status(400).send({ error: "Tên đăng nhập đã tồn tại" });

    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).send({ error: "Lỗi server khi đăng ký" });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  const { login_name, password } = req.body;

  const user = await User.findOne({ login_name });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
  }

  req.session.user = {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name
  };

  res.json(req.session.user);
});

// Đăng xuất
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.send({ message: "Đã đăng xuất" });
});

module.exports = router;
