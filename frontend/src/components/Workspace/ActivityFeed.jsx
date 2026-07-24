import React from "react";
import { FiActivity, FiArrowRight, FiClock } from "react-icons/fi";

const ActivityFeed = ({ documents }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  // Sort by updatedAt descending to show latest updates first
  const sortedDocs = [...(documents || [])].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <section className="activity-feed">
      <div className="section-header">
        <div className="section-title">
          <h2>Recent Activity</h2>
          <p>Latest updates in this workspace</p>
        </div>

        <button className="view-all-btn">
          View All
          <FiArrowRight />
        </button>
      </div>

      <div className="activity-list">
        {!sortedDocs || sortedDocs.length === 0 ? (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '16px 0' }}>
            No recent activity in this workspace.
          </div>
        ) : (
          sortedDocs.slice(0, 5).map((doc) => (
            <div
              className="activity-card"
              key={doc.id}
            >
              <div className="activity-icon">
                <FiActivity />
              </div>

              <div className="activity-content">
                <h3>Document "{doc.title}" was updated by {doc.author?.email || "unknown user"}</h3>

                <p>
                  <FiClock />
                  {formatDate(doc.updatedAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ActivityFeed;