import React, { useState, useEffect } from "react";
import { FiFolder, FiFolderPlus, FiFileText, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";

const FolderTreeNode = ({ folder, folders, documents, level = 0 }) => {
  const navigate = useNavigate();
  const { id: workspaceId } = useParams();
  const [expanded, setExpanded] = useState(false);

  const childFolders = folders.filter(f => f.parentId === folder.id);
  const childDocuments = documents.filter(d => d.folderId === folder.id);

  const handleToggle = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleOpen = () => {
    navigate(`/workspace/${workspaceId}?folderId=${folder.id}`);
  };

  const hasChildren = childFolders.length > 0 || childDocuments.length > 0;

  return (
    <div style={{ marginLeft: level > 0 ? '16px' : '0' }}>
      <div 
        className="sidebar-item" 
        onClick={handleOpen}
        style={{ paddingLeft: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '14px', color: '#334155', padding: '6px 8px', borderRadius: '4px' }}
      >
        <span onClick={handleToggle} style={{ width: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {hasChildren ? (expanded ? <FiChevronDown /> : <FiChevronRight />) : <span style={{ width: '16px' }} />}
        </span>
        <FiFolder style={{ marginRight: '8px', color: '#3b82f6' }} />
        <span>{folder.name}</span>
      </div>
      
      {expanded && (
        <div className="folder-children">
          {childFolders.map(child => (
            <FolderTreeNode 
              key={child.id} 
              folder={child} 
              folders={folders} 
              documents={documents} 
              level={level + 1} 
            />
          ))}
          {childDocuments.map(doc => (
            <div 
              key={doc.id} 
              onClick={() => navigate(`/workspace/${workspaceId}/document/${doc.id}`)}
              style={{ marginLeft: (level + 1) * 16 + 'px', paddingLeft: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '14px', color: '#64748b', padding: '6px 8px', borderRadius: '4px' }}
              className="sidebar-item"
            >
              <FiFileText style={{ marginRight: '8px' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FolderTree = ({ workspaceId }) => {
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (workspaceId) {
      Promise.all([
        api.get(`/folders?workspaceId=${workspaceId}&all=true`),
        api.get(`/documents?workspaceId=${workspaceId}&all=true`) // Ensure we pass all=true so we don't just get top 10
      ]).then(([foldersRes, docsRes]) => {
        setFolders(foldersRes.data);
        setDocuments(docsRes.data);
      }).catch(err => console.error("Error fetching folder tree:", err));
    }
  }, [workspaceId]);

  const rootFolders = folders.filter(f => !f.parentId);
  const rootDocuments = documents.filter(d => !d.folderId);

  return (
    <div className="folder-tree" style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', paddingLeft: '16px', letterSpacing: '0.05em' }}>
        DOCUMENTS EXPLORER
      </div>
      {rootFolders.map(folder => (
        <FolderTreeNode 
          key={folder.id} 
          folder={folder} 
          folders={folders} 
          documents={documents} 
        />
      ))}
      {rootDocuments.map(doc => (
        <div 
          key={doc.id} 
          onClick={() => navigate(`/workspace/${workspaceId}/document/${doc.id}`)}
          style={{ paddingLeft: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '14px', color: '#64748b', padding: '6px 8px', borderRadius: '4px' }}
          className="sidebar-item"
        >
          <FiFileText style={{ marginRight: '8px' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</span>
        </div>
      ))}
    </div>
  );
};
