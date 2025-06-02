import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import axios from "axios";

function TopBar({ currentUser, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [contextText, setContextText] = useState("");

  useEffect(() => {
    const path = location.pathname;

    if (path === "/users") {
      setContextText("📋 Danh sách người dùng");
    } else if (path.startsWith("/users/") && !path.includes("/photos")) {
      setContextText("👤 Thông tin người dùng");
    } else if (path.startsWith("/photos/")) {
      setContextText("📷 Ảnh của người dùng");
    } else {
      setContextText("");
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
      onLogout();
      navigate("/login");
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" color="inherit">
            {currentUser ? `👋 Xin chào, ${currentUser.first_name}` : "Chưa đăng nhập"}
          </Typography>
          {currentUser && (
            <Button color="inherit" onClick={handleLogout}>
              Đăng xuất
            </Button>
          )}
        </Box>
        <Typography variant="h6" color="inherit">
          {contextText}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
