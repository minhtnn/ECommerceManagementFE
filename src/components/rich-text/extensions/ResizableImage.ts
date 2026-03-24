// src/components/RichTextEditor/extensions/ResizableImage.ts
import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImageComponent from "../components/ResizableImageComponent";

function getAlignmentStyle(alignment: string): string {
    switch (alignment) {
        case "wrap-left":
            return "float:left;margin-right:1.5rem;margin-bottom:0.5rem;margin-top:0.25rem;max-width:50%;";
        case "wrap-right":
            return "float:right;margin-left:1.5rem;margin-bottom:0.5rem;margin-top:0.25rem;max-width:50%;";
        case "left":
            return "display:block;margin-left:0;margin-right:auto;float:none;";
        case "right":
            return "display:block;margin-left:auto;margin-right:0;float:none;";
        case "center":
        default:
            return "display:block;margin-left:auto;margin-right:auto;float:none;";
    }
}

export const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                parseHTML: (el) =>
                    el.getAttribute("width") || el.style.width || null,
                renderHTML: (attrs) => {
                    if (!attrs.width) return {};
                    return {
                        width: attrs.width,
                        // Merge width vào style bên dưới thay vì set riêng
                        // để tránh conflict
                    };
                },
            },
            height: {
                default: null,
                parseHTML: (el) =>
                    el.getAttribute("height") || el.style.height || null,
                renderHTML: () => ({}), // handle trong alignment renderHTML
            },
            alignment: {
                default: "center",
                parseHTML: (el) =>
                    el.getAttribute("data-alignment") || "center",
                renderHTML: (attrs) => {
                    const alignStyle = getAlignmentStyle(
                        attrs.alignment ?? "center"
                    );
                    const widthStyle = attrs.width
                        ? `width:${attrs.width};`
                        : "";
                    const heightStyle = attrs.height
                        ? `height:${attrs.height};`
                        : "";

                    return {
                        "data-alignment": attrs.alignment ?? "center",
                        // Inline style là nguồn sự thật khi render qua dangerouslySetInnerHTML
                        style: `${alignStyle}${widthStyle}${heightStyle}`,
                    };
                },
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageComponent);
    },
});