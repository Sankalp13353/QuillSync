import React from "react";
import { FiBell } from "react-icons/fi";
import { notifications } from "../data/mockData";

const Notifications = () => {
  return (
    <section className="notifications-section">

      <div className="section-header">

        <div className="section-header-title">
          <FiBell />
          <h2>Notifications</h2>
        </div>

      </div>

      <div className="notification-list">

        {notifications.map((notification) => (

          <div
            className="notification-card"
            key={notification.id}
          >

            <div className="notification-icon">
              <FiBell />
            </div>

            <div className="notification-content">

              <p className="notification-message">
                {notification.message}
              </p>

              <span className="notification-time">
                {notification.time}
              </span>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default Notifications;