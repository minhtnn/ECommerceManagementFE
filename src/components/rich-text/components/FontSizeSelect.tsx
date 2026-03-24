// src/components/RichTextEditor/components/FontSizeSelect.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FONT_SIZES = ["10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "64"];

interface FontSizeSelectProps {
    value?: string;
    onChange: (size: string) => void;
}

export const FontSizeSelect = ({ value, onChange }: FontSizeSelectProps) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState(value?.replace("px", "") ?? "16");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInput(value?.replace("px", "") ?? "16");
    }, [value]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const apply = (val: string) => {
        const num = parseInt(val);
        if (!isNaN(num) && num > 0 && num <= 200) {
            onChange(`${num}px`);
            setInput(String(num));
        }
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <div className="flex items-center border rounded hover:bg-muted transition-colors">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && apply(input)}
                    onBlur={() => apply(input)}
                    className="w-8 text-xs text-center bg-transparent outline-none py-1"
                />
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="px-0.5 py-1 border-l"
                >
                    <ChevronDown className="h-2.5 w-2.5 text-muted-foreground" />
                </button>
            </div>

            {open && (
                <div className="absolute top-full left-0 mt-1 z-50
                                bg-background border rounded-lg shadow-lg
                                w-16 max-h-48 overflow-y-auto">
                    {FONT_SIZES.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => apply(s)}
                            className={cn(
                                "w-full text-left px-2 py-1 text-xs hover:bg-muted transition-colors",
                                input === s && "bg-muted text-primary font-medium"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};