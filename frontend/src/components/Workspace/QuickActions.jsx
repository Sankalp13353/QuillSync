import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiFilePlus,
  FiUserPlus,
  FiSettings,
  FiArrowRight,
} from "react-icons/fi";

const QuickActions = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <section className="quick-actions">

      <div className="section-header">

        <div className="section-title">

          <h2>Quick Actions</h2>

          <p>Frequently used workspace actions</p>

        </div>

      </div>

      <div className="quick-actions-grid">

        <button
          className="quick-action-card"
          onClick={() =>
            navigate(`/workspace/${id}/documents/new`)
          }
        >

          <div className="quick-action-icon">
            <FiFilePlus />
          </div>

          <div className="quick-action-info">

            <h3>New Document</h3>

            <p>Create a new document</p>

          </div>

          <FiArrowRight className="quick-action-arrow" />

        </button>

        <button
          className="quick-action-card"
          onClick={() =>
            navigate(`/workspace/${id}/members`)
          }
        >

          <div className="quick-action-icon">
            <FiUserPlus />
          </div>

          <div className="quick-action-info">

            <h3>Invite Member</h3>

            <p>Manage workspace members</p>

          </div>

          <FiArrowRight className="quick-action-arrow" />

        </button>

        <button
          className="quick-action-card"
          onClick={() =>
            navigate(`/workspace/${id}/settings`)
          }
        >

          <div className="quick-action-icon">
            <FiSettings />
          </div>

          <div className="quick-action-info">

            <h3>Workspace Settings</h3>

            <p>Manage workspace</p>

          </div>

          <FiArrowRight className="quick-action-arrow" />

        </button>

      </div>

    </section>
  );
};

export default QuickActions;