import { EConfigDataType } from "@/types/enums/config-data-type.enum";
import z from "zod";

export const SystemConfigDependencySchema = z.object({
  id: z.string().uuid(),
  triggerKeyId: z.string().uuid(),
  triggerKey: z.string(),
  triggerValue: z.string(),
});

export const SystemConfigSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  title: z.string(),
  dataType: z.string(),
  description: z.string().nullable(),
  isRequired: z.boolean(),
  isSecure: z.boolean(),
  defaultValue: z.string().nullable(),
  value: z.string().nullable(),
  displayOrder: z.number(),
  dependencies: z.array(SystemConfigDependencySchema),
});

export const DependencyRequestSchema = z.object({
  triggerKeyId: z.string().uuid("TriggerKeyId không hợp lệ"),
  triggerValue: z.string().min(1, "TriggerValue không được bỏ trống"),
});

export const CreateSystemConfigSchema = z.object({
  key: z
    .string({ required_error: "Key không được bỏ trống" })
    .min(1, "Key không được bỏ trống")
    .max(100, "Key không vượt quá 100 ký tự")
    .regex(
      /^[A-Za-z][A-Za-z0-9_]*$/,
      "Key chỉ được chứa chữ cái, số và dấu gạch dưới, không bắt đầu bằng số"
    ),
  title: z
    .string({ required_error: "Tiêu đề không được bỏ trống" })
    .min(1, "Tiêu đề không được bỏ trống")
    .max(255, "Tiêu đề không vượt quá 255 ký tự"),
  dataType: z.nativeEnum(EConfigDataType, {
    required_error: "Kiểu dữ liệu không được bỏ trống",
  }),
  description: z
    .string()
    .max(500, "Mô tả không vượt quá 500 ký tự")
    .optional(),
  isRequired: z.boolean().default(false),
  isSecure: z.boolean().default(false),
  defaultValue: z.string().optional(),
  value: z.string().optional(),
  displayOrder: z.number().min(0, "Thứ tự hiển thị không được âm").default(0),
  dependencies: z.array(DependencyRequestSchema).optional(),
});

export const UpdateSystemConfigSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string({ required_error: "Tiêu đề không được bỏ trống" })
    .min(1, "Tiêu đề không được bỏ trống")
    .max(255, "Tiêu đề không vượt quá 255 ký tự"),
  description: z
    .string()
    .max(500, "Mô tả không vượt quá 500 ký tự")
    .optional(),
  isRequired: z.boolean(),
  isSecure: z.boolean(),
  defaultValue: z.string().optional(),
  value: z.string().optional(),
  clearValue: z.boolean().default(false),
  displayOrder: z.number().min(0).default(0),
  dependencies: z.array(DependencyRequestSchema).optional().nullable(),
});

export type TSystemConfigResponse = z.infer<typeof SystemConfigSchema>;
export type TCreateSystemConfigRequest = z.infer<typeof CreateSystemConfigSchema>;
export type TUpdateSystemConfigRequest = z.infer<typeof UpdateSystemConfigSchema>;