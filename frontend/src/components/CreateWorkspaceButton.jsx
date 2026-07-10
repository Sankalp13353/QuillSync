import React from "react";
import { FiPlus } from "react-icons/fi";

const CreateWorkspaceButton = ({ onCreate }) => {
  return (
    <div className="create-workspace-container">
      <button
        className="create-workspace-btn"
        onClick={onCreate}
      >
        <FiPlus />

        <span>Create Workspace</span>
      </button>
    </div>
  );
};

export default CreateWorkspaceButton;