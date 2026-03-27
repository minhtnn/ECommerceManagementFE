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
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { useState } from "react";

export const CategoryCombobox = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (id: string) => void;
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
  const selected = categories.find((c: any) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className="w-full justify-between h-8 text-xs font-normal truncate"
        >
          <span className="truncate">
            {selected ? selected.name : "Chọn danh mục..."}
          </span>
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
                      onSelect={() => {
                        onChange(c.id);
                        setOpen(false);
                      }}
                      className="text-xs"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3 w-3",
                          value === c.id ? "opacity-100" : "opacity-0",
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
  );
};