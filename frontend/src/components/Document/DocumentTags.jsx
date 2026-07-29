import React, { useState, useEffect, useRef } from 'react';
import { FiTag, FiPlus, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import './DocumentTags.css';

export default function DocumentTags({ document, workspaceId, onTagsUpdated }) {
  const [workspaceTags, setWorkspaceTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6'); // default blue
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };
    window.document.addEventListener('mousedown', handleClickOutside);
    return () => window.document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchWorkspaceTags();
    }
  }, [isOpen]);

  const fetchWorkspaceTags = async () => {
    try {
      const res = await api.get(`/tags?workspaceId=${workspaceId}`);
      setWorkspaceTags(res.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const documentTags = document.tags || [];
  const assignedTagIds = new Set(documentTags.map(dt => dt.tag.id));

  const toggleTag = async (tag) => {
    setLoading(true);
    let newTagIds;
    if (assignedTagIds.has(tag.id)) {
      // Remove
      newTagIds = Array.from(assignedTagIds).filter(id => id !== tag.id);
    } else {
      // Add
      newTagIds = [...Array.from(assignedTagIds), tag.id];
    }

    try {
      const res = await api.patch(`/documents/${document.id}`, { tagIds: newTagIds });
      onTagsUpdated(res.data);
    } catch (err) {
      console.error('Error updating tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setLoading(true);
    try {
      const createRes = await api.post('/tags', {
        name: newTagName.trim(),
        color: newTagColor,
        workspaceId
      });
      const newTag = createRes.data;
      
      // Update local workspace tags list
      setWorkspaceTags([...workspaceTags, newTag]);
      
      // Immediately assign to document
      const newTagIds = [...Array.from(assignedTagIds), newTag.id];
      const patchRes = await api.patch(`/documents/${document.id}`, { tagIds: newTagIds });
      
      onTagsUpdated(patchRes.data);
      
      setNewTagName('');
      setIsCreating(false);
    } catch (err) {
      console.error('Error creating tag:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-tags-container" ref={containerRef}>
      <div className="document-tags-list">
        {documentTags.map(dt => (
          <span 
            key={dt.tag.id} 
            className="document-tag-badge"
            style={{ 
              backgroundColor: `${dt.tag.color}20`, 
              color: dt.tag.color,
              borderColor: `${dt.tag.color}40`
            }}
          >
            {dt.tag.name}
            <button 
              className="tag-remove-btn"
              onClick={() => toggleTag(dt.tag)}
              disabled={loading}
              title="Remove tag"
            >
              <FiX />
            </button>
          </span>
        ))}
        
        <button 
          className="add-tag-btn" 
          onClick={() => setIsOpen(!isOpen)}
          title="Manage Tags"
        >
          <FiTag /> Add Tag
        </button>
      </div>

      {isOpen && (
        <div className="tag-dropdown">
          <div className="tag-dropdown-header">
            <h3>Manage Tags</h3>
          </div>
          
          <div className="tag-list">
            {workspaceTags.length === 0 ? (
              <p className="no-tags">No tags found. Create one below!</p>
            ) : (
              workspaceTags.map(tag => {
                const isSelected = assignedTagIds.has(tag.id);
                return (
                  <div 
                    key={tag.id} 
                    className={`tag-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    <div className="tag-color-circle" style={{ backgroundColor: tag.color }} />
                    <span className="tag-item-name">{tag.name}</span>
                    {isSelected && <span className="tag-check">✓</span>}
                  </div>
                );
              })
            )}
          </div>

          <div className="tag-dropdown-footer">
            {!isCreating ? (
              <button className="start-create-tag-btn" onClick={() => setIsCreating(true)}>
                <FiPlus /> Create new tag
              </button>
            ) : (
              <form className="create-tag-form" onSubmit={handleCreateTag}>
                <input 
                  type="text" 
                  placeholder="Tag name" 
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  autoFocus
                  maxLength={25}
                />
                <div className="color-picker-row">
                  {['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'].map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-preset ${newTagColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </div>
                <div className="create-tag-actions">
                  <button type="button" className="cancel-create-btn" onClick={() => setIsCreating(false)}>Cancel</button>
                  <button type="submit" className="submit-create-btn" disabled={!newTagName.trim() || loading}>
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
