import { EBrandStatus } from "@/types/enums/brand-status.enum";
import z from "zod";

export const BrandListSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    email: z.string(),
    logoUrl: z.string().nullable(),
    status: z.nativeEnum(EBrandStatus),
});

export const BrandDetailSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    fullName: z.string().nullable(),
    slogan: z.string().nullable(),
    email: z.string().email(),
    address: z.string(),
    phoneNumber: z.string().nullable(),
    logoUrl: z.string().nullable(),
    status: z.nativeEnum(EBrandStatus),
    configuration: z.string().nullable(),
});

export const CreateBrandSchema = z.object({
    address: z.string(
        {
            required_error: "Địa chỉ trụ sở chính thương hiệu không được bỏ trống"
        }
    ).max(200, { message: "Địa chỉ không được vượt quá 200 ký tự" }),
    email: z.string({ required_error: "Email không được bỏ trống" }).email({ message: "Email không hợp lệ" }),
    code: z.string(
        {
            required_error: "Mã thương hiệu không được bỏ trống",
            invalid_type_error: "Mã thương hiệu không hợp lệ",
        },
    )
        .min(2, { message: "Mã thương hiệu không ít hơn 2 kí tự" })
        .max(20, { message: "Mã thương hiệu không vượt quá 20 ký tự" }),
    name: z.string(
        {
            required_error: "Tên thương hiệu không được bỏ trống"
        },
    )
        .min(2, { message: "Tên thương hiệu không ít hơn 2 kí tự" })
        .max(50, { message: "Tên thương hiệu không được vượt quá 50 ký tự" }),
    // fullName: z.string().max(100, { message: "Tên đầy đủ không được vượt quá 100 ký tự" }).optional(),
    // slogan: z.string().max(200, { message: "Khẩu hiệu không được vượt quá 200 ký tự" }).optional(),
    configuration: z.string().optional(),
    username: z.string({required_error: "Tên đăng nhập không được bỏ trống"})
        .min(4, { message: "Tên đăng nhập không ít hơn 4 kí tự" })
        .max(20, { message: "Tên đăng nhập không vượt quá 20 ký tự" }),
    passwordString: z.string({required_error: "Mật khẩu không được bỏ trống"})
        .min(6, { message: "Mật khẩu không ít hơn 6 kí tự" })
        .max(100, { message: "Mật khẩu không vượt quá 100 ký tự" }),
    phoneNumber: z.string().max(20, { message: "Số điện thoại không vượt quá 20 ký tự" }).optional(),
});

export const UpdateBrandSchema = z.object({
    id: z.string().uuid(),
    name: CreateBrandSchema.shape.name,
    address: CreateBrandSchema.shape.address,
    fullname: z.string().optional(),
    slogan: z.string().optional(),
    email: CreateBrandSchema.shape.email,
    phoneNumber: CreateBrandSchema.shape.phoneNumber,
    status: z.nativeEnum(EBrandStatus),
    configuration: CreateBrandSchema.shape.configuration,
});

export type TBrandListResponse = z.infer<typeof BrandListSchema>;
export type TBrandDetailResponse = z.infer<typeof BrandDetailSchema>;
export type TCreateBrandRequest = z.infer<typeof CreateBrandSchema>;
export type TUpdateBrandRequest = z.infer<typeof UpdateBrandSchema>;