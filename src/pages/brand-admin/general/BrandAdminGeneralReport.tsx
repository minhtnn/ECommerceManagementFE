import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/table/data-table";
import { useStatistic } from "@/hooks/use-statistic";
import { useQueryParams } from "@/hooks/use-query-params";
import { handleApiError } from "@/lib/error";
import { formatPrice } from "@/lib/utils";
import { TGetAllProductsStaticByBrandResponse, TGetAllPromotionRulesStaticByBrandResponse } from "@/schemas/statistic.schema";
import { cn } from "@/lib/utils";
import {
    Bell,
    DollarSign,
    Download,
    FileText,
    MessageCircle,
    Package,
    Shield,
    ShoppingCart,
    Tag,
    TrendingUp,
    UserPlus,
} from "lucide-react";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

// ─── Columns: sản phẩm ───────────────────────────────────────────────────────

const productColumns: ColumnDef<TGetAllProductsStaticByBrandResponse>[] = [
    {
        accessorKey: "productNameSnapshot",
        header: () => <div className="font-semibold">Sản phẩm</div>,
        cell: ({ row }) => {
            const imageUrl = row.original.productImageUrl;
            return (
                <div className="flex items-center gap-3">
                    {imageUrl ? (
                        <img src={imageUrl} className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                    ) : (
                        <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-gray-400" />
                        </div>
                    )}
                    <span className="font-medium truncate max-w-[200px]">{row.original.productNameSnapshot}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "saleDate",
        header: () => <div className="font-semibold text-center">Ngày</div>,
        cell: ({ getValue }) => (
            <div className="text-center text-sm text-muted-foreground">{getValue() as string}</div>
        ),
    },
    {
        accessorKey: "totalOrderCount",
        header: () => <div className="font-semibold text-center">Số đơn</div>,
        cell: ({ getValue }) => (
            <div className="flex justify-center">
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">{getValue() as number}</Badge>
            </div>
        ),
    },
    {
        accessorKey: "totalQuantitySold",
        header: () => <div className="font-semibold text-center">SL bán</div>,
        cell: ({ getValue }) => (
            <div className="flex justify-center">
                <Badge className="bg-green-100 text-green-700 border-green-300">{getValue() as number}</Badge>
            </div>
        ),
    },
    {
        accessorKey: "totalGiftQuantity",
        header: () => <div className="font-semibold text-center">SL tặng</div>,
        cell: ({ getValue }) => (
            <div className="flex justify-center">
                <Badge className="bg-purple-100 text-purple-700 border-purple-300">{getValue() as number}</Badge>
            </div>
        ),
    },
    {
        accessorKey: "totalRevenueGross",
        header: () => <div className="font-semibold text-right">Doanh thu</div>,
        cell: ({ getValue }) => (
            <div className="text-right font-medium text-orange-600">{formatPrice(getValue() as number)}</div>
        ),
    },
];

// ─── Columns: khuyến mãi ─────────────────────────────────────────────────────

const promotionColumns: ColumnDef<TGetAllPromotionRulesStaticByBrandResponse>[] = [
    {
        accessorKey: "promotionNameSnapshot",
        header: () => <div className="font-semibold">Chương trình KM</div>,
        cell: ({ getValue }) => (
            <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="font-medium truncate max-w-[200px]">{getValue() as string}</span>
            </div>
        ),
    },
    {
        accessorKey: "statDate",
        header: () => <div className="font-semibold text-center">Ngày</div>,
        cell: ({ getValue }) => (
            <div className="text-center text-sm text-muted-foreground">{getValue() as string}</div>
        ),
    },
    {
        accessorKey: "totalOrdersUsed",
        header: () => <div className="font-semibold text-center">Số đơn dùng</div>,
        cell: ({ getValue }) => (
            <div className="flex justify-center">
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">{getValue() as number}</Badge>
            </div>
        ),
    },
    {
        accessorKey: "totalDiscountIssued",
        header: () => <div className="font-semibold text-right">Tổng giảm</div>,
        cell: ({ getValue }) => (
            <div className="text-right font-medium text-red-500">{formatPrice(getValue() as number)}</div>
        ),
    },
    {
        accessorKey: "totalRevenueWithPromo",
        header: () => <div className="font-semibold text-right">Doanh thu kèm KM</div>,
        cell: ({ getValue }) => (
            <div className="text-right font-medium text-green-600">{formatPrice(getValue() as number)}</div>
        ),
    },
];

// ─── Main page ────────────────────────────────────────────────────────────────

const BrandAdminGeneralReport = () => {
    const today = new Date().toISOString().split("T")[0];
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    // Params cho product table
    const {
        currentPage: productPage,
        pageSize: productSize,
        sortBy: productSortBy,
        isAsc: productIsAsc,
        setSort: setProductSort,
        setPage: setProductPage,
        setPageSize: setProductPageSize,
    } = useQueryParams({ defaultSortBy: "saleDate" });

    // Params cho promotion table
    const {
        currentPage: promoPage,
        pageSize: promoSize,
        sortBy: promoSortBy,
        isAsc: promoIsAsc,
        setSort: setPromoSort,
        setPage: setPromoPage,
        setPageSize: setPromoPageSize,
    } = useQueryParams({ defaultSortBy: "statDate" });

    const { getAllProductsStaticByBrand, getAllPromotionRulesStaticByBrand } = useStatistic();

    const productParams = {
        page: productPage, size: productSize,
        sortBy: productSortBy, isAsc: productIsAsc,
        fromDate, toDate,
    };
    const promoParams = {
        page: promoPage, size: promoSize,
        sortBy: promoSortBy, isAsc: promoIsAsc,
        fromDate, toDate,
    };

    const {
        data: productData,
        isLoading: productLoading,
        isError: productIsError,
        error: productError,
    } = getAllProductsStaticByBrand(productParams);

    const {
        data: promoData,
        isLoading: promoLoading,
        isError: promoIsError,
        error: promoError,
    } = getAllPromotionRulesStaticByBrand(promoParams);

    if (productIsError && productError) handleApiError(productError);
    if (promoIsError && promoError) handleApiError(promoError);

    const productItems = productData?.data?.data?.items ?? [];
    const productTotal = productData?.data?.data?.total ?? 0;
    const promoItems = promoData?.data?.data?.items ?? [];
    const promoTotal = promoData?.data?.data?.total ?? 0;

    // Tính summary từ dữ liệu trang hiện tại để hiển thị stats cards
    const totalRevenueGross = productItems.reduce((s, p) => s + p.totalRevenueGross, 0);
    const totalOrderCount   = productItems.reduce((s, p) => s + p.totalOrderCount, 0);
    const totalQtySold      = productItems.reduce((s, p) => s + p.totalQuantitySold, 0);
    const totalDiscount     = promoItems.reduce((s, p) => s + p.totalDiscountIssued, 0);

    const statsCards = [
        {
            title: "Tổng doanh thu bán hàng",
            subtitle: "(VND)",
            value: formatPrice(totalRevenueGross),
            icon: DollarSign,
            bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
            iconBg: "bg-orange-500",
            details: [
                { label: "Doanh thu trước giảm giá:", value: formatPrice(totalRevenueGross) },
                { label: "Tổng giảm giá:", value: formatPrice(totalDiscount), highlight: true },
                { label: "Doanh thu thực tế:", value: formatPrice(totalRevenueGross - totalDiscount) },
            ],
        },
        {
            title: "Tổng số đơn hàng",
            subtitle: "(Đơn hàng)",
            value: String(totalOrderCount),
            icon: FileText,
            bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
            iconBg: "bg-blue-500",
            details: [
                { label: "Tổng đơn completed:", value: String(totalOrderCount) },
                { label: "Đơn có khuyến mãi:", value: String(promoItems.reduce((s, p) => s + p.totalOrdersUsed, 0)), highlight: true },
            ],
        },
        {
            title: "Tổng sản phẩm bán ra",
            subtitle: "(Sản phẩm)",
            value: String(totalQtySold),
            icon: Package,
            bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
            iconBg: "bg-purple-500",
            details: [
                { label: "SL bán thực:", value: String(totalQtySold) },
                { label: "SL tặng kèm:", value: String(productItems.reduce((s, p) => s + p.totalGiftQuantity, 0)), highlight: true },
            ],
        },
        {
            title: "Tổng giảm giá phát ra",
            subtitle: "(VND)",
            value: formatPrice(totalDiscount),
            icon: TrendingUp,
            bgColor: "bg-gradient-to-br from-cyan-50 to-cyan-100",
            iconBg: "bg-cyan-500",
            details: [
                { label: "Số KM được dùng:", value: String(promoItems.length) },
                { label: "Tổng tiền giảm:", value: formatPrice(totalDiscount), highlight: true },
            ],
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Tổng quan</h1>
                <Button className="bg-primary hover:bg-primary/90">
                    <Download className="w-4 h-4 mr-2" />
                    Xuất báo cáo
                </Button>
            </div>

            {/* Notifications */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Thông báo</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: "Đơn hàng mới", color: "blue", Icon: ShoppingCart },
                            { label: "Admin mới", color: "purple", Icon: Shield },
                            { label: "Khách hàng mới", color: "green", Icon: UserPlus },
                            { label: "Liên hệ & Hỗ trợ", color: "rose", Icon: MessageCircle },
                        ].map(({ label, color, Icon }) => (
                            <div key={label} className={cn(
                                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                                `bg-${color}-50 hover:bg-${color}-100`
                            )}>
                                <div className={`w-10 h-10 rounded-full bg-${color}-500 flex items-center justify-center`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                                <p className={`text-xs text-${color}-600`}>{label}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            {/* <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Từ ngày</span>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="date"
                            value={fromDate}
                            onChange={(e) => {
                                setFromDate(e.target.value);
                                setProductPage(1);
                                setPromoPage(1);
                            }}
                            className="pl-10 w-40"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Đến ngày</span>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="date"
                            value={toDate}
                            onChange={(e) => {
                                setToDate(e.target.value);
                                setProductPage(1);
                                setPromoPage(1);
                            }}
                            className="pl-10 w-40"
                        />
                    </div>
                </div>
            </div> */}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((card, index) => (
                    <Card key={index} className={cn(card.bgColor, "border-0")}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", card.iconBg)}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-2xl font-bold">{card.value}</p>
                                <p className="text-sm font-medium text-primary">{card.title}</p>
                                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                            </div>
                            <div className="space-y-2 text-xs">
                                {card.details.map((detail, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span className="text-muted-foreground">{detail.label}</span>
                                        <span className={detail.highlight ? "text-primary font-medium" : ""}>{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tables — 2 tab */}
            <Tabs defaultValue="products">
                <TabsList className="mb-4">
                    <TabsTrigger value="products" className="gap-2">
                        <Package className="w-4 h-4" />
                        Thống kê sản phẩm
                    </TabsTrigger>
                    <TabsTrigger value="promotions" className="gap-2">
                        <Tag className="w-4 h-4" />
                        Thống kê khuyến mãi
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Chi tiết sản phẩm bán ra</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={productColumns}
                                data={productItems}
                                totalItems={productTotal}
                                currentPage={productPage}
                                pageSize={productSize}
                                onPageChange={setProductPage}
                                onPageSizeChange={setProductPageSize}
                                isLoading={productLoading}
                                sortValues={[{ id: productSortBy, desc: !productIsAsc }]}
                                onSortChange={(s) => setProductSort(s[0].id, !s[0].desc)}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="promotions">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Chi tiết khuyến mãi đã áp dụng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={promotionColumns}
                                data={promoItems}
                                totalItems={promoTotal}
                                currentPage={promoPage}
                                pageSize={promoSize}
                                onPageChange={setPromoPage}
                                onPageSizeChange={setPromoPageSize}
                                isLoading={promoLoading}
                                sortValues={[{ id: promoSortBy, desc: !promoIsAsc }]}
                                onSortChange={(s) => setPromoSort(s[0].id, !s[0].desc)}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BrandAdminGeneralReport;