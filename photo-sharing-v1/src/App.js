import './App.css';
import React, { useState } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Wrapper cho route yêu cầu đăng nhập
  const PrivateRoute = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
          </Grid>

          <div className="main-topbar-buffer" />

          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {currentUser ? (
                <UserList />
              ) : (
                <Typography>Vui lòng đăng nhập để xem danh sách người dùng.</Typography>
              )}
            </Paper>
          </Grid>

          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route
                  path="/login"
                  element={<Login onLogin={user => setCurrentUser(user)} />}
                />
                <Route
                  path="/register"
                  element={<Register />}
                />
                <Route
                  path="/users/:userId"
                  element={
                    <PrivateRoute> 
                      <UserDetail />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/photos/:userId"
                  element={
                    <PrivateRoute>
                      <UserPhotos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <PrivateRoute>
                      <UserList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/"
                  element={<Navigate to={currentUser ? "/users" : "/login"} replace />}
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
}

export default App;
