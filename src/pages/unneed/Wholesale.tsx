import EndUserLayout from "@/layouts/EndUserLayout";
import { ChevronRight, Filter, Star, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/data/mockData";
// import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface WholesaleProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge: string;
  badgeColor: string;
}

const wholesaleProducts: WholesaleProduct[] = [
  {
    id: "ws1",
    name: "[Giá sỉ tốt] Thùng 15Kg Cà Phê Truyền Thống Highlands Coffee 1kg",
    price: 4950000,
    originalPrice: 6675000,
    discount: 26,
    rating: 5,
    reviewCount: 1,
    image: "/placeholder.svg",
    badge: "Giá Sỉ Ngay",
    badgeColor: "bg-primary",
  },
  {
    id: "ws2",
    name: "[Giá sỉ tốt] Thùng 15Kg Cà phê hạt Full City Roast Highlands Coffee 1kg",
    price: 7575000,
    originalPrice: 9975000,
    discount: 24,
    rating: 0,
    reviewCount: 0,
    image: "/placeholder.svg",
    badge: "Giá Sỉ ngay",
    badgeColor: "bg-primary",
  },
  {
    id: "ws3",
    name: "2 Thùng 15Kg Cà phê hạt Full City Roast Highlands Coffee 1kg",
    price: 15000000,
    originalPrice: 19950000,
    discount: 25,
    rating: 0,
    reviewCount: 0,
    image: "/placeholder.svg",
    badge: "Thùng 15 Gói",
    badgeColor: "bg-primary",
  },
  {
    id: "ws4",
    name: "Thùng 12 gói Cà Phê Rang Xay Truyền Thống Highlands Coffee...",
    price: 1152000,
    originalPrice: 1260000,
    discount: 9,
    rating: 5,
    reviewCount: 1,
    image: "/placeholder.svg",
    badge: "Thùng 12 Gói",
    badgeColor: "bg-primary",
  },
  {
    id: "ws5",
    name: "Thùng 12 gói Cà Phê Rang Xay Moka Highlands Coffee 200g/gói",
    price: 1531200,
    originalPrice: 1740000,
    discount: 12,
    rating: 0,
    reviewCount: 0,
    image: "/placeholder.svg",
    badge: "Giá Sỉ Ngay",
    badgeColor: "bg-primary",
  },
  {
    id: "ws6",
    name: "Thùng 12 gói Cà Phê Rang Xay Culi Highlands Coffee 200g/gói",
    price: 1393920,
    originalPrice: 1584000,
    discount: 12,
    rating: 0,
    reviewCount: 0,
    image: "/placeholder.svg",
    badge: "Giá Sỉ Ngay",
    badgeColor: "bg-primary",
  },
];

const priceFilters = [
  { value: "all", label: "Tất cả giá" },
  { value: "under-2m", label: "Dưới 2.000.000đ" },
  { value: "2m-5m", label: "2.000.000đ - 5.000.000đ" },
  { value: "5m-10m", label: "5.000.000đ - 10.000.000đ" },
  { value: "above-10m", label: "Trên 10.000.000đ" },
];

const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "name-asc", label: "Tên: A-Z" },
  { value: "discount", label: "Giảm giá nhiều nhất" },
];

const Wholesale = () => {
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  // const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: WholesaleProduct) => {
    // addItem({
    //   id: product.id,
    //   name: product.name,
    //   price: product.price,
    //   originalPrice: product.originalPrice,
    //   image: product.image,
    // });
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: product.name,
    });
  };

  const filterProducts = (products: WholesaleProduct[]) => {
    let filtered = [...products];

    // Apply price filter
    switch (priceFilter) {
      case "under-2m":
        filtered = filtered.filter((p) => p.price < 2000000);
        break;
      case "2m-5m":
        filtered = filtered.filter((p) => p.price >= 2000000 && p.price < 5000000);
        break;
      case "5m-10m":
        filtered = filtered.filter((p) => p.price >= 5000000 && p.price < 10000000);
        break;
      case "above-10m":
        filtered = filtered.filter((p) => p.price >= 10000000);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "discount":
        filtered.sort((a, b) => b.discount - a.discount);
        break;
    }

    return filtered;
  };

  const filteredProducts = filterProducts(wholesaleProducts);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <EndUserLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-3 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">MUA SỈ</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">MUA SỈ</h1>
            <p className="text-sm text-muted-foreground">{filteredProducts.length} sản phẩm</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Sắp xếp:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-4 border-b">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="w-4 h-4" />
            <span>TÌM NHANH</span>
          </div>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="Lọc giá" />
            </SelectTrigger>
            <SelectContent>
              {priceFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-background rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <Link to={`/product/${product.id}`} className="block relative">
                <div className="aspect-square bg-muted/20 relative overflow-hidden">
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                      {product.discount}%
                    </span>
                  </div>

                  {/* Product Badge */}
                  <div className="absolute inset-0 flex items-start justify-center pt-8">
                    <div className={`${product.badgeColor} text-primary-foreground px-3 py-2 rounded text-center`}>
                      <span className="text-lg font-bold block">{product.badge}</span>
                      <span className="text-xs opacity-90">Uni Coffee</span>
                    </div>
                  </div>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 min-h-[40px] hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-primary font-bold">{formatPrice(product.price)}</span>
                  <span className="text-muted-foreground text-sm line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-2">
                  {renderStars(product.rating)}
                  {product.reviewCount > 0 && (
                    <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                  )}
                  <span className="text-muted-foreground">|</span>
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="outline"
                  className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Chọn mua
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
            <Button
              variant="link"
              onClick={() => {
                setPriceFilter("all");
                setSortBy("default");
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </EndUserLayout>
  );
};

export default Wholesale;
