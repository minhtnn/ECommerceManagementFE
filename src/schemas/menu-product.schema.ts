import z from "zod";

export const InfiniteScrollResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    hasMore: z.boolean(),
    nextCursor: z.string().nullable(),
  });

export const MenuProductCategorySchema = z.object({
  id: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  imageUrl: z.string().nullable(),
  name: z.string().nonempty({ message: "Tên danh mục menu sản phẩm không được bỏ trống" }),
  isSelected: z.boolean(),
  displayOrder: z.number().min(0, { message: "Thứ tự hiển thị phải lớn hơn hoặc bằng 0" }),
  productCount: z.number(),
  totalProductCount: z.number(),
  children: z.array(z.lazy(() => MenuProductCategorySchema)),
});

export const MenuProductListSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  fullName: z.string().nullable(),
  description: z.string().nullable(),
  price: z.number(),
  stockQuantity: z.number(),
  displayOrder: z.number(),
  productCategoryId: z.string().uuid(),
  images: z.array(z.lazy(() => MenuProductListImageSchema)),
});

export const MenuProductListImageSchema = z.object({
  id: z.string(),
  altText: z.string().nullable(),
  url: z.string().nullable(),
  isMainImage: z.boolean(),
});

export const MenuProductSchema = z.object({
  selectedCategory: MenuProductCategorySchema.nullable(),
  productCategoriesTree: z.array(MenuProductCategorySchema),
  products: z.object({
    items: z.array(MenuProductListSchema),
    hasMore: z.boolean(),
    nextCursor: z.string().nullable(),
  }),
});

export type TMenuProductResponse = z.infer<typeof MenuProductSchema>;
export type TMenuProductCategoryResponse = z.infer<typeof MenuProductCategorySchema>;
export type TMenuProductListResponse = z.infer<typeof MenuProductListSchema>;
export type TMenuProductListImageResponse = z.infer<typeof MenuProductListImageSchema>;