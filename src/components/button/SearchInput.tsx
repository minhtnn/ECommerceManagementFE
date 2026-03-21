import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void; // ← gọi khi Enter hoặc nhấn icon
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
}

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  isOpen,
  onOpenChange,
  placeholder = "Tìm sản phẩm...",
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    onOpenChange?.(false);
    onChange("");
    onSearch?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") handleClose();
    if (e.key === "Enter") onSearch?.(value);
  };

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "w-[220px] opacity-100" : "w-0 opacity-0",
        )}
      >
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-9 w-[220px]"
        />
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        onClick={() => {
          if (isOpen) {
            onSearch?.(value);
          } else {
            onOpenChange?.(true);
          }
        }}
      >
        {isOpen ? (
          <Search className="h-4 w-4" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>

      {isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
