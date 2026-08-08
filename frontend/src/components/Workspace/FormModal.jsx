import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

const FormModal = ({ isOpen, onClose, onSubmit, title, fields = [] }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initial = {};
      fields.forEach(f => {
        initial[f.name] = f.initialValue || "";
      });
      setFormData(initial);
    }
  }, [isOpen, fields]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e, name) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: '12px', width: '400px', maxWidth: '90%', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {fields.map(field => (
              <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>{field.label}</label>
                
                {field.type === "folder-select" ? (
                  <>
                    <select 
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(e, field.name)}
                      style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#0f172a', backgroundColor: '#fff', cursor: 'pointer' }}
                    >

                      {field.options && field.options.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                      <option value="NEW_FOLDER" style={{ fontWeight: 'bold', color: '#2563eb' }}>+ Create New Folder...</option>
                    </select>
                    {formData[field.name] === "NEW_FOLDER" && (
                      <input
                        type="text"
                        value={formData[`${field.name}_new`] || ""}
                        onChange={(e) => handleChange(e, `${field.name}_new`)}
                        placeholder="Enter new folder name..."
                        style={{ marginTop: '8px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#0f172a', backgroundColor: '#fff' }}
                        autoFocus
                      />
                    )}
                  </>
                ) : (
                  <input 
                    type={field.type || "text"}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(e, field.name)}
                    placeholder={field.placeholder}
                    autoFocus={field.autoFocus}
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#0f172a', backgroundColor: '#fff' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', color: '#475569', cursor: 'pointer', fontWeight: '500' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: '500' }}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
