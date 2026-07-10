import React from "react";
import { FiPlus, FiUserPlus } from "react-icons/fi";
import { workspace } from "../../data/workspaceMockData";

const WorkspaceHeader = () => {
  return (
    <section className="workspace-header">

      <div className="workspace-header-left">

        <h1 className="workspace-title">
          {workspace.name}
        </h1>

        <p className="workspace-description">
          {workspace.description}
        </p>

      </div>

      <div className="workspace-header-right">

        <button className="secondary-btn">
          <FiUserPlus />
          Invite Member
        </button>

        <button className="primary-btn">
          <FiPlus />
          New Document
        </button>

      </div>

    </section>
  );
};

export default WorkspaceHeader;