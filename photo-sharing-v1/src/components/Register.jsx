import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    login_name: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/auth/register", formData, {
        withCredentials: true
      });

      navigate("/login"); // Chuyển đến đăng nhập 
    } catch (err) {
      setMessage(err.response?.data?.error || "Lỗi đăng ký.");
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="login_name" placeholder="Tên đăng nhập" onChange={handleChange} required /><br />
        <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required /><br />
        <input name="first_name" placeholder="Tên" onChange={handleChange} required /><br />
        <input name="last_name" placeholder="Họ" onChange={handleChange} required /><br />
        <button type="submit">Đăng ký</button>
      </form>
      
    </div>
  );
}

export default Register;
