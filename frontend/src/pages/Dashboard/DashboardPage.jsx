import React, { useState, useEffect } from "react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import WelcomeSection from "../../components/WelcomeSection";
import CreateWorkspaceButton from "../../components/CreateWorkspaceButton";
import RecentWorkspaces from "../../components/RecentWorkspaces";
import RecentDocuments from "../../components/RecentDocuments";
import Notifications from "../../components/Notifications";
import api from "../../utils/api";

import "./DashboardPage.css";

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [wsRes, docsRes, notifsRes] = await Promise.all([
        api.get("/workspaces"),
        api.get("/documents"),
        api.get("/notifications")
      ]);
      setWorkspaces(wsRes.data);
      setDocuments(docsRes.data);
      setNotifications(notifsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateWorkspace = async () => {
    const name = window.prompt("Enter new workspace name:");
    if (!name || !name.trim()) return;

    const description = window.prompt("Enter workspace description (optional):") || "";

    try {
      await api.post("/workspaces", {
        name: name.trim(),
        description: description.trim()
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Error creating workspace:", err);
      alert(err.response?.data?.error || "Failed to create workspace");
    }
  };

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
            <WelcomeSection />

            <CreateWorkspaceButton
              onCreate={handleCreateWorkspace}
            />
          </div>

          {/* Dashboard Grid */}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "#94a3b8" }}>
              Loading dashboard data...
            </div>
          ) : (
            <div className="dashboard-grid">

              {/* Left Column */}
              <div className="dashboard-left">

                <RecentWorkspaces workspaces={workspaces} />

                <RecentDocuments documents={documents} />

              </div>

              {/* Right Column */}

              <div className="dashboard-right">

                <Notifications notifications={notifications} onRefresh={fetchDashboardData} />

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}