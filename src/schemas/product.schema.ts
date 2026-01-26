import { EProductStatus } from "@/types/enums/product-status.enum";
import z from "zod";

export const ProductListSchema = z.object({
    id: z.string().uuid(),
    productCategoryId: z.string().uuid(),
    code: z.string().nonempty({ message: "Mã sản phẩm không được bỏ trống" })
        .max(8, { message: "Mã sản phẩm không vượt quá 8 ký tự" }),
    name: z.string().nonempty({ message: "Tên sản phẩm không được bỏ trống" })
        .max(50, { message: "Tên sản phẩm không vượt quá 50 ký tự" }),
    fullName: z.string().max(200, { message: "Tên đầy đủ không vượt quá 200 ký tự" }).optional(),
    description: z.string().max(500, { message: "Mô tả không vượt quá 500 ký tự" }).optional(),
    price: z.number().optional(),
    status: z.nativeEnum(EProductStatus),
    stockQuantity: z.number().optional(),
    mainImageUrl: z.string().optional(),
    mainImageAltText: z.string().optional(),
});

export const ProductImageSchema = z.object({
    id: z.string().uuid(),
    imageUrl: z.string(),
    altText: z.string().optional(),
    isMainImage: z.boolean(),
});

export const ProductSideAttributeSchema = z.object({
    id: z.string().uuid(),
    key: z.string(),
    value: z.string(),
});

export const ProductDetailSchema = z.object({
    id: z.string().uuid(),
    productCategoryName: z.string().uuid(),
    code: z.string().nonempty({ message: "Mã sản phẩm không được bỏ trống" }),
    name: z.string().nonempty({ message: "Tên sản phẩm không được bỏ trống" }),
    fullName: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    status: z.nativeEnum(EProductStatus),
    stockQuantity: z.number(),
    getProductImagesResponse: z.array(ProductImageSchema),
    getProductSideAttributesResponse: z.array(ProductSideAttributeSchema),
    createdDate: z.date(),
    lastModifiedDate: z.date().nullable(),
});

export const CreateProductSchema = z.object({
    productCategoryId: z.string().uuid({ message: "Danh mục sản phẩm không hợp lệ" }),
    code: z.string()
        .nonempty({ message: "Mã sản phẩm không được bỏ trống" })
        .max(100, { message: "Mã sản phẩm không vượt quá 100 ký tự" })
        .regex(/^[a-zA-Z0-9-_]+$/, {
            message: "Mã sản phẩm chỉ chứa chữ cái, số, dấu gạch ngang và gạch dưới"
        }),
    name: z.string()
        .nonempty({ message: "Tên sản phẩm không được bỏ trống" })
        .max(200, { message: "Tên sản phẩm không vượt quá 200 ký tự" }),
    fullName: z.string()
        .max(200, { message: "Tên đầy đủ không vượt quá 200 ký tự" })
        .optional(),
    description: z.string()
        .max(500, { message: "Mô tả không vượt quá 500 ký tự" }),
    price: z.number({ invalid_type_error: "Sai định dạng" })
        .optional(),
    status: z.nativeEnum(EProductStatus),
    stockQuantity: z.number({ invalid_type_error: "Sai định dạng" })
        .optional(),
    // Images metadata (JSON string sẽ được stringify khi gửi)
    images: z.array(z.object({
        altText: z.string().optional(),
        isMainImage: z.boolean(),
    })).max(4, { message: "Chỉ được upload tối đa 4 ảnh" }).optional(),
    // Side attributes
    sideAttributes: z.array(z.object({
        key: z.string()
            .nonempty({ message: "Tên thuộc tính không được bỏ trống" })
            .max(50, { message: "Tên thuộc tính không vượt quá 50 ký tự" }),
        value: z.string()
            .nonempty({ message: "Giá trị thuộc tính không được bỏ trống" })
            .max(200, { message: "Giá trị thuộc tính không vượt quá 200 ký tự" }),
    })).max(20, { message: "Chỉ được thêm tối đa 20 thuộc tính" }).optional(),
});

export const UpdateProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string()
        .nonempty({ message: "Tên sản phẩm không được bỏ trống" })
        .max(200, { message: "Tên sản phẩm không vượt quá 200 ký tự" }),
    fullName: z.string()
        .max(500, { message: "Tên đầy đủ không vượt quá 500 ký tự" })
        .optional(),
    description: z.string()
        .max(500, { message: "Mô tả không vượt quá 500 ký tự" })
        .optional(),
    price: z.number().optional(),
    status: z.nativeEnum(EProductStatus),
    stockQuantity: z.number()
        .min(0, { message: "Số lượng tồn kho phải >= 0" }),
    existingImageIds: z.array(z.string().uuid()).optional(),
    newImages: z.array(z.object({
        altText: z.string().optional(),
        isMainImage: z.boolean(),
    })).optional(),
    sideAttributes: z.array(z.object({
        key: z.string()
            .nonempty({ message: "Tên thuộc tính không được bỏ trống" })
            .max(50, { message: "Tên thuộc tính không vượt quá 50 ký tự" }),
        value: z.string()
            .nonempty({ message: "Giá trị thuộc tính không được bỏ trống" })
            .max(200, { message: "Giá trị thuộc tính không vượt quá 200 ký tự" }),
    })).max(20, { message: "Chỉ được thêm tối đa 20 thuộc tính" }).optional(),
});

export type TProductImage = z.infer<typeof ProductImageSchema>;
export type TProductSideAttribute = z.infer<typeof ProductSideAttributeSchema>;
export type TUpdateProduct = z.infer<typeof UpdateProductSchema>;

export type TProductList = z.infer<typeof ProductListSchema>;
export type TProductDetail = z.infer<typeof ProductDetailSchema>;
export type TCreateProduct = z.infer<typeof CreateProductSchema>;