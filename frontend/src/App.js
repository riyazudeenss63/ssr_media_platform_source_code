import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import UploadVideo from "./pages/uploadvideo";
import Dashboard from "./pages/dashboard";
import VideoPlayer from "./pages/VideoDetails";
import Settings from "./pages/settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<ProtectedRoute><UploadVideo /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}