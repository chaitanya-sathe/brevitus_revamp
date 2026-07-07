import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";
import {
  TextB, TextItalic, TextStrikethrough, ListBullets, ListNumbers,
  Quotes, LinkSimple, Code, ArrowUUpLeft, ArrowUUpRight, TextH,
  TextHOne, TextHTwo,
} from "@phosphor-icons/react";

function Btn({ onClick, active, children, testid }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      className={`p-2 rounded text-sm hover:bg-white/10 ${active ? "bg-white/15 text-white" : "text-zinc-300"}`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
    ],
    content: value || "",
    editorProps: { attributes: { class: "tiptap prose max-w-none focus:outline-none text-zinc-100" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
    // eslint-disable-next-line
  }, [value]);

  if (!editor) return null;

  return (
    <div className="border border-[#27272a] rounded-lg bg-[#111114]" data-testid="rich-text-editor">
      <div className="flex flex-wrap gap-1 p-2 border-b border-[#1f1f22]">
        <Btn testid="rte-h1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}><TextHOne size={16} /></Btn>
        <Btn testid="rte-h2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><TextHTwo size={16} /></Btn>
        <Btn testid="rte-h3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><TextH size={16} /></Btn>
        <div className="w-px bg-[#27272a] mx-1" />
        <Btn testid="rte-bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><TextB size={16} /></Btn>
        <Btn testid="rte-italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><TextItalic size={16} /></Btn>
        <Btn testid="rte-strike" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}><TextStrikethrough size={16} /></Btn>
        <div className="w-px bg-[#27272a] mx-1" />
        <Btn testid="rte-ul" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><ListBullets size={16} /></Btn>
        <Btn testid="rte-ol" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListNumbers size={16} /></Btn>
        <Btn testid="rte-quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quotes size={16} /></Btn>
        <Btn testid="rte-code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")}><Code size={16} /></Btn>
        <Btn testid="rte-link" onClick={() => {
          const url = window.prompt("URL");
          if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }} active={editor.isActive("link")}><LinkSimple size={16} /></Btn>
        <div className="w-px bg-[#27272a] mx-1" />
        <Btn testid="rte-undo" onClick={() => editor.chain().focus().undo().run()}><ArrowUUpLeft size={16} /></Btn>
        <Btn testid="rte-redo" onClick={() => editor.chain().focus().redo().run()}><ArrowUUpRight size={16} /></Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
