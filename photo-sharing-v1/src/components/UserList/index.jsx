import React, { useEffect, useState } from "react";
import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/user/list", { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error("Lỗi khi tải danh sách người dùng:", err);
        setUsers([]);
      });
  }, []);

  return (
    <div>
      <Typography variant="body1">Danh sách người dùng:</Typography>
      <List component="nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem button component={Link} to={`/users/${item._id}`}>
              <ListItemText primary={`${item.first_name} ${item.last_name}`} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
