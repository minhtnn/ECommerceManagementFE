import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useProduct } from "@/hooks/use-product";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { useState } from "react";

export const ProductCombobox = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { getProducts } = useProduct();
 
  const { data, isLoading } = getProducts({ size: 100, allowFetch: open });
  const products = data?.data?.data?.items ?? [];
  const selected = products.find((p: any) => p.id === value);
 
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
            {selected ? selected.name : "Chọn sản phẩm..."}
          </span>
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Tìm sản phẩm..." className="text-xs" />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>Không tìm thấy</CommandEmpty>
                <CommandGroup>
                  {products.map((p: any) => (
                    <CommandItem
                      key={p.id}
                      value={p.id}
                      onSelect={() => {
                        onChange(p.id);
                        setOpen(false);
                      }}
                      className="text-xs"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3 w-3",
                          value === p.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {p.code} — {p.name}
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