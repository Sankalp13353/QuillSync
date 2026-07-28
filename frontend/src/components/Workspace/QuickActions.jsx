import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../../utils/api";
import {
  FiFilePlus,
  FiUserPlus,
  FiSettings,
  FiArrowRight,
  FiFolderPlus,
  FiTag
} from "react-icons/fi";

const QuickActions = ({ onFolderCreated }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get("folderId");

  const handleCreateFolder = async () => {
    const name = window.prompt("Enter new folder name:");
    if (!name) return;
    try {
      await api.post("/folders", { name, workspaceId: id, parentId: folderId || null });
      if (onFolderCreated) onFolderCreated();
    } catch (err) {
      alert("Failed to create folder");
    }
  };

  const handleCreateLabel = async () => {
    const name = window.prompt("Enter label name:");
    if (!name) return;
    const color = window.prompt("Enter label color (e.g. #ef4444 or red):", "#3b82f6");
    if (!color) return;
    try {
      await api.post("/tags", { name, color, workspaceId: id });
      alert("Label created successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create label");
    }
  };

  return (
    <section className="quick-actions">

      <div className="section-header">

        <div className="section-title">

          <h2>Quick Actions</h2>

          <p>Frequently used workspace actions</p>

        </div>

      </div>

      <div className="quick-actions-grid">

        <button
          className="quick-action-card"
          onClick={() =>
            navigate(`/workspace/${id}/documents/new`)
          }
        >

          <div className="quick-action-icon">
            <FiFilePlus />
          </div>

          <div className="quick-action-info">

            <h3>New Document</h3>

            <p>Create a new document</p>

          </div>

          <FiArrowRight className="quick-action-arrow" />
        </button>

        <button
          className="quick-action-card"
          onClick={handleCreateFolder}
        >
          <div className="quick-action-icon">
            <FiFolderPlus />
          </div>
          <div className="quick-action-info">
            <h3>New Folder</h3>
            <p>Organize documents</p>
          </div>
          <FiArrowRight className="quick-action-arrow" />
        </button>

        <button
          className="quick-action-card"
          onClick={handleCreateLabel}
        >
          <div className="quick-action-icon">
            <FiTag />
          </div>
          <div className="quick-action-info">
            <h3>New Label</h3>
            <p>Create a custom tag</p>
          </div>
          <FiArrowRight className="quick-action-arrow" />
        </button>

        <button
          className="quick-action-card"
          onClick={() =>
            navigate(`/workspace/${id}/members`)
          }
        >

          <div className="quick-action-icon">
            <FiUserPlus />
          </div>

          <div className="quick-action-info">

            <h3>Invite Member</h3>

            <p>Manage workspace members</p>

          </div>

          <FiArrowRight className="quick-action-arrow" />

        </button>

        <button
          className="quick-action-card"
          onClick={() =>
            navigate(`/workspace/${id}/settings`)
          }
        >

          <div className="quick-action-icon">
            <FiSettings />
          </div>

          <div className="quick-action-info">

            <h3>Workspace Settings</h3>

            <p>Manage workspace</p>

          </div>

          <FiArrowRight className="quick-action-arrow" />

        </button>

      </div>

    </section>
  );
};

export default QuickActions;