import React, { useEffect, useState } from "react";
import { Typography, Box, Link as MuiLink } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/user/${userId}`, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error("Lỗi khi tải thông tin người dùng:", err);
        setUser(null);
      });
  }, [userId]);

  if (!user) return <Typography>Không tìm thấy người dùng.</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      <Typography><b>Nghề nghiệp:</b> {user.occupation}</Typography>
      <Typography><b>Mô tả:</b> {user.description}</Typography>
      <Typography><b>Địa điểm:</b> {user.location}</Typography>

      <Typography sx={{ mt: 2 }}>
        👉 <MuiLink component={Link} to={`/photos/${user._id}`}>
          Xem ảnh của {user.first_name}
        </MuiLink>
      </Typography>
    </Box>
  );
}

export default UserDetail;
