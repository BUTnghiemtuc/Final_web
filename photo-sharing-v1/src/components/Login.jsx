import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [login_name, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        login_name, // 🟢 dùng đúng tên trường backend yêu cầu
        password
      }, {
        withCredentials: true // để session hoạt động
      });

      onLogin(res.data); // cập nhật người dùng hiện tại
    } catch (err) {
      alert("Đăng nhập thất bại: " + (err.response?.data?.message || "Lỗi server"));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={login_name}
          onChange={(e) => setLoginName(e.target.value)}
          placeholder="Tên đăng nhập"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>

      <hr />
      <p>Chưa có tài khoản</p>
      <button onClick={() => navigate("/register")}>Đăng ký tài khoản</button>
    </div>

  );
}

export default Login;
