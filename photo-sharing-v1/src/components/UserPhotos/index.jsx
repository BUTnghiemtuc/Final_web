import React, { useEffect, useState } from "react";
import { Typography, Box, Divider, TextField, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  return date.toLocaleString();
}

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const fetchPhotos = () => {
    axios.get(`http://localhost:3000/photo/photosOfUser/${userId}`, { withCredentials: true })
      .then(res => setPhotos(res.data))
      .catch(err => {
        console.error("Lỗi khi tải ảnh:", err);
        setPhotos([]);
      });
  };

  useEffect(() => {
    fetchPhotos();
  }, [userId]);

  const handleCommentChange = (photoId, value) => {
    setNewComments(prev => ({ ...prev, [photoId]: value }));
  };

  const handleCommentSubmit = async (photoId) => {
    const comment = newComments[photoId];
    if (!comment?.trim()) return;

    try {
      await axios.post(
        `http://localhost:3000/photo/comments/${photoId}`,
        { comment },
        { withCredentials: true }
      );
      setNewComments(prev => ({ ...prev, [photoId]: "" }));
      fetchPhotos();
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true // Gửi kèm cookie session
      });
      alert("✅ Ảnh đã được tải lên!");
    } catch (err) {
      console.error("❌ Lỗi khi upload ảnh:", err);
    }
  };


  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Ảnh của người dùng</Typography>

      {/* Khu vực upload ảnh */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, alignItems: "center" }}>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button onClick={handleUpload}>TẢI ẢNH LÊN</button>
        {uploadMessage && <Typography sx={{ ml: 2 }}>{uploadMessage}</Typography>}
      </Box>  

      {photos.map((photo) => (
        <Box key={photo._id} sx={{ mb: 4 }}>
          <img
            src={`http://localhost:3000/uploads/${photo.file_name}`}
            alt=""
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            🕒 {formatDateTime(photo.date_time)}
          </Typography>

          {photo.comments?.length ? (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1">💬 Bình luận:</Typography>
              {photo.comments.map((cmt, idx) => (
                <Box key={idx} sx={{ mb: 1, pl: 2 }}>
                  <Typography>
                    {cmt.user ? (
                      <Link to={`/users/${cmt.user._id}`}>
                        {cmt.user.first_name} {cmt.user.last_name}
                      </Link>
                    ) : (
                      <i>[Người dùng]</i>
                    )}: {cmt.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">   
                    {formatDateTime(cmt.date_time)}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography sx={{ mt: 1 }}><i>Chưa có bình luận nào.</i></Typography>
          )}

          {/* Nhập bình luận mới */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Nhập bình luận..."
              value={newComments[photo._id] || ""}
              onChange={(e) => handleCommentChange(photo._id, e.target.value)}
            />
            <Button variant="contained" onClick={() => handleCommentSubmit(photo._id)}>
              Gửi
            </Button>
          </Box>

          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );
}

export default UserPhotos;
