import { ECategoryStatus } from "@/types/enums/product-category-status.enum";
import z from "zod";

export const ProductCategoryListSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    level: z.number(),
    isLeafOnly: z.boolean(),
    imageUrl: z.string().nullable(),
    status: z.nativeEnum(ECategoryStatus),
});
export const ProductCategoryDetailSchema = z.object({
    id: z.string().uuid(),
    parentProductCategoryName: z.string().nullable(),
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    displayOrder: z.number(),
    level: z.number(),
    isLeafOnly: z.boolean(),
    isDeletable: z.boolean(),
    imageUrl: z.string().nullable(),
    status: z.nativeEnum(ECategoryStatus),
    createdDate: z.date(),
    lastModifiedDate: z.date().nullable(),
});
export const CreateProductCategorySchema = z.object({
    parentProductCategoryId: z.string().uuid().optional(),
    code: z.string({ required_error: "Mã danh mục sản phẩm không được bỏ trống" })
        .max(100, { message: "Mã danh mục sản phẩm không vượt quá 100 ký tự" }),
    name: z.string({ required_error: "Tên danh mục sản phẩm không được bỏ trống" })
        .max(200, { message: "Tên danh mục sản phẩm không được vượt quá 200 ký tự" }),
    description: z.string().max(1000, { message: "Mô tả danh mục sản phẩm không được vượt quá 1000 ký tự" }).nullable().optional(),
    displayOrder: z.number().min(1, { message: "Thứ tự hiển thị phải lớn hơn 0" }),
    status: z.nativeEnum(ECategoryStatus),
});
export const UpdateProductCategorySchema = z.object({
    id: z.string().uuid(),
    name: CreateProductCategorySchema.shape.name,
    description: CreateProductCategorySchema.shape.description,
    displayOrder: CreateProductCategorySchema.shape.displayOrder,
    status: CreateProductCategorySchema.shape.status,
});

export type TProductCategoryList = z.infer<typeof ProductCategoryListSchema>;
export type TProductCategoryDetail = z.infer<typeof ProductCategoryDetailSchema>;
export type TCreateProductCategory = z.infer<typeof CreateProductCategorySchema>;
export type TUpdateProductCategory = z.infer<typeof UpdateProductCategorySchema>;