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
    receiver: z.string({ required_error: "Tên người nhận không được để trống" }),
    address: z.string({ required_error: "Địa chỉ người nhận không được để trống" }),
    shippingContact: z.string({ required_error: "Số điện thoại người nhận không được để trống" }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    isPrimary: z.boolean(),
});
export const UpdateCustomerAddressSchema = z.object({
    id: z.string().uuid(),
    receiver: z.string({ required_error: "Tên người nhận không được để trống" }),
    address: z.string({ required_error: "Địa chỉ người nhận không được để trống" }),
    shippingContact: z.string({ required_error: "Số điện thoại người nhận không được để trống" }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    isPrimary: z.boolean(),
});

export type TCustomerListResponse = z.infer<typeof CustomerListSchema>;
export type TCustomerAddressListResponse = z.infer<typeof CustomerAddressListResponseSchema>;
export type TCustomerAddressDetailResponse = z.infer<typeof CustomerAddressDetailResponseSchema>;
export type TCreateCustomerAddress = z.infer<typeof CreateCustomerAddressSchema>;
export type TUpdateCustomerAddress = z.infer<typeof UpdateCustomerAddressSchema>;