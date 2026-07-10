import React from "react";
import { FiActivity, FiArrowRight, FiClock } from "react-icons/fi";
import { activities } from "../../data/workspaceMockData";

const ActivityFeed = () => {
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

        {activities.map((activity) => (

          <div
            className="activity-card"
            key={activity.id}
          >

            <div className="activity-icon">

              <FiActivity />

            </div>

            <div className="activity-content">

              <h3>{activity.message}</h3>

              <p>

                <FiClock />

                {activity.time}

              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default ActivityFeed;