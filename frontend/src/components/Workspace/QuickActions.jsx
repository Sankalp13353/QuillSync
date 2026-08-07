import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import {
  FiFilePlus,
  FiUserPlus,
  FiSettings,
  FiArrowRight,
  FiFolderPlus,
  FiTag
} from "react-icons/fi";
import FormModal from "./FormModal";

const QuickActions = ({ folders, onFolderCreated, onDocumentCreated }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get("folderId");
  const [modalConfig, setModalConfig] = useState(null);

  const handleCreateFolder = async (formData) => {
    const name = formData.name;
    if (!name) return;
    try {
      await api.post("/folders", { name, workspaceId: id, parentId: folderId || null });
      if (onFolderCreated) onFolderCreated();
      setModalConfig(null);
    } catch (err) {
      alert("Failed to create folder");
    }
  };

  const handleCreateDocument = async (formData) => {
    const title = formData.title;
    if (!title || !title.trim()) return;

    try {
      let targetFolderId = formData.folderId;
      if (targetFolderId === "NEW_FOLDER") {
        const newFolderName = formData.folderId_new;
        if (newFolderName && newFolderName.trim()) {
          const folderRes = await api.post("/folders", { name: newFolderName.trim(), workspaceId: id, parentId: null });
          targetFolderId = folderRes.data.id;
        } else {
          targetFolderId = null;
        }
      } else if (!targetFolderId) {
        targetFolderId = null;
      }

      const response = await api.post("/documents", {
        title: title.trim(),
        workspaceId: id,
        folderId: targetFolderId
      });
      if (onDocumentCreated) onDocumentCreated(response.data);
      setModalConfig(null);
    } catch (err) {
      console.error("Error creating document:", err);
      alert(err.response?.data?.error || "Failed to create document");
    }
  };

  const handleCreateLabel = async (formData) => {
    const name = formData.name;
    const color = formData.color || "#3b82f6";
    if (!name) return;
    try {
      await api.post("/tags", { name, color, workspaceId: id });
      alert("Label created successfully!");
      setModalConfig(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create label");
    }
  };

  const openNewDocModal = () => {
    setModalConfig({
      title: "Create New Document",
      fields: [
        { name: "title", label: "Document Title", placeholder: "e.g., Project Proposal", autoFocus: true },
        { name: "folderId", label: "Folder", type: "folder-select", options: folders || [], initialValue: folderId || "" }
      ],
      onSubmit: handleCreateDocument
    });
  };

  const openNewFolderModal = () => {
    setModalConfig({
      title: "Create New Folder",
      fields: [{ name: "name", label: "Folder Name", placeholder: "e.g., Q3 Reports", autoFocus: true }],
      onSubmit: handleCreateFolder
    });
  };

  const openNewLabelModal = () => {
    setModalConfig({
      title: "Create New Label",
      fields: [
        { name: "name", label: "Label Name", placeholder: "e.g., Important", autoFocus: true },
        { name: "color", label: "Color (e.g. #ef4444 or red)", initialValue: "#3b82f6" }
      ],
      onSubmit: handleCreateLabel
    });
  };

  return (
    <section className="quick-actions">
      <FormModal 
        isOpen={!!modalConfig} 
        onClose={() => setModalConfig(null)} 
        title={modalConfig?.title} 
        fields={modalConfig?.fields || []} 
        onSubmit={modalConfig?.onSubmit} 
      />

      <div className="section-header">

        <div className="section-title">

          <h2>Quick Actions</h2>

          <p>Frequently used workspace actions</p>

        </div>

      </div>

      <div className="quick-actions-grid">

        <button
          className="quick-action-card"
          onClick={openNewDocModal}
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
          onClick={openNewFolderModal}
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
          onClick={openNewLabelModal}
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