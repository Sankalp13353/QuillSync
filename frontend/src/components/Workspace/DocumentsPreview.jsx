import React from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiArrowRight } from "react-icons/fi";
import { documents } from "../../data/workspaceMockData";

const DocumentsPreview = () => {
  const navigate = useNavigate();

  const openDocument = (documentId) => {
    // We'll create this page later
    navigate(`/workspace/1/document/${documentId}`);
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
        {documents.map((document) => (
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
                  {document.collaborators.map((member) => (
                    <div
                      key={member.id}
                      className="collaborator-avatar"
                      title={member.name}
                    >
                      {member.avatar}
                    </div>
                  ))}
                </div>

                <p>Updated {document.updated}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DocumentsPreview;