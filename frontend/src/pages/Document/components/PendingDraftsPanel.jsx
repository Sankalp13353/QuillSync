import React from "react";
import { FiGitPullRequest, FiCheck, FiX } from "react-icons/fi";

const statusColor = { OPEN: "#f59e0b", MERGED: "#22c55e", CLOSED: "#ef4444" };

export default function PendingDraftsPanel({ drafts, role, onMerge, onClose }) {
  const canManage = ["OWNER", "MANAGER"].includes(role);

  if (!drafts.length)
    return <p className="doc-chat-empty">No drafts submitted yet.</p>;

  return (
    <div className="drafts-list">
      {drafts.map((d) => (
        <div key={d.id} className="draft-item">
          <div className="draft-item-header">
            <FiGitPullRequest style={{ color: statusColor[d.status] }} />
            <span className="draft-author">{d.author?.email?.split("@")[0]}</span>
            <span className="draft-status" style={{ color: statusColor[d.status] }}>{d.status}</span>
          </div>
          <p className="draft-preview">
            {d.content?.content?.[0]?.content?.[0]?.text?.slice(0, 80) || "No preview available"}...
          </p>
          {canManage && d.status === "OPEN" && (
            <div className="draft-actions">
              <button className="draft-btn draft-btn--merge" onClick={() => onMerge(d.id)}>
                <FiCheck /> Merge
              </button>
              <button className="draft-btn draft-btn--close" onClick={() => onClose(d.id)}>
                <FiX /> Close
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
