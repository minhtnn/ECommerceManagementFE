import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useProductCategory } from "@/hooks/use-product-category";
import { cn } from "@/lib/utils";
import { EProductStatus } from "@/types/enums/product-status.enum";
import { Check, ChevronsUpDown, LoaderCircle, X } from "lucide-react";
import { useState } from "react";

export const CategoryMultiCombobox = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { getProductCategories } = useProductCategory();
 
  const { data, isLoading } = getProductCategories({
    size: 100,
    isLeafOnly: true,
    status: EProductStatus.Active,
    allowFetch: open,
  });
  const categories = data?.data?.data?.items ?? [];
  const selectedIds = value ? value.split(",").filter(Boolean) : [];
 
  const toggle = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onChange(next.join(","));
  };
 
  const getNameById = (id: string) =>
    categories.find((c: any) => c.id === id)?.name ?? id.slice(0, 8) + "...";
 
  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className="w-full justify-between h-8 text-xs font-normal"
          >
            {selectedIds.length > 0
              ? `Đã chọn ${selectedIds.length} danh mục`
              : "Chọn danh mục..."}
            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Tìm danh mục..." className="text-xs" />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <CommandEmpty>Không tìm thấy</CommandEmpty>
                  <CommandGroup>
                    {categories.map((c: any) => (
                      <CommandItem
                        key={c.id}
                        value={c.id}
                        onSelect={() => toggle(c.id)}
                        className="text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-3 w-3",
                            selectedIds.includes(c.id)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {c.code} — {c.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedIds.map((id) => (
            <Badge key={id} variant="secondary" className="text-xs gap-1 pr-1">
              <span className="max-w-[100px] truncate">{getNameById(id)}</span>
              <button
                type="button"
                onClick={() => toggle(id)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};