import React from "react";

import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

import WorkspaceHeader from "../../../components/Workspace/WorkspaceHeader";
import DocumentsPreview from "../../../components/Workspace/DocumentsPreview";
import ActivityFeed from "../../../components/Workspace/ActivityFeed";
import QuickActions from "../../../components/Workspace/QuickActions";

import "./WorkspaceHome.css";

export default function WorkspaceHome() {
  return (
    <div className="workspace-page">

      <Sidebar />

      <main className="workspace-main">

        <Header />

        <div className="workspace-content">

          <WorkspaceHeader />

          <div className="workspace-grid">

            {/* Left Column */}

            <div className="workspace-left">

              <DocumentsPreview />

              <ActivityFeed />

            </div>

            {/* Right Column */}

            <div className="workspace-right">

              <QuickActions />

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}