import z from "zod";

export const OpenApiProvinceListResponseSchema = z.object({
    code: z.number(),
    codename: z.string(),
    division_type: z.string(),
    name: z.string(),
    phone_code: z.number(),
});

export const OpenApiWardListResponseSchema = z.object({
    name: z.string(),
    code: z.number(),
    codename: z.string(),
    division_type: z.string(),
    province_code: z.number(),
});

export const OpenApiWardDetailResponseSchema = z.object({
    name: z.string(),
    code: z.number(),
    codename: z.string(),
    division_type: z.string(),
    province_code: z.number(),
});

export const OpenApiProvinceDetailResponseSchema = z.object({
    code: z.string(),
    codename: z.string(),
    division_type: z.string(),
    name: z.string(),
    phone_code: z.number(),
    wards: z.array(OpenApiWardListResponseSchema),
});

export type TOpenApiProvinceListResponse = z.infer<typeof OpenApiProvinceListResponseSchema>
export type TOpenApiWardListResponse = z.infer<typeof OpenApiWardListResponseSchema>
export type TOpenApiWardDetailResponse = z.infer<typeof OpenApiWardDetailResponseSchema>
export type TOpenApiProvinceDetailResponse = z.infer<typeof OpenApiProvinceDetailResponseSchema>