import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import api from "../../../utils/api";
import "../Home/WorkspaceHome.css";
import "./WorkspaceSettings.css";

export default function WorkspaceSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/workspaces/${id}`)
      .then((res) => {
        setName(res.data.name);
        setDescription(res.data.description || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.patch(`/workspaces/${id}`, { name, description });
      setMessage("Workspace updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to update workspace.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This will permanently delete the workspace and all its documents.")) return;
    try {
      await api.delete(`/workspaces/${id}`);
      navigate("/workspaces");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete workspace.");
    }
  };

  return (
    <div className="workspace-page">
      <Sidebar />
      <main className="workspace-main">
        <Header />
        <div className="workspace-content">
          <section className="settings-header">
            <div>
              <h1>{name || "Workspace Settings"}</h1>
              <p>Manage your workspace configuration.</p>
            </div>
          </section>

          {loading ? (
            <p style={{ color: "#94a3b8" }}>Loading...</p>
          ) : (
            <>
              <form className="settings-card" onSubmit={handleSave}>
                <h2>General Information</h2>
                <div className="settings-group">
                  <label>Workspace Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="settings-group">
                  <label>Description</label>
                  <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                {message && <p style={{ color: message.includes("success") ? "#22c55e" : "#f43f5e", fontSize: "14px" }}>{message}</p>}
                <button className="save-btn" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>

              <section className="danger-zone">
                <h2>Danger Zone</h2>
                <p>Deleting this workspace will permanently remove all documents and data.</p>
                <button className="delete-btn" onClick={handleDelete}>Delete Workspace</button>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
