import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiFileText, FiArrowRight } from "react-icons/fi";

const DocumentsPreview = ({ documents }) => {
  const navigate = useNavigate();
  const { id: workspaceId } = useParams();

  const openDocument = (documentId) => {
    navigate(`/workspace/${workspaceId}/document/${documentId}`);
  };

  const getInitials = (email) => {
    if (!email) return "U";
    return email.split('@')[0].charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="documents-preview">
      <div className="section-header">
        <div className="section-title">
          <h2>Recent Documents</h2>
          <p>Continue where you left off</p>
        </div>

        <button className="view-all-btn">
          View All
          <FiArrowRight />
        </button>
      </div>

      <div className="documents-list">
        {!documents || documents.length === 0 ? (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>
            No documents found in this workspace. Create one to get started!
          </div>
        ) : (
          documents.slice(0, 5).map((document) => (
            <div
              className="document-card"
              key={document.id}
              onClick={() => openDocument(document.id)}
            >
              <div className="document-left">
                <div className="document-icon">
                  <FiFileText />
                </div>

                <div className="document-info">
                  <h3>{document.title}</h3>

                  <div className="document-collaborators">
                    <div
                      className="collaborator-avatar"
                      title={document.author?.email || "Unknown Author"}
                    >
                      {getInitials(document.author?.email)}
                    </div>
                  </div>

                  <p>Updated {formatDate(document.updatedAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default DocumentsPreview;