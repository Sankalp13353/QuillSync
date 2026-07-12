import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import WelcomeSection from "../../components/WelcomeSection";
import CreateWorkspaceButton from "../../components/CreateWorkspaceButton";
import CreateWorkspaceModal from "../../components/CreateWorkspaceModal";
import RecentWorkspaces from "../../components/RecentWorkspaces";
import RecentDocuments from "../../components/RecentDocuments";
import Notifications from "../../components/Notifications";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

import "./DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [workspacesRes, documentsRes, notificationsRes] = await Promise.all([
        api.get("/workspaces"),
        api.get("/documents"),
        api.get("/notifications")
      ]);
      setWorkspaces(workspacesRes.data);
      setDocuments(documentsRes.data);
      setNotifications(notificationsRes.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleWorkspaceCreated = (workspace) => {
    setShowCreateModal(false);
    navigate(`/workspace/${workspace.id}`);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  if (loading) {
    return (
      <div className="dashboard-page">
        <Sidebar />
        <main className="main">
          <Header />
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
            Loading dashboard data...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <div className="content">

          {/* Top Section */}
          <div className="dashboard-top">
            <WelcomeSection
              user={{
                name: displayName,
              }}
            />

            <CreateWorkspaceButton
              onCreate={() => setShowCreateModal(true)}
            />

            {showCreateModal && (
              <CreateWorkspaceModal
                onClose={() => setShowCreateModal(false)}
                onCreated={handleWorkspaceCreated}
              />
            )}
          </div>

          {/* Dashboard Grid */}
          <div className="dashboard-grid">

            {/* Left Column */}
            <div className="dashboard-left">

              <RecentWorkspaces workspaces={workspaces} />

              <RecentDocuments documents={documents} />

            </div>

            {/* Right Column */}

            <div className="dashboard-right">

              <Notifications notifications={notifications} />

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}