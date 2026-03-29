import { SearchInput } from "@/components/button/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductMenu } from "@/hooks/use-product-menu";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { Loader2, Zap } from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { CategoryTreeItem } from "./components/CategoryTreeItem";
import { ProductGrid } from "./components/ProductGrid";

// ---------------------------------------------------------------------------
// Constants — outside component to avoid recreation
// ---------------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: "displayOrder_asc", label: "Thứ tự hiển thị", sortBy: "displayOrder", isAsc: true },
  { value: "price_desc",       label: "Giá giảm dần",    sortBy: "price",         isAsc: false },
  { value: "price_asc",        label: "Giá tăng dần",    sortBy: "price",         isAsc: true },
] as const;

const DEFAULT_FILTER = [
  { id: "productName", value: "" },
  { id: "code",        value: null },
  { id: "status",      value: null },
] as const;

// ---------------------------------------------------------------------------
// Flash Sale header — memoized, never re-renders
// ---------------------------------------------------------------------------

const FlashSaleHeader = memo(() => (
  <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-8 mb-8 text-center">
    <div className="flex items-center justify-center gap-2 mb-2">
      <Zap className="fill-accent text-accent" size={32} />
      <h1 className="text-3xl md:text-4xl font-bold">FLASH SALE</h1>
      <Zap className="fill-accent text-accent" size={32} />
    </div>
    <p className="text-primary-foreground/80">Chính hãng 100% - Ưu đãi có hạn</p>
  </div>
));
FlashSaleHeader.displayName = "FlashSaleHeader";

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const ProductListPage = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const {
    currentChosenValue,
    pageSize,
    sortBy,
    isAsc,
    setChosenValue,
    setSort,
    filter,
    setFilter,
  } = useQueryParams({
    defaultSortBy: "displayOrder",
    defaultChosenValue: null,
    defaultFilter: [...DEFAULT_FILTER],
  });

  const nameFilter = String(filter.find((f) => f.id === "productName")?.value ?? "");

  /*
    PERF: Debounce search at 350ms so we don't fire API requests on every
    keystroke. committedSearch only updates after the user stops typing.
  */
  const [debouncedSearch] = useDebounce(nameFilter, 350);
  const [committedSearch, setCommittedSearch] = useState(nameFilter);

  // Sync debounced value → committed (for auto-search while typing)
  useEffect(() => {
    setCommittedSearch(debouncedSearch);
  }, [debouncedSearch]);

  const currentSortValue = useMemo(
    () =>
      SORT_OPTIONS.find((o) => o.sortBy === sortBy && o.isAsc === isAsc)?.value ??
      "displayOrder_asc",
    [sortBy, isAsc],
  );

  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find((o) => o.value === value);
    if (option) setSort(option.sortBy, option.isAsc);
  };

  const { getPublicProductMenu } = useProductMenu();
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = getPublicProductMenu({
    categoryId: currentChosenValue ?? undefined,
    size: pageSize,
    productsSortBy: sortBy,
    productsIsAsc: isAsc,
    productName: committedSearch,
  });

  /*
    PERF: IntersectionObserver is created once and stored in a ref.
    Previously it was recreated on every render because it was inside
    useEffect with deps that changed frequently (hasNextPage, isFetchingNextPage).
    Now we use refs for the callbacks to keep the observer instance stable.
  */
  const observerTarget = useRef<HTMLDivElement>(null);
  const hasNextPageRef  = useRef(hasNextPage);
  const isFetchingRef   = useRef(isFetchingNextPage);
  hasNextPageRef.current  = hasNextPage;
  isFetchingRef.current   = isFetchingNextPage;

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPageRef.current && !isFetchingRef.current) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }, // Pre-fetch 200px before sentinel visible
    );

    observer.observe(target);
    return () => observer.disconnect();
    // fetchNextPage is stable from React Query — safe dep
  }, [fetchNextPage]);

  if (isError && error) handleApiError(error);

  const allProducts = useMemo(
    () => data?.pages?.flatMap((page) => page?.data?.data?.products?.items ?? []) ?? [],
    [data?.pages],
  );

  const categoriesTree = data?.pages?.[0]?.data?.data?.productCategoriesTree ?? [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (categoriesTree.length === 0 && allProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-foreground/70">
          <h2 className="text-2xl font-semibold mb-4">Không có sản phẩm nào</h2>
          <p>Hiện tại không có sản phẩm nào trong danh mục này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wide">
              Danh mục
            </h3>
            <div className="space-y-1">
              {categoriesTree.map((category) => (
                <CategoryTreeItem
                  key={category.id}
                  category={category}
                  selectedId={currentChosenValue}
                  onSelect={setChosenValue}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-3">
          <FlashSaleHeader />

          <div className="flex items-center justify-end mb-4 gap-4">
            <div className="text-sm font-medium text-muted-foreground">Sắp xếp theo:</div>
            <Select value={currentSortValue} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <SearchInput
              value={nameFilter}
              isOpen={searchOpen}
              onOpenChange={setSearchOpen}
              onChange={(value) =>
                setFilter(filter.map((f) => (f.id === "productName" ? { ...f, value } : f)))
              }
              onSearch={setCommittedSearch}
            />
          </div>

          <ProductGrid
            products={allProducts}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage ?? false}
            fetchNextPage={fetchNextPage}
            observerTarget={observerTarget}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;