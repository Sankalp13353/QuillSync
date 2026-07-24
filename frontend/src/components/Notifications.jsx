import React from "react";
import { FiBell } from "react-icons/fi";

const Notifications = ({ notifications }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return "";
    }
  };

  return (
    <section className="notifications-section">
      <div className="section-header">
        <div className="section-header-title">
          <FiBell />
          <h2>Notifications</h2>
        </div>
      </div>

      <div className="notification-list">
        {!notifications || notifications.length === 0 ? (
          <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>
            No new notifications.
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              className="notification-card"
              key={notification.id}
              style={{ opacity: notification.read ? 0.6 : 1 }}
            >
              <div className="notification-icon">
                <FiBell />
              </div>

              <div className="notification-content">
                <p className="notification-message">
                  {notification.message}
                </p>

                <span className="notification-time">
                  {formatDate(notification.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Notifications;