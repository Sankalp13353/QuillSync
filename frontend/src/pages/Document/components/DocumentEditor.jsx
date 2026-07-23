import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FiSave, FiSend } from "react-icons/fi";

export default function DocumentEditor({ content, role, onSave, onSubmitDraft }) {
  const canEdit = ["OWNER", "MANAGER", "EDITOR"].includes(role);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content || { type: "doc", content: [] },
    editable: canEdit,
  });

  if (!editor) return null;

  const handleAction = () => {
    const json = editor.getJSON();
    if (["OWNER", "MANAGER"].includes(role)) onSave(json);
    else onSubmitDraft(json);
  };

  return (
    <div className="doc-editor-wrapper">
      {canEdit && (
        <div className="doc-editor-toolbar">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={`toolbar-btn ${editor.isActive("bold") ? "active" : ""}`}>B</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`toolbar-btn ${editor.isActive("italic") ? "active" : ""}`}><em>I</em></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`toolbar-btn ${editor.isActive("heading", { level: 1 }) ? "active" : ""}`}>H1</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`toolbar-btn ${editor.isActive("heading", { level: 2 }) ? "active" : ""}`}>H2</button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`toolbar-btn ${editor.isActive("bulletList") ? "active" : ""}`}>• List</button>
          <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`toolbar-btn ${editor.isActive("codeBlock") ? "active" : ""}`}>{"</>"}</button>
          <button className="doc-save-btn" onClick={handleAction}>
            {["OWNER", "MANAGER"].includes(role) ? <><FiSave /> Save</> : <><FiSend /> Submit Draft</>}
          </button>
        </div>
      )}
      <EditorContent editor={editor} className="doc-editor-content" />
      {!canEdit && <p className="doc-viewer-note">You have view-only access to this document.</p>}
    </div>
  );
}
