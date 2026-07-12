import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiFileText, FiPlus, FiSearch } from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import CreateWorkspaceModal from "../../components/CreateWorkspaceModal";
import api from "../../utils/api";
import "./WorkspacesPage.css";

export default function WorkspacesPage() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get("/workspaces");
      setWorkspaces(res.data);
    } catch (err) {
      console.error("Failed to fetch workspaces:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkspaces(); }, []);

  const filtered = workspaces.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const colors = ["indigo", "emerald", "blue", "rose", "violet", "amber"];

  return (
    <div className="dashboard-page">
      <Sidebar />
      <main className="main">
        <Header />
        <div className="content">
          <div className="ws-page-top">
            <div>
              <h1 className="ws-page-title">All Workspaces</h1>
              <p className="ws-page-sub">All workspaces you are a member of</p>
            </div>
            <button className="create-workspace-btn" onClick={() => setShowModal(true)}>
              <FiPlus /> Create Workspace
            </button>
          </div>

          <div className="ws-search-wrap">
            <FiSearch className="ws-search-icon" />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ws-search-input"
            />
          </div>

          {loading ? (
            <p style={{ color: "#94a3b8" }}>Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No workspaces found.</p>
          ) : (
            <div className="ws-grid">
              {filtered.map((ws, i) => {
                const color = colors[i % colors.length];
                return (
                  <div
                    key={ws.id}
                    className={`ws-card ws-card--${color}`}
                    onClick={() => navigate(`/workspace/${ws.id}`)}
                  >
                    <div className={`ws-card-avatar ws-card-avatar--${color}`}>
                      {ws.name.charAt(0)}
                    </div>
                    <div className="ws-card-info">
                      <h3>{ws.name}</h3>
                      <p>{ws.description || "No description"}</p>
                      <div className="ws-card-meta">
                        <span><FiUsers /> {ws.members} members</span>
                        <span><FiFileText /> {ws.documentsCount} docs</span>
                        <span className={`ws-role ws-role--${ws.role.toLowerCase()}`}>{ws.role}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <CreateWorkspaceModal
          onClose={() => setShowModal(false)}
          onCreated={(ws) => { setShowModal(false); navigate(`/workspace/${ws.id}`); }}
        />
      )}
    </div>
  );
}
