import React from "react";
import { FiBell } from "react-icons/fi";
import api from "../utils/api";

const Notifications = ({ notifications, onRefresh }) => {
  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateString;
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
          <div style={{ color: "#94a3b8", padding: "20px 0", textAlign: "center" }}>
            No new notifications.
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              className={`notification-card ${notification.read ? "notification-card--read" : ""}`}
              key={notification.id}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              style={{ cursor: notification.read ? "default" : "pointer", opacity: notification.read ? 0.6 : 1 }}
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