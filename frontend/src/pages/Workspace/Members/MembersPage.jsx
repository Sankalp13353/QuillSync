import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import api from "../../../utils/api";
import "../Home/WorkspaceHome.css";
import "./MembersPage.css";

export default function MembersPage() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/workspaces/${id}`)
      .then((res) => setWorkspace(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const filtered = (workspace?.members || []).filter((m) =>
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="workspace-page">
      <Sidebar />
      <main className="workspace-main">
        <Header />
        <div className="workspace-content">
          <section className="members-header">
            <div>
              <h1>{workspace?.name || "Workspace"}</h1>
              <p>Manage members and permissions for this workspace.</p>
            </div>
          </section>

          <div className="members-search">
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p style={{ color: "#94a3b8" }}>Loading members...</p>
          ) : (
            <div className="members-page-list">
              {filtered.map((member) => (
                <div className="member-row" key={member.id}>
                  <div className="member-left">
                    <div className="member-avatar">
                      {member.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{member.email.split("@")[0]}</h3>
                      <p>{member.email}</p>
                    </div>
                  </div>
                  <div className="member-actions">
                    <span className={`member-role-badge member-role-badge--${member.role.toLowerCase()}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
