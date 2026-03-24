// src/components/RichTextEditor/index.tsx
import { cn } from "@/lib/utils";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  RemoveFormatting,
  Strikethrough,
  Undo,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { ColorPicker } from "./components/ColorPicker";
import { FontSizeSelect } from "./components/FontSizeSelect";
import { FontSize } from "./extensions/FontSize";
import { ResizableImage } from "./extensions/ResizableImage";

const lowlight = createLowlight(common);

// Font families
const FONT_FAMILIES = [
  { label: "Mặc định", value: "" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Mono", value: "monospace" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
];

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Nhập nội dung bài đăng...",
}: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fontFamilyOpen, setFontFamilyOpen] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [bubbleMenu, setBubbleMenu] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // 4. Thêm onSelectionUpdate vào useEditor:
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      TextStyle,
      // BubbleMenuExtension,  ← XÓA DÒNG NÀY
      Color,
      Highlight.configure({ multicolor: true }),
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      ResizableImage.configure({ allowBase64: true, inline: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline cursor-pointer" },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      console.log("HTML OUTPUT:", editor.getHTML());
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;

      // Không có selection → ẩn bubble menu
      if (from === to) {
        setBubbleMenu(null);
        return;
      }

      // Lấy tọa độ vị trí selection để hiện bubble menu
      const container = editorContainerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const coords = editor.view.coordsAtPos(from);

      setBubbleMenu({
        // Hiện phía trên vị trí selection, relative với container
        top: coords.top - containerRect.top - 44,
        left: Math.max(0, coords.left - containerRect.left),
      });
    },
    onBlur: () => {
      // Delay để không ẩn ngay khi click vào bubble menu
      setTimeout(() => setBubbleMenu(null), 150);
    },
  });

  // Chèn ảnh dưới dạng base64 để preview
  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length || !editor) return;
      files.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Ảnh "${file.name}" vượt quá 5MB`);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          editor
            .chain()
            .focus()
            .setImage({ src: reader.result as string })
            .run();
        };
        reader.readAsDataURL(file);
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [editor],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (!editor) return;
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (!files.length) return;
      e.preventDefault();
      files.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Ảnh "${file.name}" vượt quá 5MB`);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          editor
            .chain()
            .focus()
            .setImage({ src: reader.result as string })
            .run();
        };
        reader.readAsDataURL(file);
      });
    },
    [editor],
  );

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Nhập URL:", prev);
    if (url === null) return;
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  }, [editor]);

  if (!editor) return null;

  const currentFontFamily = editor.getAttributes("textStyle").fontFamily ?? "";
  const currentFontSize = editor.getAttributes("textStyle").fontSize;
  const currentColor = editor.getAttributes("textStyle").color;
  const currentHighlight = editor.getAttributes("highlight").color;
  const wordCount = editor.getText().split(/\s+/).filter(Boolean).length;

  return (
    <div
      ref={editorContainerRef}
      className={cn(
        "border rounded-md overflow-hidden bg-background relative",
        disabled && "opacity-60 pointer-events-none",
      )}
    >
      {/* ════════════════════════════════
                ROW 1: History | Format | Font
                ════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1 border-b bg-muted/20">
        {/* History */}
        <Btn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Hoàn tác (Ctrl+Z)"
        >
          <Undo className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Làm lại (Ctrl+Y)"
        >
          <Redo className="h-3.5 w-3.5" />
        </Btn>

        <Sep />

        {/* Font family dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setFontFamilyOpen((o) => !o)}
            className="flex items-center gap-1 px-2 py-1 text-xs
                                   border rounded hover:bg-muted transition-colors min-w-[100px]"
          >
            <span className="truncate">
              {FONT_FAMILIES.find((f) => f.value === currentFontFamily)
                ?.label ?? "Mặc định"}
            </span>
            <ChevronDown className="h-2.5 w-2.5 text-muted-foreground ml-auto" />
          </button>
          {fontFamilyOpen && (
            <div
              className="absolute top-full left-0 mt-1 z-50
                                        bg-background border rounded-lg shadow-lg w-44"
            >
              {FONT_FAMILIES.map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (value) {
                      editor
                        .chain()
                        .focus()
                        .setMark("textStyle", { fontFamily: value })
                        .run();
                    } else {
                      editor.chain().focus().unsetMark("textStyle").run();
                    }
                    setFontFamilyOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors",
                    currentFontFamily === value &&
                      "bg-muted text-primary font-medium",
                  )}
                  style={{ fontFamily: value || undefined }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Sep />

        {/* Font size */}
        <FontSizeSelect
          value={currentFontSize}
          onChange={(size) => editor.chain().focus().setFontSize(size).run()}
        />

        <Sep />

        {/* Bold / Italic / Underline / Strike */}
        <Btn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Đậm (Ctrl+B)"
        >
          <Bold className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Nghiêng (Ctrl+I)"
        >
          <Italic className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Gạch ngang"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </Btn>

        <Sep />

        {/* Text color & Highlight */}
        <ColorPicker
          color={currentColor}
          onChange={(c) => editor.chain().focus().setColor(c).run()}
          label="Màu chữ"
          icon={<span className="text-xs font-bold leading-none">A</span>}
        />
        <ColorPicker
          color={currentHighlight}
          onChange={(c) =>
            editor.chain().focus().toggleHighlight({ color: c }).run()
          }
          label="Màu nền chữ"
          icon={
            <span
              className="text-xs font-bold leading-none
                                         bg-yellow-300 px-0.5 rounded-sm"
            >
              A
            </span>
          }
        />

        <Sep />

        {/* Remove formatting */}
        <Btn
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          title="Xóa định dạng"
        >
          <RemoveFormatting className="h-3.5 w-3.5" />
        </Btn>
      </div>

      {/* ════════════════════════════════
                ROW 2: Headings | Align | Lists | Insert
                ════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1 border-b bg-muted/20">
        {/* Headings */}
        <Btn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Tiêu đề 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Tiêu đề 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Tiêu đề 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </Btn>

        <Sep />

        {/* Text alignment */}
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Căn trái"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Căn giữa"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Căn phải"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          title="Căn đều"
        >
          <AlignJustify className="h-3.5 w-3.5" />
        </Btn>

        <Sep />

        {/* Lists */}
        <Btn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Danh sách"
        >
          <List className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Danh sách số"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Trích dẫn"
        >
          <Quote className="h-3.5 w-3.5" />
        </Btn>

        <Sep />

        {/* Insert */}
        <Btn
          onClick={handleSetLink}
          active={editor.isActive("link")}
          title="Chèn link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code block"
        >
          <Code2 className="h-3.5 w-3.5" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Đường kẻ ngang"
        >
          <Minus className="h-3.5 w-3.5" />
        </Btn>
        <Btn onClick={() => fileInputRef.current?.click()} title="Chèn ảnh">
          <ImagePlus className="h-3.5 w-3.5" />
        </Btn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageSelect}
        />
      </div>

      {/* ── BubbleMenu: hiện khi bôi chọn text ── */}
      {bubbleMenu && editor && (
        <div
          className="absolute z-50 flex items-center gap-0.5 px-2 py-1
                           bg-background border rounded-lg shadow-lg"
          style={{ top: bubbleMenu.top, left: bubbleMenu.left }}
          // Ngăn onBlur của editor fire khi click vào bubble menu
          onMouseDown={(e) => e.preventDefault()}
        >
          <Btn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Đậm"
          >
            <Bold className="h-3 w-3" />
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Nghiêng"
          >
            <Italic className="h-3 w-3" />
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Gạch ngang"
          >
            <Strikethrough className="h-3 w-3" />
          </Btn>
          <Sep />
          <Btn
            onClick={handleSetLink}
            active={editor.isActive("link")}
            title="Link"
          >
            <LinkIcon className="h-3 w-3" />
          </Btn>
          <ColorPicker
            color={currentColor}
            onChange={(c) => editor.chain().focus().setColor(c).run()}
            label="Màu chữ"
            icon={<span className="text-xs font-bold">A</span>}
          />
        </div>
      )}

      {/* ── Editor area ── */}
      <EditorContent
        editor={editor}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "prose prose-sm max-w-none p-4 min-h-[400px]",
          "[&_.ProseMirror]:outline-none",
          "[&_.ProseMirror]:min-h-[380px]",
          // Placeholder
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
          // Code block
          "[&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:rounded-lg",
          "[&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:my-4",
          "[&_.ProseMirror_code]:text-sm [&_.ProseMirror_code]:font-mono",
        )}
      />

      {/* ── Footer ── */}
      <div className="px-4 py-1.5 border-t bg-muted/20 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          Kéo ảnh vào editor để chèn • Bôi chọn text để định dạng nhanh
        </span>
        <span className="text-xs text-muted-foreground">{wordCount} từ</span>
      </div>
    </div>
  );
};

// ── Shared sub-components ──
const Btn = ({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "p-1.5 rounded transition-colors",
      "hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed",
      active && "bg-muted text-primary",
    )}
  >
    {children}
  </button>
);

const Sep = () => (
  <span className="w-px h-4 bg-border mx-0.5 self-center shrink-0" />
);

export default RichTextEditor;
