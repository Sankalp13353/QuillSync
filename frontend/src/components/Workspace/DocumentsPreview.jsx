import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiFileText, FiFolder, FiMoreVertical, FiMove, FiHome } from "react-icons/fi";
import MoveModal from "./MoveModal";

const DocumentsPreview = ({ workspace, documents, folders = [], folderId, breadcrumbs = [], onMoveSuccess }) => {
  const navigate = useNavigate();
  const { id: workspaceId } = useParams();
  const [moveModalItem, setMoveModalItem] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const myRole = workspace?.myRole || 'VIEWER';
  const canEdit = myRole === 'OWNER' || myRole === 'EDITOR';

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const openDocument = (documentId) => {
    navigate(`/workspace/${workspaceId}/document/${documentId}`);
  };

  const openFolder = (fId) => {
    navigate(`/workspace/${workspaceId}?folderId=${fId}`);
  };

  const goToRoot = () => {
    navigate(`/workspace/${workspaceId}`);
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

  const handleMoveClick = (e, item) => {
    e.stopPropagation();
    setMoveModalItem(item);
    setOpenMenuId(null);
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <section className="documents-preview">
      <MoveModal 
        isOpen={!!moveModalItem} 
        onClose={() => setMoveModalItem(null)} 
        item={moveModalItem} 
        workspaceId={workspaceId} 
        onMoveSuccess={() => {
          setMoveModalItem(null);
          if (onMoveSuccess) onMoveSuccess();
        }} 
      />
      <div className="section-header">
        <div className="section-title">
          <div className="breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 'bold' }}>
            {!folderId ? (
              <span>Documents</span>
            ) : (
              <>
                <span onClick={goToRoot} title="Workspace Root" style={{ cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <FiHome size={20} />
                </span>
                {breadcrumbs.map((b, index) => (
                  <React.Fragment key={b.id}>
                    <span style={{ color: '#94a3b8' }}>/</span>
                    <span 
                      onClick={() => openFolder(b.id)} 
                      style={{ cursor: 'pointer', color: index === breadcrumbs.length - 1 ? '#0f172a' : '#64748b' }}
                    >
                      {b.name}
                    </span>
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="documents-list">
        {folders.map(folder => (
          <div className="folder-card" key={folder.id} onClick={() => openFolder(folder.id)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="document-left">
              <div className="document-icon" style={{ color: '#3b82f6' }}><FiFolder /></div>
              <div className="document-info">
                <h3>{folder.name}</h3>
                <p>Folder</p>
              </div>
            </div>
            
            {canEdit && (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={(e) => toggleMenu(e, `folder-${folder.id}`)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '8px' }}
                >
                  <FiMoreVertical size={18} />
                </button>
                {openMenuId === `folder-${folder.id}` && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '120px', overflow: 'hidden' }}>
                    <div 
                      onClick={(e) => handleMoveClick(e, { ...folder, type: 'folder' })}
                      style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#334155', background: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <FiMove /> Move
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {folderId && documents.map((document) => (
          <div
            className="document-card"
            key={document.id}
            onClick={() => openDocument(document.id)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div className="document-left">
              <div className="document-icon">
                <FiFileText />
              </div>

              <div className="document-info">
                <h3>{document.title}</h3>

                <div className="document-collaborators" style={{ alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  {document.tags && document.tags.map(dt => (
                    <span key={dt.tag.id} style={{ 
                      backgroundColor: dt.tag.color + '20', 
                      color: dt.tag.color, 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      fontWeight: '600',
                      border: `1px solid ${dt.tag.color}`,
                      alignSelf: 'center',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '1'
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
            
            {canEdit && (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={(e) => toggleMenu(e, `doc-${document.id}`)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '8px' }}
                >
                  <FiMoreVertical size={18} />
                </button>
                {openMenuId === `doc-${document.id}` && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '120px', overflow: 'hidden' }}>
                    <div 
                      onClick={(e) => handleMoveClick(e, { ...document, type: 'document' })}
                      style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#334155', background: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <FiMove /> Move
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {(!documents || documents.length === 0 || !folderId) && (!folders || folders.length === 0) && (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>
            No items found here.
          </div>
        )}
      </div>
    </section>
  );
};

export default DocumentsPreview;