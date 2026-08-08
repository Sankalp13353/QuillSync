import React from "react";
import { FiClock } from "react-icons/fi";

export default function VersionHistoryPanel({ versions }) {
  if (!versions.length)
    return <p className="doc-chat-empty">No versions yet.</p>;

  return (
    <div className="versions-list">
      {versions.map((v) => (
        <div key={v.id} className="version-item">
          <div className="version-badge">v{v.version}</div>
          <div className="version-info">
            <span>{v.author?.email?.split("@")[0]}</span>
            <span className="version-time">
              <FiClock /> {new Date(v.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
