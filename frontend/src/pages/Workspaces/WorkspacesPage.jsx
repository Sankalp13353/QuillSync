import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiUsers, FiFileText, FiPlus, FiArrowLeft,
  FiActivity, FiSettings, FiUserPlus, FiClock
} from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import CreateWorkspaceModal from "../../components/CreateWorkspaceModal";
import api from "../../utils/api";
import "./WorkspacesPage.css";

export default function WorkspacesPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // present when route is /workspace/:id

  const [workspaces, setWorkspaces] = useState([]);
  const [workspace, setWorkspace] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [creatingDoc, setCreatingDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");

  // List view
  const fetchWorkspaces = async () => {
    try {
      const res = await api.get("/workspaces");
      setWorkspaces(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Detail view
  const fetchWorkspaceDetail = async () => {
    setLoading(true);
    try {
      const [wsRes, docsRes] = await Promise.all([
        api.get(`/workspaces/${id}`),
        api.get(`/documents?workspaceId=${id}`)
      ]);
      setWorkspace(wsRes.data);
      setDocuments(docsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchWorkspaceDetail();
    else fetchWorkspaces();
  }, [id]);

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    try {
      const res = await api.post("/documents", { title: newDocTitle.trim(), workspaceId: id });
      setNewDocTitle("");
      setCreatingDoc(false);
      navigate(`/workspace/${id}/document/${res.data.id}`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create document");
    }
  };

  const colors = ["indigo", "emerald", "blue", "rose", "violet", "amber"];
  const filtered = workspaces.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) => {
    try {
      const date = new Date(d);
      const diff = Math.floor((Date.now() - date) / 1000);
      if (diff < 60) return "just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch { return ""; }
  };

  // ── DETAIL VIEW ──
  if (id) {
    return (
      <div className="dashboard-page">
        <Sidebar />
        <main className="main">
          <Header search={search} onSearch={setSearch} />
          <div className="content">
            {loading ? (
              <p style={{ color: "#94a3b8" }}>Loading workspace...</p>
            ) : !workspace ? (
              <p style={{ color: "#f43f5e" }}>Workspace not found.</p>
            ) : (
              <>
                {/* Back + Header */}
                <div className="ws-detail-header">
                  <button className="back-btn" onClick={() => navigate("/workspaces")}>
                    <FiArrowLeft /> All Workspaces
                  </button>
                  <div className="ws-detail-title-row">
                    <div>
                      <h1 className="ws-page-title">{workspace.name}</h1>
                      <p className="ws-page-sub">{workspace.description || "No description"}</p>
                    </div>
                    <div className="ws-detail-actions">
                      <button className="secondary-btn" onClick={() => navigate(`/workspace/${id}/members`)}>
                        <FiUserPlus /> Members
                      </button>
                      <button className="secondary-btn" onClick={() => navigate(`/workspace/${id}/settings`)}>
                        <FiSettings /> Settings
                      </button>
                      <button className="create-workspace-btn" onClick={() => setCreatingDoc(true)}>
                        <FiPlus /> New Document
                      </button>
                    </div>
                  </div>
                </div>

                {/* New Doc inline form */}
                {creatingDoc && (
                  <form className="new-doc-form" onSubmit={handleCreateDocument}>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Document title..."
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      className="new-doc-input"
                    />
                    <button type="submit" className="create-workspace-btn">Create</button>
                    <button type="button" className="modal-btn-cancel" onClick={() => setCreatingDoc(false)}>Cancel</button>
                  </form>
                )}

                <div className="ws-detail-grid">
                  {/* Documents */}
                  <section className="ws-detail-card">
                    <div className="ws-detail-card-header">
                      <FiFileText />
                      <h2>Documents</h2>
                      <span className="ws-count">{filteredDocs.length}</span>
                    </div>
                    <div className="ws-doc-list">
                      {filteredDocs.length === 0 ? (
                        <p className="ws-empty">No documents yet.</p>
                      ) : filteredDocs.map((doc) => (
                        <div key={doc.id} className="ws-doc-item" onClick={() => navigate(`/workspace/${id}/document/${doc.id}`)}>
                          <div className="ws-doc-icon"><FiFileText /></div>
                          <div className="ws-doc-info">
                            <h4>{doc.title}</h4>
                            <span>{formatDate(doc.updatedAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Right column */}
                  <div className="ws-detail-right">
                    {/* Members */}
                    <section className="ws-detail-card">
                      <div className="ws-detail-card-header">
                        <FiUsers />
                        <h2>Members</h2>
                        <span className="ws-count">{workspace.members?.length}</span>
                      </div>
                      <div className="ws-members-list">
                        {workspace.members?.map((m) => (
                          <div key={m.id} className="ws-member-item">
                            <div className="ws-member-avatar">{m.email.charAt(0).toUpperCase()}</div>
                            <div className="ws-member-info">
                              <p>{m.email.split("@")[0]}</p>
                              <span>{m.email}</span>
                            </div>
                            <span className={`ws-role ws-role--${m.role.toLowerCase()}`}>{m.role}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Activity */}
                    <section className="ws-detail-card">
                      <div className="ws-detail-card-header">
                        <FiActivity />
                        <h2>Recent Activity</h2>
                      </div>
                      <div className="ws-activity-list">
                        {documents.length === 0 ? (
                          <p className="ws-empty">No activity yet.</p>
                        ) : [...documents].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5).map((doc) => (
                          <div key={doc.id} className="ws-activity-item">
                            <div className="ws-activity-dot" />
                            <div>
                              <p>"{doc.title}" updated</p>
                              <span><FiClock /> {formatDate(doc.updatedAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div className="dashboard-page">
      <Sidebar />
      <main className="main">
        <Header search={search} onSearch={setSearch} />
        <div className="content">
          <div className="ws-page-top">
            <div>
              <h1 className="ws-page-title">Workspaces</h1>
              <p className="ws-page-sub">All workspaces you are a member of</p>
            </div>
            <button className="create-workspace-btn" onClick={() => setShowModal(true)}>
              <FiPlus /> Create Workspace
            </button>
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
                  <div key={ws.id} className={`ws-card ws-card--${color}`} onClick={() => navigate(`/workspace/${ws.id}`)}>
                    <div className={`ws-card-avatar ws-card-avatar--${color}`}>{ws.name.charAt(0)}</div>
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
