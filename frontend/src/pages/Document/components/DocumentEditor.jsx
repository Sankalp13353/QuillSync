import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
// import Underline from "@tiptap/extension-underline";
import {useEffect} from "react";

import { FiSave,
         FiSend,
         FiRotateCcw,
         FiRotateCw,
} from "react-icons/fi";

export default function DocumentEditor({ content, role, onSave, onSubmitDraft }) {
  console.log("Incoming content:", content);
  const canEdit = ["OWNER", "MANAGER", "EDITOR"].includes(role);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ 
        placeholder:"Start typing your ideas you want to get come true...",
      }),
    ],
    content: content || { 
      type: "doc",
      content: [
        {
           type: "paragraph",
        },
      ],
    },
    editable: canEdit,
  });

  useEffect(() => {
    if(editor && content){
      editor.commands.setContent(content)
    }
  }, [content,editor])

  if (!editor) return null;

  const handleAction = async() => {
    const json = editor.getJSON();
    console.log("Saving....",json)

    if (["OWNER", "MANAGER"].includes(role)){
      await onSave(json);
    }else{ 
      await onSubmitDraft(json);
    }
  };

  return (

    <div className="doc-editor-wrapper">
      {canEdit && (
        <div className="doc-editor-toolbar">

          {/* Undo */}
          <button
            className="toolbar-btn"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <FiRotateCcw />
          </button>

          {/* Redo */}
          <button
            className="toolbar-btn"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <FiRotateCw />
          </button>

          {/* Bold */}
          <button
            className={`toolbar-btn ${
              editor.isActive("bold") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </button>

          {/* Italic */}
          <button
            className={`toolbar-btn ${
              editor.isActive("italic") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </button>

          {/* Underline */}
          <button
            className={`toolbar-btn ${
              editor.isActive("underline") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <u>U</u>
          </button>

          {/* Heading 1 */}
          <button
            className={`toolbar-btn ${
              editor.isActive("heading", { level: 1 }) ? "active" : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </button>

          {/* Heading 2 */}
          <button
            className={`toolbar-btn ${
              editor.isActive("heading", { level: 2 }) ? "active" : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>

          {/* Bullet List */}
          <button
            className={`toolbar-btn ${
              editor.isActive("bulletList") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • List
          </button>

          {/* Ordered List */}
          <button
            className={`toolbar-btn ${
              editor.isActive("orderedList") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1.
          </button>

          {/* Code Block */}
          <button
            className={`toolbar-btn ${
              editor.isActive("codeBlock") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            {"</>"}
          </button>
          
          {/* Save */}
          <button
            className="doc-save-btn"
            onClick={handleAction}
          >
            {["OWNER", "MANAGER"].includes(role) ? (
              <>
                <FiSave /> Save
              </>
            ) : (
              <>
                <FiSend /> Submit Draft
              </>
            )}
          </button>

        </div>
      )}
      <EditorContent
        editor={editor}
        className="doc-editor-content"
      />
      {!canEdit && (
        <p className="doc-viewer-note">
          You have view-only access to this document.
        </p>
      )}
    </div>
  );
}