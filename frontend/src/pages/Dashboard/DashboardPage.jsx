import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiLayers, FiUsers } from "react-icons/fi";

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
  const [stats, setStats] = useState({ totalDocuments: 0, totalWorkspaces: 0, totalMembers: 0 });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");

  const fetchDashboardData = async () => {
    try {
      const [workspacesRes, documentsRes, notificationsRes, statsRes] = await Promise.all([
        api.get("/workspaces"),
        api.get("/documents"),
        api.get("/notifications"),
        api.get("/workspaces/stats")
      ]);
      setWorkspaces(workspacesRes.data);
      setDocuments(documentsRes.data);
      setNotifications(notificationsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleWorkspaceCreated = (workspace) => {
    setShowCreateModal(false);
    navigate(`/workspace/${workspace.id}`);
  };

  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredDocuments = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

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
      <Sidebar />
      <main className="main">
        <Header search={search} onSearch={setSearch} />
        <div className="content">

          {/* Top Section */}
          <div className="dashboard-top">
            <WelcomeSection user={{ name: displayName }} />
            <CreateWorkspaceButton onCreate={() => setShowCreateModal(true)} />
            {showCreateModal && (
              <CreateWorkspaceModal
                onClose={() => setShowCreateModal(false)}
                onCreated={handleWorkspaceCreated}
              />
            )}
          </div>

          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon"><FiFileText /></div>
              <div>
                <p className="kpi-label">Total Documents</p>
                <p className="kpi-value">{stats.totalDocuments}</p>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon"><FiLayers /></div>
              <div>
                <p className="kpi-label">Workspaces</p>
                <p className="kpi-value">{stats.totalWorkspaces}</p>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon"><FiUsers /></div>
              <div>
                <p className="kpi-label">Total Members</p>
                <p className="kpi-value">{stats.totalMembers}</p>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            <div className="dashboard-left">
              <RecentWorkspaces workspaces={filteredWorkspaces} />
              <RecentDocuments documents={filteredDocuments} />
            </div>
            <div className="dashboard-right">
              <Notifications notifications={notifications} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
