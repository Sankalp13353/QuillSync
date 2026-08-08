import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUserPlus, FiMoreVertical, FiTrash2, FiShield } from "react-icons/fi";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import "../Home/WorkspaceHome.css";
import "./MembersPage.css";

export default function MembersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("VIEWER");
  const [inviteLoading, setInviteLoading] = useState(false);

  // Options Menu State
  const [openMenuId, setOpenMenuId] = useState(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', userId: null });

  const fetchWorkspace = () => {
    setLoading(true);
    api.get(`/workspaces/${id}`)
      .then((res) => setWorkspace(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkspace();
  }, [id]);

  const filtered = (workspace?.members || []).filter((m) =>
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const myRole = workspace?.myRole;
  const isOwner = myRole === 'OWNER';

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteLoading(true);
    try {
      await api.post(`/workspaces/${id}/members`, { email: inviteEmail, role: inviteRole });
      setShowInviteModal(false);
      setInviteEmail("");
      fetchWorkspace();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to invite user");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.patch(`/workspaces/${id}/members/${userId}`, { role: newRole });
      fetchWorkspace();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update role");
    }
    setOpenMenuId(null);
  };

  const handleRemoveMember = async (userId) => {
    setOpenMenuId(null);
    setConfirmModal({ isOpen: true, type: 'remove', userId });
  };

  const confirmRemoveMember = async () => {
    try {
      await api.delete(`/workspaces/${id}/members/${confirmModal.userId}`);
      fetchWorkspace();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to remove member");
    }
    setConfirmModal({ isOpen: false, type: '', userId: null });
  };

  const handleTransferOwnership = async (userId) => {
    setOpenMenuId(null);
    setConfirmModal({ isOpen: true, type: 'transfer', userId });
  };

  const confirmTransferOwnership = async () => {
    try {
      await api.post(`/workspaces/${id}/transfer-ownership`, { targetUserId: confirmModal.userId });
      fetchWorkspace();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to transfer ownership");
    }
    setConfirmModal({ isOpen: false, type: '', userId: null });
  };

  return (
    <div className="workspace-page">
      <Sidebar />
      <main className="workspace-main">
        <Header />
        <div className="workspace-content">
          <section className="members-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>{workspace?.name || "Workspace"}</h1>
              <p>Manage members and permissions for this workspace.</p>
            </div>
            {isOwner && (
              <button className="primary-btn" onClick={() => setShowInviteModal(true)}>
                <FiUserPlus style={{ marginRight: '8px' }} /> Invite Member
              </button>
            )}
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
                      <h3>{member.email.split("@")[0]} {member.email === user?.email ? "(You)" : ""}</h3>
                      <p>{member.email}</p>
                    </div>
                  </div>
                  <div className="member-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    
                    {isOwner && member.email !== user?.email ? (
                      <select 
                        value={member.role} 
                        onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                        className="member-role-select"
                      >
                        <option value="VIEWER">Viewer</option>
                        <option value="COMMENTOR">Commentor</option>
                        <option value="EDITOR">Editor</option>
                      </select>
                    ) : (
                      <span className={`member-role-badge member-role-badge--${member.role.toLowerCase()}`}>
                        {member.role}
                      </span>
                    )}

                    {isOwner && member.email !== user?.email && (
                      <div className="member-options" style={{ position: 'relative' }}>
                        <button 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                          onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                        >
                          <FiMoreVertical size={20} />
                        </button>
                        
                        {openMenuId === member.id && (
                          <div className="member-options-menu">
                            <button onClick={() => handleTransferOwnership(member.id)} className="member-options-item">
                              <FiShield /> Transfer Ownership
                            </button>
                            <button onClick={() => handleRemoveMember(member.id)} className="member-options-item danger">
                              <FiTrash2 /> Remove from workspace
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal-content form-modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Invite Member</h2>
              <button className="close-btn" onClick={() => setShowInviteModal(false)}>×</button>
            </div>
            <form onSubmit={handleInvite}>
              <div className="modal-body">
                <input
                  type="email"
                  placeholder="User's email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="modal-input"
                  autoFocus
                  required
                />
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="modal-input"
                  style={{ marginTop: '16px' }}
                >
                  <option value="VIEWER">Viewer</option>
                  <option value="COMMENTOR">Commentor</option>
                  <option value="EDITOR">Editor</option>
                </select>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>
                  Note: The user must already have an account on QuillSync.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowInviteModal(false)}>Cancel</button>
                <button type="submit" className="btn-confirm" disabled={inviteLoading || !inviteEmail}>
                  {inviteLoading ? 'Inviting...' : 'Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content form-modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>{confirmModal.type === 'transfer' ? 'Transfer Ownership' : 'Remove Member'}</h2>
              <button className="close-btn" onClick={() => setConfirmModal({ isOpen: false, type: '', userId: null })}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#cbd5e1', lineHeight: '1.5' }}>
                {confirmModal.type === 'transfer' 
                  ? "Are you sure you want to transfer ownership? You will be demoted to EDITOR."
                  : "Are you sure you want to remove this member from the workspace?"}
              </p>
            </div>
            <div className="modal-footer" style={{ marginTop: '24px' }}>
              <button type="button" className="btn-cancel" onClick={() => setConfirmModal({ isOpen: false, type: '', userId: null })}>Cancel</button>
              <button 
                type="button"
                className="btn-confirm" 
                style={confirmModal.type === 'remove' ? { background: '#ef4444' } : {}}
                onClick={confirmModal.type === 'transfer' ? confirmTransferOwnership : confirmRemoveMember}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
