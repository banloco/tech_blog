"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import css from "highlight.js/lib/languages/css";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  UnderlineIcon,
  Minus,
  CodeIcon,
} from "lucide-react";

// Create lowlight instance and register languages for syntax highlighting
const lowlight = createLowlight();
lowlight.register("js", javascript);
lowlight.register("ts", typescript);
lowlight.register("py", python);
lowlight.register("css", css);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Commencez à écrire votre article...",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration issues
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-emerald-400 underline hover:text-emerald-300",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-zinc-800 rounded-lg p-4 my-4 overflow-x-auto",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[500px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("URL du lien:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("URL de l'image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-zinc-700 rounded-lg bg-zinc-900 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-zinc-800 p-2 flex flex-wrap gap-1 bg-zinc-900/50">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-zinc-700 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("bold") ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Gras (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("italic") ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Italique (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("underline") ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Souligné (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("strike") ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Barré"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("code") ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Code inline"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-zinc-700 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("heading", { level: 1 }) ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Titre 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("heading", { level: 2 }) ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Titre 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("heading", { level: 3 }) ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Titre 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-zinc-700 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("bulletList") ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Liste à puces"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("orderedList") ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Liste numérotée"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("blockquote") ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Citation"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-zinc-700 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive({ textAlign: "left" }) ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Aligner à gauche"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive({ textAlign: "center" }) ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Centrer"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive({ textAlign: "right" }) ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Aligner à droite"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Insert */}
        <div className="flex gap-1 border-r border-zinc-700 pr-2 mr-1">
          <button
            type="button"
            onClick={addLink}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("link") ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Insérer un lien"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={addImage}
            className="p-2 rounded hover:bg-zinc-800 transition-colors text-zinc-400"
            title="Insérer une image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              editor.isActive("codeBlock") ? "bg-zinc-800 text-emerald-400" : "text-zinc-400"
            }`}
            title="Bloc de code"
          >
            <CodeIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-zinc-800 transition-colors text-zinc-400"
            title="Séparateur horizontal"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* History */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-zinc-800 transition-colors text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Annuler (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-zinc-800 transition-colors text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Rétablir (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-zinc-900">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
