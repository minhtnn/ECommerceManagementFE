export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  badge?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Voucher {
  id: string;
  title: string;
  description: string;
  code: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

export const categories: Category[] = [
  { id: "1", name: "Cà phê Rang Xay", slug: "ground-coffee", icon: "☕" },
  { id: "2", name: "Cà Phê Hạt", slug: "coffee-beans", icon: "🫘" },
  { id: "3", name: "Cà Phê Uống Liền", slug: "instant-coffee", icon: "🥤" },
  { id: "4", name: "Cà Phê Hòa Tan", slug: "ready-to-drink", icon: "🧊" },
];

export const vouchers: Voucher[] = [
  {
    id: "1",
    title: "FREESHIP MAX",
    description: "Nhập mã FREESHIPMAX tại mục Thanh Toán, áp dụng cho đơn từ 399,000đ",
    code: "FREESHIPMAX",
  },
  {
    id: "2",
    title: "Voucher 200.000",
    description: "Nhập mã UNI200 mục Thanh Toán, áp dụng cho đơn từ 2,399,000đ sản phẩm được chọn",
    code: "UNI200",
  },
  {
    id: "3",
    title: "Voucher 100.000",
    description: "Nhập mã UNI100 tại mục Thanh Toán, áp dụng cho đơn từ 1,499,000đ sản phẩm được chọn",
    code: "UNI100",
  },
  {
    id: "4",
    title: "Voucher 20.000",
    description: "Nhập mã UNI20 tại mục Thanh Toán, áp dụng cho đơn từ 799,000đ toàn bộ sản phẩm",
    code: "UNI20",
  },
];

// export const flashSaleProducts: Product[] = [
//   {
//     id: "fs1",
//     name: "HOT DEAL - MUA 1 TẶNG 2 - Cà phê bột Truyền Thống 200g",
//     price: 415000,
//     originalPrice: 445000,
//     discount: 7,
//     rating: 4,
//     reviewCount: 0,
//     image: "/placeholder.svg",
//     category: "ground-coffee",
//     badge: "Mua 1 Tặng 2",
//   },
//   {
//     id: "fs2",
//     name: "HOT DEAL - MUA 2 TẶNG 3 - Cà phê Bột Truyền Thống 1kg",
//     price: 809000,
//     originalPrice: 890000,
//     discount: 9,
//     rating: 5,
//     reviewCount: 1,
//     image: "/placeholder.svg",
//     category: "ground-coffee",
//     badge: "Mua 2 Tặng 3",
//   },
//   {
//     id: "fs3",
//     name: "Combo 2 túi Cà phê sữa hòa tan 3in1 Uni Coffee",
//     price: 339000,
//     originalPrice: 358000,
//     discount: 5,
//     rating: 5,
//     reviewCount: 0,
//     image: "/placeholder.svg",
//     category: "instant-coffee",
//     badge: "Combo 2 Túi",
//   },
//   {
//     id: "fs4",
//     name: "Mua 1 Tặng 1 - Cà Phê Rang Xay Truyền Thống 500g",
//     price: 245000,
//     rating: 4,
//     reviewCount: 0,
//     image: "/placeholder.svg",
//     category: "ground-coffee",
//     badge: "Mua 1 Tặng 1",
//   },
//   {
//     id: "fs5",
//     name: "(Siêu Deal) MUA 1 TẶNG 1 - Cà phê Bột Truyền Thống Premium",
//     price: 415000,
//     originalPrice: 550000,
//     discount: 25,
//     rating: 5,
//     reviewCount: 1,
//     image: "/placeholder.svg",
//     category: "ground-coffee",
//     badge: "Mua 1 Tặng 1",
//   },
// ];

export const groundCoffeeProducts: Product[] = [
  {
    id: "gc1",
    name: "Mua 1 Tặng 1 - Cà Phê Rang Xay Truyền Thống 500g",
    price: 245000,
    rating: 4,
    reviewCount: 0,
    image: "/placeholder.svg",
    category: "ground-coffee",
    badge: "Mua 1 Tặng 1",
  },
  {
    id: "gc2",
    name: "(Siêu Deal) MUA 1 TẶNG 1 - Cà phê Bột Truyền Thống Premium",
    price: 415000,
    originalPrice: 550000,
    discount: 25,
    rating: 5,
    reviewCount: 1,
    image: "/placeholder.svg",
    category: "ground-coffee",
    badge: "Mua 1 Tặng 1",
  },
  {
    id: "gc3",
    name: "Cà Phê Bột Truyền Thống Uni Coffee 1kg",
    price: 369000,
    originalPrice: 445000,
    discount: 17,
    rating: 5,
    reviewCount: 2,
    image: "/placeholder.svg",
    category: "ground-coffee",
  },
  {
    id: "gc4",
    name: "MUA 2 TẶNG 2 - Cà phê Bột Truyền Thống 1kg Tặng 1g",
    price: 809000,
    originalPrice: 890000,
    discount: 9,
    rating: 4,
    reviewCount: 0,
    image: "/placeholder.svg",
    category: "ground-coffee",
    badge: "Mua 2 Tặng 2",
  },
  {
    id: "gc5",
    name: "Combo 2 Túi Cà Phê Rang Xay Truyền Thống Uni Coffee",
    price: 419000,
    originalPrice: 490000,
    discount: 14,
    rating: 4,
    reviewCount: 0,
    image: "/placeholder.svg",
    category: "ground-coffee",
    badge: "Combo 2 Gói",
  },
];

export const instantCoffeeProducts: Product[] = [
  {
    id: "ic1",
    name: "Thùng 24 Lon Cà Phê Sữa Uni Coffee 235ml",
    price: 392000,
    rating: 4,
    reviewCount: 0,
    image: "/placeholder.svg",
    category: "instant-coffee",
  },
  {
    id: "ic2",
    name: "Thùng 24 Lon Cà Phê Sữa Uni Coffee 185ml/lon",
    price: 287000,
    originalPrice: 326000,
    discount: 12,
    rating: 4,
    reviewCount: 0,
    image: "/placeholder.svg",
    category: "instant-coffee",
  },
];

export const instantMixProducts: Product[] = [
  {
    id: "im1",
    name: "(Freeship Toàn Quốc) Cà phê sữa hòa tan 3in1 Uni Coffee",
    price: 175000,
    originalPrice: 179000,
    rating: 4,
    reviewCount: 0,
    image: "/placeholder.svg",
    category: "instant-mix",
  },
  {
    id: "im2",
    name: "Combo 2 túi Cà phê sữa hòa tan 3in1 Uni Coffee",
    price: 339000,
    originalPrice: 358000,
    discount: 5,
    rating: 5,
    reviewCount: 0,
    image: "/placeholder.svg",
    category: "instant-mix",
    badge: "Combo 2 Túi",
  },
];

export const quickLinks = [
  { icon: "🚚", label: "Giao hàng", href: "/delivery" },
  { icon: "🏷️", label: "ĐỘC QUYỀN", href: "/exclusive" },
  // { icon: "🔥", label: "Bán chạy", href: "/best-sellers" },
  { icon: "💬", label: "Liên hệ", href: "/guest/contact" },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};
