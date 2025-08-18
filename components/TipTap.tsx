"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useCallback } from "react";

interface TipTapProps {
  content?: string;
  onUpdate?: (html: string) => void;
}

const TipTap = ({ content = "", onUpdate }: TipTapProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: true }), Image],
    content,
    onUpdate: ({ editor }) => onUpdate?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "w-full min-h-[150px] focus:outline-none p-2 border rounded",
      },
    },
    immediatelyRender: false,
  });

  const addImage = useCallback(() => {
    const url = prompt("Enter image URL");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="w-full">
      {/* Toolbar always visible */}
      <div className="flex gap-1 mb-2 flex-wrap">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}>
          S
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          U
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <button
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Link
        </button>
        <button onClick={addImage}>Image</button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTap;
