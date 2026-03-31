import { ECustomerStatus } from "@/types/enums/customer-status";
import z from "zod";

export const CustomerListSchema = z.object({
    id: z.string().uuid(),
    avatarUrl: z.string(),
    fullName: z.string(),
    email: z.string(),
    phoneNumber: z.string().nullable(),
    status: z.nativeEnum(ECustomerStatus),
});

export const CustomerAddressListResponseSchema = z.object({
    id: z.string().uuid(),
    receiver: z.string(),
    address: z.string(),
    shippingContact: z.string(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    isPrimary: z.boolean(),
});
export const CustomerAddressDetailResponseSchema = z.object({
    id: z.string().uuid(),
    receiver: z.string(),
    address: z.string(),
    shippingContact: z.string(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    isPrimary: z.boolean(),
    createdDate: z.date(),
    lastModifiedDate: z.date().nullable()
});
export const CreateCustomerAddressSchema = z.object({
    receiver: z.string({ required_error: "Tên người nhận không được để trống", invalid_type_error: "Tên người nhận phải là chuỗi ký tự" }),
    address: z.string({ required_error: "Địa chỉ người nhận không được để trống", invalid_type_error: "Địa chỉ người nhận phải là chuỗi ký tự" }),
    shippingContact: z.string({ required_error: "Số điện thoại người nhận không được để trống", invalid_type_error: "Số điện thoại người nhận phải là chuỗi ký tự" }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    isPrimary: z.boolean(),
});
export const UpdateCustomerAddressSchema = z.object({
    id: z.string().uuid(),
    receiver: z.string({ required_error: "Tên người nhận không được để trống", invalid_type_error: "Tên người nhận phải là chuỗi ký tự" }),
    address: z.string({ required_error: "Địa chỉ người nhận không được để trống", invalid_type_error: "Địa chỉ người nhận phải là chuỗi ký tự" }),
    shippingContact: z.string({ required_error: "Số điện thoại người nhận không được để trống", invalid_type_error: "Số điện thoại người nhận phải là chuỗi ký tự" }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    isPrimary: z.boolean(),
});

export const CreateCustomerConsultantSchema = z.object({
    customerFullName: z
        .string({
            required_error: "Tên khách hàng không được để trống",
            invalid_type_error: "Tên khách hàng phải là chuỗi ký tự"
        })
        .min(2, { message: "Tên khách hàng phải có ít nhất 2 ký tự" })
        .max(100, { message: "Tên khách hàng không được vượt quá 100 ký tự" }),
    customerEmail: z
        .string({
            required_error: "Email khách hàng không được để trống",
            invalid_type_error: "Email khách hàng phải là chuỗi ký tự"
        })
        .email({ message: "Email khách hàng không hợp lệ" })
        .max(200, { message: "Email khách hàng không được vượt quá 200 ký tự" }),
    customerPhone: z
        .string({
            invalid_type_error: "Số điện thoại khách hàng phải là chuỗi ký tự"
        })
        .max(15, { message: "Số điện thoại khách hàng không được vượt quá 15 ký tự" })
        .refine(
            (val) => val === "" || /^(0[0-9]{9})$/.test(val),
            { message: "Số điện thoại không hợp lệ" }
        )
        .optional(),
    customerMessage: z
        .string({
            required_error: "Nội dung tư vấn không được để trống",
            invalid_type_error: "Nội dung tư vấn phải là chuỗi ký tự"
        })
        .min(10, { message: "Nội dung tư vấn phải có ít nhất 10 ký tự" })
        .max(2000, { message: "Nội dung tư vấn không được vượt quá 2000 ký tự" }),
});

export type TCustomerListResponse = z.infer<typeof CustomerListSchema>;
export type TCustomerAddressListResponse = z.infer<typeof CustomerAddressListResponseSchema>;
export type TCustomerAddressDetailResponse = z.infer<typeof CustomerAddressDetailResponseSchema>;
export type TCreateCustomerAddress = z.infer<typeof CreateCustomerAddressSchema>;
export type TUpdateCustomerAddress = z.infer<typeof UpdateCustomerAddressSchema>;
export type TCreateCustomerConsultant = z.infer<typeof CreateCustomerConsultantSchema>;