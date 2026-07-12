import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiMoreHorizontal } from "react-icons/fi";

const RecentWorkspaces = ({ workspaces }) => {
  const navigate = useNavigate();
  const colors = ["indigo", "emerald", "blue", "rose", "violet"];

  const openWorkspace = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
  };

  return (
    <section className="recent-workspaces">
      <div className="section-header">
        <div className="section-header-title">
          <h2>Recent Workspaces</h2>
        </div>
      </div>

      <div className="workspace-grid">
        {!workspaces || workspaces.length === 0 ? (
          <div style={{ color: "#94a3b8", padding: "20px 0", gridColumn: "1 / -1", textAlign: "center" }}>
            No workspaces found. Create one to get started!
          </div>
        ) : (
          workspaces.map((workspace, index) => {
            const color = colors[index % colors.length];
            return (
              <div
                key={workspace.id}
                className={`workspace-card workspace-card--${color}`}
                onClick={() => openWorkspace(workspace.id)}
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