import React from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText } from "react-icons/fi";

const RecentDocuments = ({ documents }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return "";
    }
  };

  const openDocument = (workspaceId, documentId) => {
    if (workspaceId && documentId) {
      navigate(`/workspace/${workspaceId}/document/${documentId}`);
    }
  };

  return (
    <section className="documents-section">
      <div className="section-header">
        <div className="section-header-title">
          <FiFileText />
          <h2>Recent Documents</h2>
        </div>

        <button 
          className="section-link" 
          style={{ background: "none", border: "none", cursor: "pointer" }}
          onClick={() => navigate('/workspaces')}
        >
          View All
        </button>
      </div>

      <div className="document-list">
        {!documents || documents.length === 0 ? (
          <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>
            No recent documents found.
          </div>
        ) : (
          documents.map((document) => (
            <div
              className="document-item"
              key={document.id}
            >
              <div className="document-item-left">
                <div className="document-icon">
                  <FiFileText />
                </div>

                <div>
                  <h3 className="document-name">
                    {document.title}
                  </h3>

                  <p className="document-meta">
                    {document.workspace?.name || "Workspace"}
                    <span className="document-meta-sep">
                      •
                    </span>
                    {formatDate(document.updatedAt)}
                  </p>
                </div>
              </div>

              <button
                className="workspace-menu-button"
                onClick={() => openDocument(document.workspaceId, document.id)}
                style={{ cursor: "pointer" }}
              >
                Open
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default RecentDocuments;