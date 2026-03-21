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
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { CategoryTreeItem } from "./components/CategoryTreeItem";
import { ProductGrid } from "./components/ProductGrid";

const SORT_OPTIONS = [
  {
    value: "displayOrder_asc",
    label: "Thứ tự hiển thị",
    sortBy: "displayOrder",
    isAsc: true,
  },
  {
    value: "price_desc",
    label: "Giá giảm dần",
    sortBy: "price",
    isAsc: false,
  },
  { value: "price_asc", label: "Giá tăng dần", sortBy: "price", isAsc: true },
];

const ProductListPage = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const {
    currentChosenValue,
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    setChosenValue,
    setSort,
    setPage,
    setPageSize,
    filter,
    setFilter,
  } = useQueryParams({
    defaultSortBy: "displayOrder",
    defaultChosenValue: null,
    defaultFilter: [
      { id: "productName", value: "" },
      { id: "code", value: null },
      { id: "status", value: null },
    ],
  });

  const nameFilter = String(
    filter.find((f) => f.id === "productName")?.value ?? "",
  );

  const [committedSearch, setCommittedSearch] = useState(nameFilter);

  const currentSortValue =
    SORT_OPTIONS.find((o) => o.sortBy === sortBy && o.isAsc === isAsc)?.value ??
    "displayOrder_asc";

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

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError && error) {
    handleApiError(error);
  }

  const allProducts =
    data?.pages?.flatMap((page) => page?.data?.data?.products?.items ?? []) ??
    [];

  const categoriesTree =
    data?.pages?.[0]?.data?.data?.productCategoriesTree ?? [];

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
          <p>
            Hiện tại không có sản phẩm nào trong danh mục này. Vui lòng quay lại
            sau hoặc chọn danh mục khác.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
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

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-8 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="fill-accent text-accent" size={32} />
              <h1 className="text-3xl md:text-4xl font-bold">FLASH SALE</h1>
              <Zap className="fill-accent text-accent" size={32} />
            </div>
            <p className="text-primary-foreground/80">
              Chính hãng 100% - Ưu đãi có hạn
            </p>
          </div>

          <div className="flex items-center justify-end mb-4 gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Sắp xếp theo:
            </div>
            <div className="flex items-center gap-2">
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
            </div>
            <div className="flex items-center gap-2">
              <SearchInput
                value={nameFilter}
                isOpen={searchOpen}
                onOpenChange={setSearchOpen}
                onChange={(value) =>
                  setFilter(
                    filter.map((f) =>
                      f.id === "productName" ? { ...f, value } : f,
                    ),
                  )
                }
                onSearch={(value) => setCommittedSearch(value)}
              />
            </div>
          </div>
          <div className="relative">
            <ProductGrid
              products={allProducts}
              isFetching={isFetching}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              observerTarget={observerTarget}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
