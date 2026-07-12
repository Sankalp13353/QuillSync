import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  FiFeather,
  FiGrid,
  FiLayers,
  FiUsers,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { signOut } = useAuth();
  const [workspaceId, setWorkspaceId] = useState(id || null);

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (id) {
      setWorkspaceId(id);
    } else {
      const fetchFirstWorkspace = async () => {
        try {
          const response = await api.get("/workspaces");
          if (response.data && response.data.length > 0) {
            setWorkspaceId(response.data[0].id);
          }
        } catch (err) {
          console.error("Sidebar error:", err);
        }
      };
      fetchFirstWorkspace();
    }
  }, [id]);


  return (
    <aside className="sidebar">
      <div>
        {/* Logo */}

        <div
          className="sidebar-logo"
          onClick={() => navigate("/dashboard")}
        >
          <div className="sidebar-logo-icon">
            <FiFeather />
          </div>

          <span className="sidebar-logo-text">
            QuillSync
          </span>
        </div>

        {/* Menu */}

        <div className="sidebar-body">

          <div className="sidebar-section">

            <span className="sidebar-section-label">
              MENU
            </span>

            <button
              className={`sidebar-item ${
                location.pathname === "/dashboard"
                  ? "sidebar-item--active"
                  : ""
              }`}
              onClick={() => navigate("/dashboard")}
            >
              <FiGrid />
              <span>Dashboard</span>
            </button>

            <button
              className={`sidebar-item ${
                location.pathname === `/workspace/${workspaceId}`
                  ? "sidebar-item--active"
                  : ""
              }`}
              onClick={() => navigate(`/workspace/${workspaceId}`)}
            >
              <FiLayers />
              <span>Workspace Home</span>
            </button>

            <button
              className={`sidebar-item ${
                location.pathname.includes("/members")
                  ? "sidebar-item--active"
                  : ""
              }`}
              onClick={() =>
                navigate(`/workspace/${workspaceId}/members`)
              }
            >
              <FiUsers />
              <span>Members</span>
            </button>

            <button
              className={`sidebar-item ${
                location.pathname.includes("/settings")
                  ? "sidebar-item--active"
                  : ""
              }`}
              onClick={() =>
                navigate(`/workspace/${workspaceId}/settings`)
              }
            >
              <FiSettings />
              <span>Settings</span>
            </button>

          </div>

        </div>
      </div>

      <div className="sidebar-footer">

        <button
          className="sidebar-item sidebar-item--danger"
          onClick={handleLogout}
        >
          <FiLogOut />

          <span>Logout</span>
        </button>

      </div>
    </aside>
  );
};

export default Sidebar;