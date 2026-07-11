import React from "react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import WelcomeSection from "../../components/WelcomeSection";
import CreateWorkspaceButton from "../../components/CreateWorkspaceButton";
import RecentWorkspaces from "../../components/RecentWorkspaces";
import RecentDocuments from "../../components/RecentDocuments";
import Notifications from "../../components/Notifications";

import "./DashboardPage.css";

export default function DashboardPage() {
  const handleCreateWorkspace = () => {
    console.log("Create Workspace");
  };

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <div className="content">

          {/* Top Section */}
          <div className="dashboard-top">
            <WelcomeSection
              user={{
                name: "Sankalp",
              }}
            />

            <CreateWorkspaceButton
              onCreate={handleCreateWorkspace}
            />
          </div>

          {/* Dashboard Grid */}
          <div className="dashboard-grid">

            {/* Left Column */}
            <div className="dashboard-left">

              <RecentWorkspaces />

              <RecentDocuments />

            </div>

            {/* Right Column */}

            <div className="dashboard-right">

              <Notifications />

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}