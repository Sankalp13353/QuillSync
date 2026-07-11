import React from "react";
import { FiBell, FiMessageSquare, FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const displayEmail = user?.email || "";

  return (
    <header className="header">
      <div className="header-search">
        <div className="header-search-wrap">
          <div className="header-search-icon">
            <FiSearch />
          </div>

          <input
            type="text"
            placeholder="Search Workspace..."
            className="header-search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-button">
          <FiBell />
        </button>

        <button className="header-icon-button">
          <FiMessageSquare />
        </button>

        <div className="header-divider"></div>

        <div className="header-user">
          <div className="header-user-text">
            <span className="header-user-name">
              {displayName}
            </span>

            <span className="header-user-email">
              {displayEmail}
            </span>
          </div>

          <div className="header-avatar">
            <img
              className="header-avatar-img"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
              alt="avatar"
            />

            <div className="header-avatar-status"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;