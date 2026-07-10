import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { workspace } from "../../../data/workspaceMockData";

import "../Home/WorkspaceHome.css";
import "./WorkspaceSettings.css";

export default function WorkspaceSettings() {
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description);
  const [visibility, setVisibility] = useState("Private");

  const handleSave = (e) => {
    e.preventDefault();
    alert("Workspace updated successfully!");
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workspace?"
    );

    if (confirmDelete) {
      alert("Workspace Deleted!");
    }
  };

  return (
    <div className="workspace-page">
      <Sidebar />

      <main className="workspace-main">
        <Header />

        <div className="workspace-content">

          {/* Header */}

          <section className="settings-header">

            <div>

              <h1>{workspace.name}</h1>

              <p>
                Manage your workspace configuration and permissions.
              </p>

            </div>

          </section>

          {/* Form */}

          <form
            className="settings-card"
            onSubmit={handleSave}
          >

            <h2>General Information</h2>

            <div className="settings-group">

              <label>Workspace Name</label>

              <input
                type="text"
                value={workspaceName}
                onChange={(e) =>
                  setWorkspaceName(e.target.value)
                }
              />

            </div>

            <div className="settings-group">

              <label>Description</label>

              <textarea
                rows="5"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

            </div>

            <div className="settings-group">

              <label>Visibility</label>

              <select
                value={visibility}
                onChange={(e) =>
                  setVisibility(e.target.value)
                }
              >

                <option>Private</option>

                <option>Public</option>

              </select>

            </div>

            <button
              className="save-btn"
              type="submit"
            >

              Save Changes

            </button>

          </form>

          {/* Danger Zone */}

          <section className="danger-zone">

            <h2>Danger Zone</h2>

            <p>

              Deleting this workspace will permanently remove
              all documents, comments and versions.

            </p>

            <button
              className="delete-btn"
              onClick={handleDelete}
            >

              Delete Workspace

            </button>

          </section>

        </div>
      </main>
    </div>
  );
}