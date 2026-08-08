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
          <p style={{ color: '#94a3b8', padding: '16px' }}>No recent documents.</p>
        ) : (
          documents.map((document) => (
            <div
              className="document-item"
              key={document.id}
              onClick={() => openDocument(document.workspaceId, document.id)}
              style={{ cursor: 'pointer', padding: '16px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div className="document-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="document-icon" style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontSize: '18px' }}>
                  <FiFileText />
                </div>
                <div className="document-info">
                  <h3 className="document-name" style={{ margin: '0 0 6px 0', fontSize: '15px' }}>
                    {document.title}
                  </h3>
                  
                  {document.tags && document.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      {document.tags.map(dt => (
                        <span key={dt.tag.id} style={{
                          backgroundColor: dt.tag.color + '20',
                          color: dt.tag.color,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          border: `1px solid ${dt.tag.color}40`
                        }}>
                          {dt.tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="document-meta" style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                    {document.workspace?.name || "Workspace"} {document.folder?.name ? ` / ${document.folder.name}` : ""}
                    <span className="document-meta-sep" style={{ margin: '0 8px' }}>
                      •
                    </span>
                    {formatDate(document.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default RecentDocuments;