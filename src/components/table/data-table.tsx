import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  type ColumnDef,
  type ColumnFilter,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  type TableMeta,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { DateTimePicker } from "../ui/date-time-picker";

export type TProductDisplayOrder = {
  productVariantId: string;
  displayOrder: number;
};

export type TProductQuantity = {
  productVariantId: string;
  quantity: number;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    quantityValues?: TProductQuantity[];
    onQuantityChange?: (productVariantId: string, quantity: number) => void;
    displayOrderValues?: TProductDisplayOrder[];
    onDisplayOrderChange?: (productVariantId: string, displayOrder: number) => void;
    conditionType?: number;
    onPoQuantityChange?: (id: string, quantity: number) => void;
  }
}

interface SearchStateProps extends ColumnFilter {
  searchPlaceholder?: string;
  isSelect?: boolean;
  options?: { label: string; value: string }[];
  isStartDate?: boolean;
  isEndDate?: boolean;
}

interface DataTableProps<TData, TValue> {
  isShort?: boolean;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  isPagingProp?: boolean;
  pageSizeOptions?: number[];
  searchValues?: SearchStateProps[];
  onSearchChange?: (value: ColumnFiltersState) => void;
  sortValues?: SortingState;
  onSortChange?: (value: SortingState) => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
  showSettings?: boolean;
  onSettings?: () => void;
  title?: string;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (
    newSelection: Record<string, boolean>,
    oldSelection: Record<string, boolean>
  ) => void;
  meta?: TableMeta<TData>;
}

function TableSkeleton<TData, TValue>({
  columns,
  pageSize,
}: {
  columns: ColumnDef<TData, TValue>[];
  pageSize: number;
}) {
  const skeletonRows = Array.from({ length: pageSize }, (_, index) => index);
  const columnCount = columns.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((_, index) => (
            <TableHead 
              key={index}
              style={{ width: `${100 / columnCount}%` }}
            >
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeletonRows.map((rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((_, colIndex) => (
              <TableCell 
                key={colIndex}
                style={{ width: `${100 / columnCount}%` }}
              >
                <Skeleton
                  className={cn(
                    "h-4",
                    colIndex % 3 === 0 ? "w-24" : colIndex % 3 === 1 ? "w-32" : "w-16"
                  )}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function DataTable<TData, TValue>({
  isShort = false,
  columns,
  data,
  totalItems,
  onRowClick,
  pageSizeOptions = [5, 10, 20, 30, 40, 50, 100, 200, 500],
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isPagingProp = true,
  isLoading = false,
  searchValues = [],
  onSearchChange,
  sortValues = [],
  onSortChange,
  showRefresh = true,
  onRefresh,
  showSettings = true,
  onSettings,
  rowSelection,
  onRowSelectionChange,
  meta,
}: DataTableProps<TData, TValue>) {
  const [rowSelectionState, setRowSelectionState] = useState({});
  const [inputValues, setInputValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(searchValues.map((f) => [f.id, String(f.value ?? "")]))
  );

  const paginationState = {
    pageIndex: currentPage - 1,
    pageSize,
  };

  const pageCount = Math.ceil(totalItems / pageSize);
  const columnCount = columns.length;

  const handlePaginationChange = (
    updater: PaginationState | ((old: PaginationState) => PaginationState)
  ) => {
    const next = typeof updater === "function" ? updater(paginationState) : updater;
    onPageChange(next.pageIndex + 1);
    onPageSizeChange(next.pageSize);
  };

  const handleColumnFiltersChange = (
    updater: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => {
    const next = typeof updater === "function" ? updater(searchValues) : updater;
    onSearchChange?.(next);
  };

  const handleSortingChange = (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => {
    const next = typeof updater === "function" ? updater([]) : updater;
    onSortChange?.(next);
  };

  const handleRowSelectionChange = (
    updater: Record<string, boolean> | ((old: Record<string, boolean>) => Record<string, boolean>)
  ) => {
    const oldSelection = rowSelection;
    const newSelection = typeof updater === "function" ? updater(rowSelection!) : updater;
    onRowSelectionChange?.(newSelection, oldSelection!);
  };

  const table = useReactTable({
    getRowId: (row) => (row as any).id,
    data,
    columns,
    pageCount,
    state: {
      pagination: paginationState,
      columnFilters: searchValues,
      sorting: sortValues,
      rowSelection: rowSelection ?? rowSelectionState,
    },
    onPaginationChange: handlePaginationChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: (onRowSelectionChange && handleRowSelectionChange) || setRowSelectionState,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    meta,
  });

  const renderSearchField = (search: SearchStateProps) => {
    if (search.isStartDate || search.isEndDate) {
      const startDateValue = searchValues.find((s) => s.isStartDate)?.value;
      const endDateValue = searchValues.find((s) => s.isEndDate)?.value;
      const fromDate = search.isEndDate && startDateValue ? new Date(startDateValue as string) : undefined;
      const toDate = search.isStartDate && endDateValue ? new Date(endDateValue as string) : undefined;

      return (
        <div key={search.id} className="flex flex-col gap-1.5 min-w-[180px]">
          <span className="text-sm font-medium text-muted-foreground">
            {search.searchPlaceholder}
          </span>
          <DateTimePicker
            date={search.value ? new Date(search.value as string) : undefined}
            setDate={(date) => {
              const newFilters: ColumnFiltersState = searchValues.map((s) => ({
                id: s.id,
                value: s.id === search.id ? (date ? format(date, "yyyy-MM-dd'T'HH:mm:ss") : null) : s.value,
              }));
              onSearchChange?.(newFilters);
            }}
            placeholder={search.searchPlaceholder}
            disabled={isLoading}
            fromDate={fromDate}
            toDate={toDate}
          />
        </div>
      );
    }

    if (search.isSelect) {
      return (
        <div key={search.id} className="flex flex-col gap-1.5 min-w-[180px]">
          <span className="text-sm font-medium text-muted-foreground">
            {search.searchPlaceholder || "Tìm kiếm"}
          </span>
          <Select
            value={search.value as string}
            onValueChange={(value) => {
              const newFilters: ColumnFiltersState = searchValues.map((s) => ({
                id: s.id,
                value: s.id === search.id ? value : s.value,
              }));
              onSearchChange?.(newFilters);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full bg-sidebar">
              <SelectValue placeholder={search.searchPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {search.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    const currentValue = inputValues[search.id] ?? "";
    return (
      <div key={search.id} className="relative flex-1 min-w-[200px] max-w-sm">
        <Input
          placeholder={search.searchPlaceholder || "Tìm kiếm..."}
          value={currentValue}
          onChange={(e) =>
            setInputValues((prev) => ({
              ...prev,
              [search.id]: e.target.value,
            }))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const newFilters: ColumnFiltersState = searchValues.map((s) => ({
                id: s.id,
                value: inputValues[s.id] ?? "",
              }));
              onSearchChange?.(newFilters);
            }
          }}
          className="pr-10 bg-sidebar"
          disabled={isLoading}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={() => {
            const newFilters: ColumnFiltersState = searchValues.map((s) => ({
              id: s.id,
              value: inputValues[s.id] ?? "",
            }));
            onSearchChange?.(newFilters);
          }}
          disabled={isLoading}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderPaginationButtons = () => {
    const totalPages = table.getPageCount();
    const current = currentPage;
    const pages = [];

    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(totalPages, current + 2);

    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }
    }

    if (startPage > 1) {
      pages.push(
        <Button
          type="button"
          key={1}
          variant={1 === current ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={isLoading}
        >
          1
        </Button>
      );

      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-1 text-muted-foreground">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          type="button"
          key={i}
          variant={i === current ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(i)}
          disabled={isLoading}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-1 text-muted-foreground">
            ...
          </span>
        );
      }

      pages.push(
        <Button
          type="button"
          key={totalPages}
          variant={totalPages === current ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={isLoading}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="space-y-3 w-full">
      {/* Header Section */}
      {(onSearchChange || showRefresh || showSettings) && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          {onSearchChange && searchValues.length > 0 && (
            <div className="flex flex-1 items-end gap-3 flex-wrap">
              {searchValues.map(renderSearchField)}
            </div>
          )}

          {(showRefresh || showSettings) && (
            <div className="flex items-center gap-2">
              {showRefresh && onRefresh && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="h-9 w-9"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              {showSettings && onSettings && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onSettings}
                  disabled={isLoading}
                  className="h-9 w-9"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-lg border bg-card overflow-hidden w-full">
        <ScrollArea
          className={cn(
            isShort ? "h-[40vh]" : "h-[calc(100vh-320px)]",
            "w-full"
          )}
        >
          {isLoading ? (
            <TableSkeleton columns={columns} pageSize={pageSize} />
          ) : (
            <Table className="w-full table-fixed">
              <TableHeader className="sticky top-0 z-10 bg-table-header">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-table-header">
                    {headerGroup.headers.map((header) => (
                      <TableHead 
                        key={header.id} 
                        className="h-11 font-semibold px-4"
                        style={{ width: `${100 / columnCount}%`, maxWidth: `${100 / columnCount}%` }}
                      >
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row.original)}
                      className={cn(
                        "bg-sidebar hover:bg-muted/50 data-[state=selected]:bg-muted",
                        onRowClick && "cursor-pointer"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id} 
                          className="py-3 px-4"
                          style={{ width: `${100 / columnCount}%`, maxWidth: `${100 / columnCount}%` }}
                        >
                          <div 
                            className="overflow-hidden text-ellipsis whitespace-nowrap w-full block" 
                            title={String(cell.getValue() ?? '')}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {searchValues.length > 0 ? "Không tìm thấy kết quả" : "Chưa có dữ liệu"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Pagination */}
        {isPagingProp && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Hiển thị
              </span>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
                disabled={isLoading}
              >
                <SelectTrigger className="h-8 w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                dòng
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Trang {currentPage} / {table.getPageCount()}
              </span>

              <div className="flex items-center gap-1 flex-wrap">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 flex-wrap">
                  {renderPaginationButtons()}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= table.getPageCount() || isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}