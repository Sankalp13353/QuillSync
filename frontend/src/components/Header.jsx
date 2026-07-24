import React, { useState, useEffect, useRef } from "react";
import { FiBell, FiSearch, FiCheck } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Header = ({ search, onSearch }) => {
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetch
  Notifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => api.put(`/notifications/${n.id}/read`)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const diff = Math.floor((Date.now() - date) / 1000);
      if (diff < 60) return "just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <header className="header">
      <div className="header-search">
        <div className="header-search-wrap">
          <div className="header-search-icon"><FiSearch /></div>
          <input type="text" placeholder="Search Workspace..." className="header-search-input"
            value={search || ""}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="header-right">
        {/* Notifications Bell */}
        <div className="notif-wrapper" ref={dropdownRef}>
          <button
            className="header-icon-button notif-bell"
            onClick={() => setShowNotifs((v) => !v)}
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>

          {showNotifs && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button className="notif-mark-all" onClick={markAllRead}>
                    <FiCheck /> Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {loading ? (
                  <p className="notif-empty">Loading...</p>
                ) : notifications.length === 0 ? (
                  <p className="notif-empty">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.read ? "notif-item--unread" : ""}`}
                      onClick={() => !n.read && markAsRead(n.id)}
                    >
                      <div className="notif-dot" style={{ opacity: n.read ? 0 : 1 }} />
                      <div className="notif-item-content">
                        <p className="notif-item-message">{n.message}</p>
                        <span className="notif-item-time">{formatTime(n.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="header-divider"></div>

        <div className="header-user">
          <div className="header-user-text">
            <span className="header-user-name">{displayName}</span>
            <span className="header-user-email">{displayEmail}</span>
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
