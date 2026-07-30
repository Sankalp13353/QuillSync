import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

import WorkspaceHeader from "../../../components/Workspace/WorkspaceHeader";
import DocumentsPreview from "../../../components/Workspace/DocumentsPreview";
import ActivityFeed from "../../../components/Workspace/ActivityFeed";
import QuickActions from "../../../components/Workspace/QuickActions";
import api from "../../../utils/api";

import "./WorkspaceHome.css";

export default function WorkspaceHome() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get("folderId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchWorkspaceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [wsRes, docsRes, foldersRes] = await Promise.all([
        api.get(`/workspaces/${id}`),
        api.get(`/documents?workspaceId=${id}${folderId ? `&folderId=${folderId}` : ''}`),
        api.get(`/folders?workspaceId=${id}${folderId ? `&parentId=${folderId}` : ''}`)
      ]);
      setWorkspace(wsRes.data);
      setDocuments(docsRes.data);
      setFolders(foldersRes.data);
    } catch (err) {
      console.error("Error fetching workspace data:", err);
      setError(err.response?.data?.error || "Failed to load workspace data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [id, folderId]);

  const filteredDocuments = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="workspace-page">
        <Sidebar />
        <main className="workspace-main">
          <Header />
          <div className="workspace-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '16px' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #1e293b', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: '#94a3b8' }}>Loading workspace...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </main>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="workspace-page">
        <Sidebar />
        <main className="workspace-main">
          <Header />
          <div className="workspace-error" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#f43f5e' }}>
            <p className="error-message">{error || "Workspace not found"}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="workspace-page">
      <Sidebar />
      <main className="workspace-main">
        <Header search={search} onSearch={setSearch} />
        <div className="workspace-content">
          <WorkspaceHeader workspace={workspace} onDocumentCreated={() => fetchWorkspaceData()} />
          <div className="workspace-grid">
            <div className="workspace-left">
              <DocumentsPreview documents={filteredDocuments} folders={folders} folderId={folderId} />
              <ActivityFeed documents={filteredDocuments} />
            </div>
            {/* Right Column */}
            <div className="workspace-right">
              <QuickActions onFolderCreated={fetchWorkspaceData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}