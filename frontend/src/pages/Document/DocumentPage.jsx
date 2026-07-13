import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSend, FiTrash2, FiMessageSquare, FiFileText } from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "./DocumentPage.css";

export default function DocumentPage() {
  const { id: workspaceId, docId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [document, setDocument] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const fetchData = async () => {
    try {
      const [docsRes, commentsRes] = await Promise.all([
        api.get(`/documents?workspaceId=${workspaceId}`),
        api.get(`/comments?documentId=${docId}`)
      ]);
      const doc = docsRes.data.find((d) => d.id === docId);
      setDocument(doc || null);
      setComments(commentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [docId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSending(true);
    try {
      const res = await api.post("/comments", { documentId: docId, content: newComment.trim() });
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
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

  const currentUserEmail = user?.email;

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
                  <h1 className="doc-title">{document.title}</h1>
                </div>
                <p className="doc-meta">
                  By {document.author?.email?.split("@")[0]} &nbsp;·&nbsp; Last updated {formatTime(document.updatedAt)}
                </p>
                <div className="doc-body">
                  <p style={{ color: "#64748b", fontStyle: "italic" }}>
                    Document editor coming soon. Use the comments panel to collaborate.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right — Comments/Chat */}
          <div className="doc-chat">
            <div className="doc-chat-header">
              <FiMessageSquare />
              <h2>Comments</h2>
              <span className="ws-count">{comments.length}</span>
            </div>

            <div className="doc-chat-messages">
              {comments.length === 0 ? (
                <p className="doc-chat-empty">No comments yet. Start the conversation!</p>
              ) : (
                comments.map((c) => {
                  const isOwn = c.author?.email === currentUserEmail;
                  return (
                    <div key={c.id} className={`doc-chat-msg ${isOwn ? "doc-chat-msg--own" : ""}`}>
                      <div className="doc-chat-avatar">
                        {c.author?.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="doc-chat-bubble">
                        <div className="doc-chat-bubble-top">
                          <span className="doc-chat-author">{c.author?.email?.split("@")[0]}</span>
                          <span className="doc-chat-time">{formatTime(c.createdAt)}</span>
                          {isOwn && (
                            <button className="doc-chat-delete" onClick={() => handleDelete(c.id)}>
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                        <p className="doc-chat-text">{c.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <form className="doc-chat-input-row" onSubmit={handleSend}>
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
          </div>

        </div>
      </main>
    </div>
  );
}
