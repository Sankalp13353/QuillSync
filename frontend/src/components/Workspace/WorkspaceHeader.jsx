import React from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiUserPlus, FiArrowLeft } from "react-icons/fi";
import api from "../../utils/api";

const WorkspaceHeader = ({ workspace, onDocumentCreated }) => {
  const navigate = useNavigate();

  const handleCreateDocument = async () => {
    const title = window.prompt("Enter new document title:");
    if (!title || !title.trim()) return;

    try {
      const response = await api.post("/documents", {
        title: title.trim(),
        workspaceId: workspace.id
      });
      if (onDocumentCreated) {
        onDocumentCreated(response.data);
      }
    } catch (err) {
      console.error("Error creating document:", err);
      alert(err.response?.data?.error || "Failed to create document");
    }
  };

  const handleInviteMember = () => {
    navigate(`/workspace/${workspace.id}/members`);
  };

  return (
    <section className="workspace-header">
      <div className="workspace-header-left">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h1 className="workspace-title">{workspace?.name}</h1>
        <p className="workspace-description">{workspace?.description || "No description provided."}</p>
      </div>

      <div className="workspace-header-right">
        <button className="secondary-btn" onClick={handleInviteMember}>
          <FiUserPlus />
          Invite Member
        </button>

        <button className="primary-btn" onClick={handleCreateDocument}>
          <FiPlus />
          New Document
        </button>
      </div>
    </section>
  );
};

export default WorkspaceHeader;