"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Markdown } from "tiptap-markdown";
import {
    Bold,
    Code,
    Heading2,
    Heading3,
    Italic,
    List,
    ListOrdered,
    Quote,
    Strikethrough,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const CHAR_LIMIT = 10_000;

// ── Toolbar ───────────────────────────────────────────────────────────────────

interface ToolbarButtonProps {
    active?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
}

function ToolbarButton({ active, onClick, title, children }: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", active && "bg-accent text-accent-foreground")}
            onClick={onClick}
            title={title}
        >
            {children}
        </Button>
    );
}

interface ReviewEditorProps {
    /** Initial markdown content. */
    content?: string;
    onChange?: (markdown: string) => void;
    placeholder?: string;
}

export function ReviewEditor({ content = "", onChange, placeholder }: ReviewEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder ?? "Write your review…",
            }),
            CharacterCount.configure({ limit: CHAR_LIMIT }),
            Markdown.configure({ html: false, transformCopiedText: true }),
        ],
        content,
        immediatelyRender: false,
        onUpdate({ editor: e }) {
            onChange?.(e.storage.markdown.getMarkdown());
        },
    });

    if (!editor) return null;

    const charCount = editor.storage.characterCount.characters();
    const nearLimit = charCount > CHAR_LIMIT * 0.9;

    return (
        <div className="flex flex-col rounded-md border">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1">
                <ToolbarButton
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive("strike")}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-5" />

                <ToolbarButton
                    active={editor.isActive("heading", { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive("heading", { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-5" />

                <ToolbarButton
                    active={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet list"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive("orderedList")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Numbered list"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-5" />

                <ToolbarButton
                    active={editor.isActive("blockquote")}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive("code")}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    title="Inline code"
                >
                    <Code className="h-4 w-4" />
                </ToolbarButton>
            </div>

            {/* Editor */}
            <EditorContent
                editor={editor}
                className="prose prose-sm dark:prose-invert [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground min-h-[280px] max-w-none cursor-text px-4 py-3 focus-within:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
            />

            {/* Character count */}
            <div
                className={cn(
                    "border-t px-4 py-1.5 text-right text-xs",
                    nearLimit ? "text-destructive" : "text-muted-foreground",
                )}
            >
                {charCount.toLocaleString()} / {CHAR_LIMIT.toLocaleString()}
            </div>
        </div>
    );
}
