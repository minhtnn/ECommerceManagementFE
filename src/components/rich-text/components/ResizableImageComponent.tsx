// src/components/RichTextEditor/components/ResizableImageComponent.tsx
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
    AlignLeft, AlignCenter, AlignRight,
    AlignVerticalJustifyCenter,
} from "lucide-react";

const MIN_WIDTH = 50;

const ResizableImageComponent = ({
    node,
    updateAttributes,
    selected,
}: NodeViewProps) => {
    const { src, alt, width, height, alignment } = node.attrs;
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);

    // ── Resize bằng cách kéo handle góc phải dưới ──
    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const startX = e.clientX;
            const startWidth = imgRef.current?.offsetWidth ?? 200;

            setIsResizing(true);

            const onMouseMove = (ev: MouseEvent) => {
                const newWidth = Math.max(
                    MIN_WIDTH,
                    startWidth + (ev.clientX - startX)
                );
                updateAttributes({ width: `${newWidth}px`, height: "auto" });
            };

            const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [updateAttributes]
    );

    // ── Alignment class ──
    const wrapperClass = {
        left:   "flex justify-start",
        center: "flex justify-center",
        right:  "flex justify-end",
        // wrap: ảnh float, text chảy xung quanh
        "wrap-left":  "float-left mr-4 mb-2",
        "wrap-right": "float-right ml-4 mb-2",
    }[alignment as string] ?? "flex justify-center";

    const isFloat = alignment === "wrap-left" || alignment === "wrap-right";

    return (
        <NodeViewWrapper
            className={cn(
                "relative inline-block my-2",
                isFloat ? wrapperClass : `block w-full ${wrapperClass}`,
                selected && "outline outline-2 outline-primary rounded"
            )}
        >
            <div ref={containerRef} className="relative inline-block group">
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    style={{
                        width: width ?? "auto",
                        height: height ?? "auto",
                        maxWidth: "100%",
                        display: "block",
                    }}
                    className="rounded"
                    draggable={false}
                />

                {/* ── Resize handle góc phải dưới ── */}
                {selected && (
                    <div
                        onMouseDown={handleMouseDown}
                        className={cn(
                            "absolute bottom-0 right-0 w-3 h-3 rounded-tl",
                            "bg-primary cursor-se-resize",
                            "opacity-80 hover:opacity-100 transition-opacity"
                        )}
                    />
                )}

                {/* ── Toolbar alignment khi selected ── */}
                {selected && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-10
                                    flex items-center gap-0.5 px-1.5 py-1
                                    bg-background border rounded shadow-md">
                        {[
                            { icon: <AlignLeft className="h-3 w-3" />,   value: "left",        title: "Căn trái" },
                            { icon: <AlignCenter className="h-3 w-3" />, value: "center",      title: "Căn giữa" },
                            { icon: <AlignRight className="h-3 w-3" />,  value: "right",       title: "Căn phải" },
                            { icon: <AlignVerticalJustifyCenter className="h-3 w-3" />, value: "wrap-left",  title: "Text quanh trái" },
                            { icon: <AlignVerticalJustifyCenter className="h-3 w-3 scale-x-[-1]" />, value: "wrap-right", title: "Text quanh phải" },
                        ].map(({ icon, value, title }) => (
                            <button
                                key={value}
                                type="button"
                                title={title}
                                onClick={() => updateAttributes({ alignment: value })}
                                className={cn(
                                    "p-1 rounded transition-colors",
                                    "hover:bg-muted",
                                    alignment === value && "bg-muted text-primary"
                                )}
                            >
                                {icon}
                            </button>
                        ))}

                        {/* Preset kích thước */}
                        {[
                            { label: "25%", value: "25%" },
                            { label: "50%", value: "50%" },
                            { label: "75%", value: "75%" },
                            { label: "100%", value: "100%" },
                        ].map(({ label, value }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() =>
                                    updateAttributes({ width: value, height: "auto" })
                                }
                                className={cn(
                                    "px-1.5 py-0.5 text-xs rounded transition-colors",
                                    "hover:bg-muted border border-border/50",
                                    width === value && "bg-muted text-primary"
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
};

export default ResizableImageComponent;