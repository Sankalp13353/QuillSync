import React, { useState, useEffect } from "react";
import { FiFolder, FiX } from "react-icons/fi";
import api from "../../utils/api";

const MoveModal = ({ isOpen, onClose, item, workspaceId, onMoveSuccess }) => {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && workspaceId) {
      // Fetch all folders to allow moving to any folder
      api.get(`/folders?workspaceId=${workspaceId}&all=true`)
        .then(res => {
          // Exclude the item itself if it's a folder, to prevent moving a folder into itself
          const available = res.data.filter(f => !(item.type === 'folder' && f.id === item.id));
          setFolders(available);
          setSelectedFolderId(null);
        })
        .catch(err => console.error("Error fetching folders for move:", err));
    }
  }, [isOpen, workspaceId, item]);

  const handleMove = async () => {
    setLoading(true);
    try {
      if (item.type === 'document') {
        await api.patch(`/documents/${item.id}`, { folderId: selectedFolderId });
      } else if (item.type === 'folder') {
        await api.patch(`/folders/${item.id}`, { parentId: selectedFolderId });
      }
      onMoveSuccess();
      onClose();
    } catch (err) {
      console.error("Error moving item:", err);
      alert("Failed to move item.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Move {item.name || item.title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>
            <FiX />
          </button>
        </div>
        
        <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '14px' }}>Select destination folder:</p>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '20px' }}>
          <div 
            onClick={() => setSelectedFolderId(null)}
            style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', background: selectedFolderId === null ? '#eff6ff' : 'white' }}
          >
            <FiFolder style={{ color: selectedFolderId === null ? '#3b82f6' : '#64748b' }} />
            <span style={{ fontWeight: selectedFolderId === null ? '600' : '400', color: selectedFolderId === null ? '#1e3a8a' : '#334155' }}>Workspace Root</span>
          </div>
          {folders.map(f => (
            <div 
              key={f.id}
              onClick={() => setSelectedFolderId(f.id)}
              style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', background: selectedFolderId === f.id ? '#eff6ff' : 'white' }}
            >
              <FiFolder style={{ color: selectedFolderId === f.id ? '#3b82f6' : '#64748b' }} />
              <span style={{ fontWeight: selectedFolderId === f.id ? '600' : '400', color: selectedFolderId === f.id ? '#1e3a8a' : '#334155' }}>
                {f.name}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
          <button onClick={handleMove} disabled={loading} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
            {loading ? "Moving..." : "Move Here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveModal;
