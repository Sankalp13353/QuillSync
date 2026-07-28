import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiFileText, FiArrowRight, FiFolder, FiCornerUpLeft } from "react-icons/fi";

const DocumentsPreview = ({ documents, folders = [], folderId }) => {
  const navigate = useNavigate();
  const { id: workspaceId } = useParams();

  const openDocument = (documentId) => {
    navigate(`/workspace/${workspaceId}/document/${documentId}`);
  };

  const openFolder = (fId) => {
    navigate(`/workspace/${workspaceId}?folderId=${fId}`);
  };

  const goBack = () => {
    navigate(`/workspace/${workspaceId}`); // Simplified back to root for now
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
          <h2>{folderId ? "Folder Contents" : "Recent Documents"}</h2>
          <p>{folderId ? "Items in this folder" : "Continue where you left off"}</p>
        </div>

        <button className="view-all-btn">
          View All
          <FiArrowRight />
        </button>
      </div>

      <div className="documents-list">
        {folderId && (
          <div className="document-card" onClick={goBack} style={{ cursor: 'pointer', background: '#f8fafc' }}>
            <div className="document-left">
              <div className="document-icon" style={{ color: '#64748b' }}><FiCornerUpLeft /></div>
              <div className="document-info"><h3>.. Go Back</h3></div>
            </div>
          </div>
        )}

        {folders.map(folder => (
          <div className="folder-card" key={folder.id} onClick={() => openFolder(folder.id)} style={{ cursor: 'pointer' }}>
            <div className="document-left">
              <div className="document-icon" style={{ color: '#3b82f6' }}><FiFolder /></div>
              <div className="document-info">
                <h3>{folder.name}</h3>
                <p>Folder</p>
              </div>
            </div>
          </div>
        ))}

        {(!documents || documents.length === 0) && folders.length === 0 ? (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>
            No items found here.
          </div>
        ) : (
          documents.slice(0, folderId ? undefined : 5).map((document) => (
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
                    {document.tags && document.tags.map(dt => (
                      <span key={dt.tag.id} style={{ 
                        backgroundColor: dt.tag.color + '20', 
                        color: dt.tag.color, 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        marginRight: '8px',
                        border: `1px solid ${dt.tag.color}`
                      }}>
                        {dt.tag.name}
                      </span>
                    ))}
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