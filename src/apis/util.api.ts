import { BRAND } from "zod";

export const normalizeParams = (filters: any) => {
  const normalized = { ...filters };
  const sort = filters.sort?.split(",");

  if (Array.isArray(sort) && sort.length) {
    normalized.sortBy = sort[0];
    normalized.sortDirection = sort[1];
  }

  const removeEmptyValueParams = Object.fromEntries(
    Object.entries(normalized).filter(([_, v]) => v != null)
  );
  return removeEmptyValueParams;
};

export const API_SUFFIX = {
    AUTH_API: '/authentication',
    BRAND_API: '/brands',
    MENU_API: '/menus',
    PRODUCT_CATEGORY_API: '/product-categories',
    PRODUCT_API: '/products',
    CUSTOMER_API: '/customers',
    END_CUSTOMER_CART_API: '/carts/end-customer',
    PAYMENT_METHOD_API: '/payment-methods',
    ORDER_API: '/orders',
}