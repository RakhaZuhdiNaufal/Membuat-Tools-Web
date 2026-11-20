import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tools from './pages/Tools';
import Tutorials from './pages/Tutorials';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Dedicated Generator Pages
import ChatPromptTool from './pages/tools/ChatPromptTool';
import CodePreviewTool from './pages/tools/CodePreviewTool';
import PhpConverterTool from './pages/tools/PhpConverterTool';
import ImageGeneratorTool from './pages/tools/ImageGeneratorTool';
import VideoGeneratorTool from './pages/tools/VideoGeneratorTool';
import ReactNativeTool from './pages/tools/ReactNativeTool';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Application Routes */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Tools Hub & Dedicated Generator Pages */}
              <Route path="tools" element={<Tools />} />
              <Route path="tools/chat-prompt" element={<ChatPromptTool />} />
              <Route path="tools/code-preview" element={<CodePreviewTool />} />
              <Route path="tools/react-native" element={<ReactNativeTool />} />
              <Route path="tools/php-studio" element={<PhpConverterTool />} />
              <Route path="tools/image-generator" element={<ImageGeneratorTool />} />
              <Route path="tools/video-generator" element={<VideoGeneratorTool />} />

              <Route path="tutorials" element={<Tutorials />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:courseId" element={<CourseDetail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
