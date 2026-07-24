import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiMoreHorizontal } from "react-icons/fi";

const RecentWorkspaces = ({ workspaces }) => {
  const navigate = useNavigate();

  const openWorkspace = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
  };

  const colors = ["indigo", "emerald", "blue", "rose", "violet", "amber"];

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return "Recently";
    }
  };

  return (
    <section className="recent-workspaces">
      <div className="section-header">
        <div className="section-header-title">
          <h2>Recent Workspaces</h2>
        </div>

        <button
          className="section-link"
          onClick={() => navigate("/workspaces")}
          style={{ cursor: "pointer", background: "none", border: "none" }}
        >
          View All
        </button>
      </div>

      <div className="workspace-grid">
        {!workspaces || workspaces.length === 0 ? (
          <div style={{ color: "#94a3b8", gridColumn: "1 / -1", textAlign: "center", padding: "30px" }}>
            No workspaces found. Click "Create Workspace" above to get started!
          </div>
        ) : (
          workspaces.map((workspace, index) => {
            const color = colors[index % colors.length];
            return (
              <div
                key={workspace.id}
                className={`workspace-card workspace-card--${color}`}
                onClick={() => openWorkspace(workspace.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="workspace-card-left">
                  <div
                    className={`workspace-avatar workspace-avatar--${color}`}
                  >
                    {workspace.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="workspace-name">
                      {workspace.name}
                    </h3>

                    <p className="workspace-meta">
                      <FiUsers />
                      {workspace.members || 1} Members
                      <span className="workspace-meta-sep">•</span>
                      {formatDate(workspace.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  className="workspace-menu-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiMoreHorizontal />
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default RecentWorkspaces;