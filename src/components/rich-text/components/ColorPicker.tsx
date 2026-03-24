// src/components/RichTextEditor/components/ColorPicker.tsx
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const PRESET_COLORS = [
    "#000000", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#FFFFFF",
    "#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#8B5CF6",
    "#EC4899", "#14B8A6", "#F43F5E", "#06B6D4", "#84CC16", "#A855F7",
];

interface ColorPickerProps {
    color?: string;
    onChange: (color: string) => void;
    label: string;
    icon: React.ReactNode;
}

export const ColorPicker = ({ color, onChange, label, icon }: ColorPickerProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                title={label}
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-0.5 p-1.5 rounded hover:bg-muted transition-colors"
            >
                <div className="flex flex-col items-center gap-0.5">
                    {icon}
                    {/* Thanh màu hiện tại ở dưới icon */}
                    <div
                        className="w-3.5 h-1 rounded-sm"
                        style={{ backgroundColor: color ?? "#000000" }}
                    />
                </div>
                <ChevronDown className="h-2.5 w-2.5 text-muted-foreground" />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 z-50
                                bg-background border rounded-lg shadow-lg p-2 w-44">
                    {/* Color grid */}
                    <div className="grid grid-cols-6 gap-1 mb-2">
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                title={c}
                                onClick={() => { onChange(c); setOpen(false); }}
                                className={cn(
                                    "w-6 h-6 rounded border border-border/50",
                                    "hover:scale-110 transition-transform",
                                    color === c && "ring-2 ring-primary ring-offset-1"
                                )}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>

                    {/* Custom color input */}
                    <div className="flex items-center gap-1.5 pt-1 border-t">
                        <input
                            type="color"
                            value={color ?? "#000000"}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                        />
                        <span className="text-xs text-muted-foreground">Tùy chỉnh</span>
                    </div>
                </div>
            )}
        </div>
    );
};