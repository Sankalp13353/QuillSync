import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSend, FiTrash2, FiMessageSquare, FiFileText } from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Editor from "../../components/Editor/Editor";
import DocumentTags from "../../components/Document/DocumentTags";
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
  const [saveStatus, setSaveStatus] = useState("Saved");
  const bottomRef = useRef(null);

  const fetchData = async () => {
    try {
      const [docRes, commentsRes] = await Promise.all([
        api.get(`/documents/${docId}`),
        api.get(`/comments?documentId=${docId}`)
      ]);
      setDocument(docRes.data);
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

  const handleSaveDocument = async (jsonContent) => {
    setSaveStatus("Saving...");
    try {
      await api.patch(`/documents/${docId}`, { content: jsonContent });
      setSaveStatus("Saved");
    } catch (err) {
      console.error("Failed to save document:", err);
      setSaveStatus("Error saving");
    }
  };

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
              <div className="doc-content-area" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="doc-title-row">
                  <div className="doc-title-icon"><FiFileText /></div>
                  <h1 className="doc-title">{document.title}</h1>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p className="doc-meta" style={{ margin: 0 }}>
                    By {document.author?.email?.split("@")[0]} &nbsp;·&nbsp; Last updated {formatTime(document.updatedAt)}
                  </p>
                  <span style={{ fontSize: '12px', color: saveStatus === 'Error saving' ? '#f43f5e' : '#64748b', fontWeight: '500' }}>
                    {saveStatus}
                  </span>
                </div>
                
                <div style={{ marginBottom: '32px' }}>
                  <DocumentTags 
                    document={document} 
                    workspaceId={workspaceId} 
                    onTagsUpdated={(updatedDoc) => setDocument(updatedDoc)} 
                  />
                </div>
                
                <div className="doc-body" style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column', background: 'transparent', border: 'none' }}>
                  <Editor initialContent={document.content} onSave={handleSaveDocument} />
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
