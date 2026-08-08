import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiUserPlus, FiArrowLeft } from "react-icons/fi";
import api from "../../utils/api";
import FormModal from "./FormModal";

const WorkspaceHeader = ({ workspace, folderId, folders, onDocumentCreated, onFolderCreated }) => {
  const navigate = useNavigate();
  const [modalConfig, setModalConfig] = useState(null);

  const handleCreateDocument = async (formData) => {
    const title = formData.title;
    if (!title || !title.trim()) return;

    try {
      let targetFolderId = formData.folderId;
      if (targetFolderId === "NEW_FOLDER") {
        const newFolderName = formData.folderId_new;
        if (newFolderName && newFolderName.trim()) {
          const folderRes = await api.post("/folders", { name: newFolderName.trim(), workspaceId: workspace.id, parentId: null });
          targetFolderId = folderRes.data.id;
        } else {
          targetFolderId = null;
        }
      } else if (!targetFolderId) {
        targetFolderId = null;
      }

      const response = await api.post("/documents", {
        title: title.trim(),
        workspaceId: workspace.id,
        folderId: targetFolderId
      });
      if (onDocumentCreated) {
        onDocumentCreated(response.data);
      }
      setModalConfig(null);
    } catch (err) {
      console.error("Error creating document:", err);
      alert(err.response?.data?.error || "Failed to create document");
    }
  };

  const handleCreateFolder = async (formData) => {
    const name = formData.name;
    if (!name || !name.trim()) return;
    try {
      await api.post("/folders", { name: name.trim(), workspaceId: workspace.id, parentId: folderId || null });
      if (onFolderCreated) onFolderCreated();
      setModalConfig(null);
    } catch (err) {
      console.error("Error creating folder:", err);
      alert("Failed to create folder");
    }
  };

  const handleInviteMember = () => {
    navigate(`/workspace/${workspace.id}/members`);
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

  const myRole = workspace?.myRole || 'VIEWER';
  const canCreate = myRole === 'OWNER' || myRole === 'EDITOR';
  const canManageMembers = myRole === 'OWNER';

  return (
    <section className="workspace-header">
      <FormModal 
        isOpen={!!modalConfig} 
        onClose={() => setModalConfig(null)} 
        title={modalConfig?.title} 
        fields={modalConfig?.fields || []} 
        onSubmit={modalConfig?.onSubmit} 
      />
      <div className="workspace-header-left">
        <button className="back-btn" onClick={() => navigate("/workspaces")}>
          <FiArrowLeft /> All Workspaces
        </button>
        <h1 className="workspace-title">{workspace?.name}</h1>
        <p className="workspace-description">{workspace?.description || "No description provided."}</p>
      </div>

      <div className="workspace-header-right">
        <button className="secondary-btn" onClick={() => navigate(`/workspace/${workspace.id}/members`)}>
          <FiUserPlus />
          {canManageMembers ? 'Manage Members' : 'Members'}
        </button>

        {canCreate && (
          <button className="secondary-btn" onClick={openNewFolderModal}>
            <FiPlus />
            New Folder
          </button>
        )}

        {canCreate && (
          <button className="primary-btn" onClick={openNewDocModal}>
            <FiPlus />
            New Document
          </button>
        )}
      </div>
    </section>
  );
};

export default WorkspaceHeader;