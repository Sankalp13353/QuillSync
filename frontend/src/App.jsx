import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Authentication
import LandingPage from "./pages/Landing/LandingPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

// Dashboard
import DashboardPage from "./pages/Dashboard/DashboardPage";

// Workspace
import WorkspacesPage from "./pages/Workspaces/WorkspacesPage";
import DocumentPage from "./pages/Document/DocumentPage";
import MembersPage from "./pages/Workspace/Members/MembersPage";
import WorkspaceSettings from "./pages/Workspace/Settings/WorkspaceSettings";
import WorkspaceHome from "./pages/Workspace/Home/WorkspaceHome";

function App() {
  return (
    <AuthProvider>

      <Router>

        <Routes>

          {/* Public Routes */}

          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          {/* Protected Routes */}

          <Route
            path="/workspaces"
            element={<ProtectedRoute><WorkspacesPage /></ProtectedRoute>}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="/workspace/:id" element={<ProtectedRoute><WorkspaceHome /></ProtectedRoute>} />

          <Route path="/workspace/:id/document/:docId" element={<ProtectedRoute><DocumentPage /></ProtectedRoute>} />

          <Route
            path="/workspace/:id/members"
            element={
              <ProtectedRoute>
                <MembersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspace/:id/settings"
            element={
              <ProtectedRoute>
                <WorkspaceSettings />
              </ProtectedRoute>
            }
          />

        </Routes>

      </Router>

    </AuthProvider>
  );
}

export default App;