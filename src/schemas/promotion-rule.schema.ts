import { EActionTargetRole } from "@/types/enums/action-target-role.enum";
import { EActionTargetType } from "@/types/enums/action-target-type.enum";
import { EPromotionStatus } from "@/types/enums/promotion-status.enum";
import { EPromotionType } from "@/types/enums/promotion-type.enum";
import { ERuleActionType } from "@/types/enums/rule-action-type.enum";
import { ERuleConditionOperator } from "@/types/enums/rule-condition-operator.enum";
import { ERuleConditionType } from "@/types/enums/rule-condition-type.enum";
import { time } from "console";

import z from "zod";


export const RuleActionTargetSchema = z.object({
    targetType: z.nativeEnum(EActionTargetType),
    targetId: z.string().uuid({ message: "TargetId không hợp lệ" }),
    quantity: z.number().min(1, { message: "Số lượng phải >= 1" }),
    role: z.nativeEnum(EActionTargetRole),
});

export const RuleActionSchema = z.object({
    actionType: z.nativeEnum(ERuleActionType),
    value: z.string().optional(),
    maxDiscountAmountForPercentage: z.number().positive().optional(),
    ruleActionTargets: z.array(RuleActionTargetSchema).optional(),
});

export const RuleConditionSchema = z.object({
    conditionType: z.nativeEnum(ERuleConditionType),
    operator: z.nativeEnum(ERuleConditionOperator),
    value: z.string().nonempty({ message: "Giá trị điều kiện không được trống" }),
});


export const PromotionRuleListSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    shortDescription: z.string().optional(),
    priority: z.number(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    status: z.nativeEnum(EPromotionStatus),
});


export const PromotionRuleDetailSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    shortDescription: z.string().nullable().optional(),
    description: z.string().optional(),
    status: z.nativeEnum(EPromotionStatus),
    promotionType: z.nativeEnum(EPromotionType),
    priority: z.number(),
    globalDiscountCap: z.number().nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    createdDate: z.string(),
    lastModifiedDate: z.string().nullable(),
    ruleConditions: z.array(z.object({
        id: z.string().uuid(),
        conditionType: z.nativeEnum(ERuleConditionType),
        operator: z.nativeEnum(ERuleConditionOperator),
        value: z.string().nullable(),
    })),
    ruleActions: z.array(z.object({
        id: z.string().uuid(),
        actionType: z.nativeEnum(ERuleActionType),
        value: z.string().nullable(),
        maxDiscountAmountForPercentage: z.number().nullable(),
        ruleActionTargets: z.array(z.object({
            id: z.string().uuid(),
            targetType: z.nativeEnum(EActionTargetType),
            targetId: z.string().uuid(),
            quantity: z.number(),
            role: z.nativeEnum(EActionTargetRole),
        })),
    })),

});

export const CreatePromotionRuleSchema = z.object({
    code: z.string()
        .nonempty({ message: "Mã khuyến mãi không được để trống" })
        .max(100, { message: "Mã khuyến mãi không quá 100 ký tự" }),
    name: z.string()
        .nonempty({ message: "Tên khuyến mãi không được để trống" })
        .max(200, { message: "Tên khuyến mãi không quá 200 ký tự" }),
    shortDescription: z.string()
        .max(100, { message: "Mô tả ngắn không quá 100 ký tự" })
        .optional(),
    description: z.string()
        .max(500, { message: "Mô tả không quá 500 ký tự" })
        .optional(),
    promotionType: z.nativeEnum(EPromotionType, {
        required_error: "Vui lòng chọn loại khuyến mãi",
    }),
    globalDiscountCap: z.number().positive({ message: "Cap phải > 0" }).optional(),
    priority: z.number().min(0).optional(),
    startDate: z.string().nonempty({ message: "Ngày bắt đầu không được để trống" }),
    endDate: z.string().nonempty({ message: "Ngày kết thúc không được để trống" }),
    timeZone: z.string({required_error: "Múi giờ không được để trống"}).nonempty({ message: "Múi giờ không được để trống" }),
    ruleConditions: z.array(RuleConditionSchema)
        .min(1, { message: "Phải có ít nhất 1 điều kiện" }),
    ruleActions: z.array(RuleActionSchema)
        .min(1, { message: "Phải có ít nhất 1 action" }),
}).refine(
    (data) => new Date(data.startDate) < new Date(data.endDate),
    {
        message: "Ngày bắt đầu phải trước ngày kết thúc",
        path: ["endDate"],
    }
);

export const UpdatePromotionRuleSchema = z.object({
    id: z.string().uuid(),
    name: z.string()
        .nonempty({ message: "Tên không được để trống" })
        .max(50, { message: "Tên không quá 50 ký tự" })
        .optional(),
    shortDescription: z.string().max(100).optional(),
    description: z.string().max(500).optional(),
    promotionType: z.nativeEnum(EPromotionType).optional(),
    globalDiscountCap: z.number().min(0).optional(),
    priority: z.number().min(0).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.nativeEnum(EPromotionStatus).optional(),
    ruleConditions: z.array(RuleConditionSchema).min(1).optional(),
    ruleActions: z.array(RuleActionSchema).min(1).optional(),
});


export type TPromotionRuleList = z.infer<typeof PromotionRuleListSchema>;
export type TPromotionRuleDetail = z.infer<typeof PromotionRuleDetailSchema>;
export type TCreatePromotionRule = z.infer<typeof CreatePromotionRuleSchema>;
export type TUpdatePromotionRule = z.infer<typeof UpdatePromotionRuleSchema>;
export type TRuleCondition = z.infer<typeof RuleConditionSchema>;
export type TRuleAction = z.infer<typeof RuleActionSchema>;
export type TRuleActionTarget = z.infer<typeof RuleActionTargetSchema>;