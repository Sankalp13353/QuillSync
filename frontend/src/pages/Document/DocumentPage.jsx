import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft, FiSend, FiTrash2, FiMessageSquare, FiFileText, FiGitPullRequest, FiClock } from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import DocumentEditor from "./components/DocumentEditor";
import PendingDraftsPanel from "./components/PendingDraftsPanel";
import VersionHistoryPanel from "./components/VersionHistoryPanel";
import "./DocumentPage.css";

const TABS = ["Comments", "Drafts", "Versions"];

export default function DocumentPage() {
  const { id: workspaceId, docId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const bottomRef = useRef(null);

  const [document, setDocument] = useState(null);
  const [role, setRole] = useState(null);
  const [comments, setComments] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [versions, setVersions] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("Comments");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchAll = async () => {
    try {
      const initialDoc = location.state?.document || null;

      const [docRes, commentsRes, wsRes] = await Promise.all([
        initialDoc ? Promise.resolve({ data: initialDoc }) : api.get(`/documents/${docId}`),
        api.get(`/comments?documentId=${docId}`).catch(() => ({ data: [] })),
        api.get(`/workspaces/${workspaceId}`)
      ]);

      setDocument(docRes.data?.id ? docRes.data : null);
      setComments(commentsRes.data);
      setRole(wsRes.data.myRole || "VIEWER");
    } catch (err) {
      console.error("fetchAll error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrafts = async () => {
    try {
      const res = await api.get(`/drafts?documentId=${docId}`);
      setDrafts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchVersions = async () => {
    try {
      const res = await api.get(`/versions?documentId=${docId}`);
      setVersions(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchAll(); }, [docId]);

  useEffect(() => {
    if (activeTab === "Drafts") fetchDrafts();
    if (activeTab === "Versions") fetchVersions();
  }, [activeTab]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSave = async (content) => {
    try {
      await api.patch(`/documents/${docId}`, { content });
      setDocument((prev) => ({ ...prev, content }));
      fetchVersions();
      alert("Document saved and new version created.");
    } catch (err) {
      alert(err.response?.data?.error || "Save failed");
    }
  };

  const handleSubmitDraft = async (content) => {
    try {
      await api.post("/drafts", { documentId: docId, content });
      alert("Draft submitted for review.");
      fetchDrafts();
    } catch (err) {
      alert(err.response?.data?.error || "Submit failed");
    }
  };

  const handleMerge = async (draftId) => {
    try {
      await api.post(`/drafts/${draftId}/merge`);
      fetchDrafts();
      fetchVersions();
      const res = await api.get(`/documents/${docId}`);
      setDocument(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Merge failed");
    }
  };

  const handleCloseDraft = async (draftId) => {
    try {
      await api.post(`/drafts/${draftId}/close`);
      fetchDrafts();
    } catch (err) {
      alert(err.response?.data?.error || "Close failed");
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSending(true);
    try {
      const res = await api.post("/comments", { documentId: docId, content: newComment.trim() });
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) { console.error(err); }
  };

  const formatTime = (d) => {
    try {
      const date = new Date(d);
      const diff = Math.floor((Date.now() - date) / 1000);
      if (diff < 60) return "just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch { return ""; }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <main className="main">
        <Header />
        <div className="doc-page-layout">

          {/* Left — Document */}
          <div className="doc-main">
            <button className="back-btn" onClick={() => navigate(`/workspace/${workspaceId}`)}>
              <FiArrowLeft /> Back to Workspace
            </button>

            {loading ? (
              <p style={{ color: "#94a3b8" }}>Loading document...</p>
            ) : !document ? (
              <p style={{ color: "#f43f5e" }}>Document not found.</p>
            ) : (
              <div className="doc-content-area">
                <div className="doc-title-row">
                  <div className="doc-title-icon"><FiFileText /></div>
                  <div>
                    <h1 className="doc-title">{document.title}</h1>
                    <p className="doc-meta">
                      By {document.author?.email?.split("@")[0]} &nbsp;·&nbsp; {formatTime(document.updatedAt)}
                      &nbsp;·&nbsp; <span className="doc-role-badge">{role}</span>
                    </p>
                  </div>
                </div>
                <DocumentEditor
                  content={document.content}
                  role={role}
                  onSave={handleSave}
                  onSubmitDraft={handleSubmitDraft}
                />
              </div>
            )}
          </div>

          {/* Right — Tabbed Panel */}
          <div className="doc-chat">
            <div className="doc-panel-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`doc-panel-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "Comments" && <FiMessageSquare />}
                  {tab === "Drafts" && <FiGitPullRequest />}
                  {tab === "Versions" && <FiClock />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Comments Tab */}
            {activeTab === "Comments" && (
              <>
                <div className="doc-chat-messages">
                  {comments.length === 0 ? (
                    <p className="doc-chat-empty">No comments yet. Start the conversation!</p>
                  ) : comments.map((c) => {
                    const isOwn = c.author?.email === user?.email;
                    return (
                      <div key={c.id} className={`doc-chat-msg ${isOwn ? "doc-chat-msg--own" : ""}`}>
                        <div className="doc-chat-avatar">{c.author?.email?.charAt(0).toUpperCase()}</div>
                        <div className="doc-chat-bubble">
                          <div className="doc-chat-bubble-top">
                            <span className="doc-chat-author">{c.author?.email?.split("@")[0]}</span>
                            <span className="doc-chat-time">{formatTime(c.createdAt)}</span>
                            {isOwn && (
                              <button className="doc-chat-delete" onClick={() => handleDeleteComment(c.id)}>
                                <FiTrash2 />
                              </button>
                            )}
                          </div>
                          <p className="doc-chat-text">{c.content}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
                <form className="doc-chat-input-row" onSubmit={handleSendComment}>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="doc-chat-input"
                  />
                  <button type="submit" className="doc-chat-send" disabled={sending || !newComment.trim()}>
                    <FiSend />
                  </button>
                </form>
              </>
            )}

            {/* Drafts Tab */}
            {activeTab === "Drafts" && (
              <div className="doc-tab-content">
                <PendingDraftsPanel
                  drafts={drafts}
                  role={role}
                  onMerge={handleMerge}
                  onClose={handleCloseDraft}
                />
              </div>
            )}

            {/* Versions Tab */}
            {activeTab === "Versions" && (
              <div className="doc-tab-content">
                <VersionHistoryPanel versions={versions} />
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
