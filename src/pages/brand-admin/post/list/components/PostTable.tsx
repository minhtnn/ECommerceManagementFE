import { DataTable } from "@/components/table/data-table";
import { usePost } from "@/hooks/use-post";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { EPostStatus, POST_STATUS_LABEL } from "@/types/enums/post-status.enum";
import { columns } from "./post-table/PostColumn";

const PostTable = () => {
    const {
        currentPage, pageSize, sortBy, isAsc,
        setSort, setPage, setPageSize,
        filter, setFilter,
    } = useQueryParams({
        defaultSortBy: "CreatedDate",
        defaultFilter: [
            { id: "code", value: "" },
            { id: "status", value: null },
            { id: "fromDate", value: null },
            { id: "toDate", value: null },
        ],
    });

    const { getSuspendPosts } = usePost();

    const codeFilter = String(filter.find((f) => f.id === "code")?.value ?? "");
    const statusFilter = filter.find((f) => f.id === "status")?.value;
    const statusValue = statusFilter === "" || statusFilter === null ? null : Number(statusFilter);
    const fromDate = filter.find((f) => f.id === "fromDate")?.value as string | null;
    const toDate = filter.find((f) => f.id === "toDate")?.value as string | null;

    const { data, isError, error } = getSuspendPosts({
        page: currentPage,
        size: pageSize,
        sortBy,
        isAsc,
        code: codeFilter,
        status: statusValue,
        fromDate,
        toDate,
    });

    if (isError && error) handleApiError(error);

    const searchValues = filter.map((f) => ({
        ...f,
        searchPlaceholder:
            f.id === "code" ? "Tìm theo mã bài đăng"
                : f.id === "status" ? "Trạng thái"
                    : f.id === "fromDate" ? "Từ ngày"
                        : f.id === "toDate" ? "Đến ngày"
                            : "",
        isSelect: f.id === "status",
        options: f.id === "status"
            ? [
                { label: "Tất cả", value: null },
                ...Object.values(EPostStatus)
                    .filter((v) => typeof v === "number")
                    .map((v) => ({
                        label: POST_STATUS_LABEL[v as EPostStatus],
                        value: String(v),
                    })),
            ]
            : undefined,
    }));

    const items = data.data.data.items || [];
    const totalItems = data.data.data.total || 0;

    return (
        <DataTable
            columns={columns}
            data={items}
            totalItems={totalItems}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onSearchChange={setFilter}
            searchValues={searchValues}
            sortValues={[{ id: sortBy, desc: !isAsc }]}
            onSortChange={(newSort) => setSort(newSort[0].id, !newSort[0].desc)}
        />
    );
};

export default PostTable;