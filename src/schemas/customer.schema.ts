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

export type TCustomerListResponse = z.infer<typeof CustomerListSchema>;