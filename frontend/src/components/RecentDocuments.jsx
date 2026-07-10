import React from "react";
import { FiFileText } from "react-icons/fi";
import { recentDocuments } from "../data/mockData";

const RecentDocuments = () => {
  return (
    <section className="documents-section">
      <div className="section-header">
        <div className="section-header-title">
          <FiFileText />
          <h2>Recent Documents</h2>
        </div>

        <button className="section-link">
          View All
        </button>
      </div>

      <div className="document-list">
        {recentDocuments.map((document) => (
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
                  {document.workspace}
                  <span className="document-meta-sep">
                    •
                  </span>
                  {document.updated}
                </p>
              </div>
            </div>

            <button className="workspace-menu-button">
              Open
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentDocuments;