import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiMoreHorizontal } from "react-icons/fi";
import { workspaces } from "../data/mockData";

const RecentWorkspaces = () => {
  const navigate = useNavigate();

  const openWorkspace = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
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
        >
          View All
        </button>

      </div>

      <div className="workspace-grid">

        {workspaces.map((workspace) => (

          <div
            key={workspace.id}
            className={`workspace-card workspace-card--${workspace.color}`}
            onClick={() => openWorkspace(workspace.id)}
          >

            <div className="workspace-card-left">

              <div
                className={`workspace-avatar workspace-avatar--${workspace.color}`}
              >
                {workspace.name.charAt(0)}
              </div>

              <div>

                <h3 className="workspace-name">
                  {workspace.name}
                </h3>

                <p className="workspace-meta">

                  <FiUsers />

                  {workspace.members} Members

                  <span className="workspace-meta-sep">•</span>

                  {workspace.updated}

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

        ))}

      </div>

    </section>
  );
};

export default RecentWorkspaces;