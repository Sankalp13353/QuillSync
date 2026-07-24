import React, { useState } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import api from "../utils/api";

const CreateWorkspaceModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Workspace name is required.");
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/workspaces", { name: name.trim(), description: description.trim() });
      onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create workspace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Workspace</h2>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="modal-field">
            <label>Name <span>*</span></label>
            <input
              type="text"
              placeholder="e.g. Product Design"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="modal-field">
            <label>Description</label>
            <textarea
              placeholder="What is this workspace for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-btn-submit" disabled={loading}>
              {loading ? <FiLoader className="spin" /> : "Create Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
