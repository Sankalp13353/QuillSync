import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSend, FiTrash2, FiMessageSquare, FiFileText, FiGitPullRequest, FiClock } from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import DocumentTags from "../../components/Document/DocumentTags";
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
  const [saveStatus, setSaveStatus] = useState("Saved");

  const fetchAll = async () => {
    try {
      const initialDoc = location.state?.document || null;

      const [docRes, commentsRes] = await Promise.all([
        initialDoc ? Promise.resolve({ data: initialDoc }) : api.get(`/documents/${docId}`),
        api.get(`/comments?documentId=${docId}`).catch(() => ({ data: [] }))
      ]);

      setDocument(docRes.data?.id ? docRes.data : null);
      setComments(commentsRes.data);
      setRole(docRes.data.myRole || "VIEWER");
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
    setSaveStatus("Saving...");
    try {
      await api.patch(`/documents/${docId}`, { content });
      setDocument((prev) => ({ ...prev, content }));
      fetchVersions();
      setSaveStatus("Saved");
      toast.success("Document saved and new version created.");
    } catch (err) {
      alert(err.response?.data?.error || "Save failed");
      setSaveStatus("Error saving");
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

  const currentUserEmail = user?.email;
  const myRole = role || 'VIEWER';
  const canEdit = myRole === 'OWNER' || myRole === 'EDITOR';
  const canComment = myRole === 'OWNER' || myRole === 'EDITOR' || myRole === 'COMMENTOR';

  return (
    <div className="dashboard-page">
      <Sidebar />
      <main className="main">
        <Header />
        <div className="doc-page-layout">

          {/* Left — Document */}
          <div className="doc-main">
            <button 
              className="back-btn" 
              onClick={() => {
                if (document?.folderId) {
                  navigate(`/workspace/${workspaceId}?folderId=${document.folderId}`);
                } else {
                  navigate(`/workspace/${workspaceId}`);
                }
              }}
            >
              <FiArrowLeft /> Back
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
                    &nbsp;·&nbsp; <span className="doc-role-badge">{role}</span>
                  </p>
                  <span style={{ fontSize: '12px', color: saveStatus === 'Error saving' ? '#f43f5e' : '#64748b', fontWeight: '500' }}>
                    {saveStatus}
                  </span>
                </div>
                
                <div style={{ marginBottom: '32px' }}>
                  {canEdit && (
                    <DocumentTags 
                      document={document} 
                      workspaceId={workspaceId} 
                      onTagsUpdated={(updatedDoc) => setDocument({ ...document, tags: updatedDoc.tags })} 
                    />
                  )}
                  {!canEdit && document.tags && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {document.tags.map(dt => (
                        <span key={dt.tag.id} style={{ backgroundColor: dt.tag.color + '20', color: dt.tag.color, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', border: `1px solid ${dt.tag.color}` }}>
                          {dt.tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="doc-body" style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column', background: 'transparent', border: 'none' }}>
                  <DocumentEditor
                    content={document.content}
                    role={role}
                    onSave={handleSave}
                    onSubmitDraft={handleSubmitDraft}
                  />
                </div>
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
                    placeholder={canComment ? "Write a comment..." : "You do not have permission to comment."}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="doc-chat-input"
                    disabled={!canComment}
                  />
                  <button type="submit" className="doc-chat-send" disabled={sending || !newComment.trim() || !canComment}>
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
