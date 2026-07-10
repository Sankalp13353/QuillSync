import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { workspace, members } from "../../../data/workspaceMockData";

import "../Home/WorkspaceHome.css";
import "./MembersPage.css";

export default function MembersPage() {
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="workspace-page">
      <Sidebar />

      <main className="workspace-main">
        <Header />

        <div className="workspace-content">

          {/* Page Header */}

          <section className="members-header">

            <div>

              <h1>{workspace.name}</h1>

              <p>
                Manage members and permissions for this workspace.
              </p>

            </div>

            <button className="primary-btn">

              + Invite Member

            </button>

          </section>

          {/* Search */}

          <div className="members-search">

            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          {/* Members */}

          <div className="members-page-list">

            {filteredMembers.map((member) => (

              <div
                className="member-row"
                key={member.id}
              >

                <div className="member-left">

                  <div className="member-avatar">

                    {member.name.charAt(0)}

                  </div>

                  <div>

                    <h3>{member.name}</h3>

                    <p>{member.email}</p>

                  </div>

                </div>

                <div className="member-actions">

                  <select
                    defaultValue={member.role}
                    className="member-role-select"
                  >

                    <option>Owner</option>

                    <option>Editor</option>

                    <option>Viewer</option>

                  </select>

                  <button className="remove-member-btn">

                    Remove

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>

    </div>
  );
}