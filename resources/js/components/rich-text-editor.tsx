import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Code2,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo2,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo2,
} from 'lucide-react';
import { useCallback, useEffect } from 'react';

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: string;
}

type ToolbarButtonProps = {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title?: string;
    children: React.ReactNode;
};

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onClick={onClick}
            style={
                active
                    ? { backgroundColor: '#265243', color: '#ffffff' }
                    : { color: '#265243' }
            }
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                active
                    ? 'shadow-xs'
                    : 'hover:bg-[#dce8d7]'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-5 bg-[#b8ceb0] mx-1" />;
}

export function RichTextEditor({ value, onChange, placeholder = 'Mulai menulis...', minHeight = '400px' }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Heading.configure({ levels: [1, 2, 3] }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Underline,
            TextStyle,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-[#265243] underline font-semibold' },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus:outline-none px-6 py-5 text-[#142921] font-semibold',
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '', false);
        }
    }, [value]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Masukkan URL:', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0' }} className="rounded-2xl border-2 overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div style={{ backgroundColor: '#f4f8f3', borderColor: '#b8ceb0' }} className="flex flex-wrap items-center gap-0.5 px-3.5 py-2.5 border-b-2">
                {/* Undo / Redo */}
                <ToolbarButton
                    title="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo2 className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Headings */}
                <ToolbarButton
                    title="Heading 1"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive('heading', { level: 1 })}
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 2"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 3"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                >
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Marks */}
                <ToolbarButton
                    title="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Underline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive('underline')}
                >
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Strikethrough"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive('strike')}
                >
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Kode Inline"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive('code')}
                >
                    <Code2 className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Lists */}
                <ToolbarButton
                    title="Bullet List"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Ordered List"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Text Align */}
                <ToolbarButton
                    title="Rata Kiri"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    active={editor.isActive({ textAlign: 'left' })}
                >
                    <AlignLeft className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Rata Tengah"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    active={editor.isActive({ textAlign: 'center' })}
                >
                    <AlignCenter className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Rata Kanan"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    active={editor.isActive({ textAlign: 'right' })}
                >
                    <AlignRight className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Rata Kiri-Kanan"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    active={editor.isActive({ textAlign: 'justify' })}
                >
                    <AlignJustify className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Extras */}
                <ToolbarButton
                    title="Blockquote"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Garis Horizontal"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <Minus className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Tambah Link"
                    onClick={setLink}
                    active={editor.isActive('link')}
                >
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Area */}
            <div
                className="cursor-text bg-white"
                style={{ minHeight }}
                onClick={() => editor.commands.focus()}
            >
                <EditorContent editor={editor} />
            </div>

            {/* Word count */}
            <div className="px-6 py-2.5 border-t-2 border-[#b8ceb0] flex items-center justify-end bg-[#f4f8f3]">
                <span className="text-xs text-[#142921] font-bold">
                    {editor.storage.characterCount?.words?.() ?? editor.getText().trim().split(/\s+/).filter(Boolean).length} kata
                </span>
            </div>
        </div>
    );
}
