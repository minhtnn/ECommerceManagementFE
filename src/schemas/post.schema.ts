import { EPostStatus } from "@/types/enums/post-status.enum";
import z from "zod";


export const PostListSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    title: z.string(),
    imageUrl: z.string().nullable(),
});

export const PostDetailSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    title: z.string(),
    author: z.string().nullable(),
    slug: z.string().nullable(),
    content: z.string().nullable(),
    excerpt: z.string().nullable(),
    imagePath: z.string().nullable(),
    imageUrl: z.string().nullable(),
    status: z.nativeEnum(EPostStatus),
    publishedAt: z.date().nullable(),
    createdDate: z.date(),
    lastModifiedDate: z.date().nullable(),
});

export const CreatePostSchema = z.object({
    code: z.string({ required_error: "Mã bài đăng không được bỏ trống" })
        .min(2, { message: "Mã bài đăng không được ít hơn 2 ký tự" })
        .max(100, { message: "Mã bài đăng không được vượt quá 100 ký tự" }),
    title: z.string({ required_error: "Tiêu đề không được bỏ trống" })
        .min(2, { message: "Tiêu đề không được ít hơn 2 ký tự" })
        .max(500, { message: "Tiêu đề không được vượt quá 500 ký tự" }),
    slug: z.string()
        .max(500, { message: "Slug không được vượt quá 500 ký tự" })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang" })
        .optional()
        .or(z.literal("")),
    excerpt: z.string()
        .max(1000, { message: "Tóm tắt không được vượt quá 1000 ký tự" })
        .optional()
        .or(z.literal("")),
    content: z.string()
        .max(50000, { message: "Nội dung không được vượt quá 50000 ký tự" })
        .optional()
        .or(z.literal("")),
});

export const UpdatePostSchema = z.object({
    id: z.string().uuid(),
    title: CreatePostSchema.shape.title,
    slug: CreatePostSchema.shape.slug,
    excerpt: CreatePostSchema.shape.excerpt,
    content: CreatePostSchema.shape.content,
    status: z.nativeEnum(EPostStatus),
});

export const PublicPostItemSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    title: z.string(),
    author: z.string().nullable(),
    excerpt: z.string().nullable(),
    imagePath: z.string().nullable(),
    imageUrl: z.string().nullable(),
    publishedAt: z.date().nullable(),
});

export const PublicPostDetailSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    title: z.string(),
    author: z.string().nullable(),
    slug: z.string().nullable(),
    content: z.string().nullable(),
    excerpt: z.string().nullable(),
    imagePath: z.string().nullable(),
    imageUrl: z.string().nullable(),
    publishedAt: z.date().nullable(),
});


export type TPostList = z.infer<typeof PostListSchema>;
export type TPostDetail = z.infer<typeof PostDetailSchema>;
export type TCreatePost = z.infer<typeof CreatePostSchema>;
export type TUpdatePost = z.infer<typeof UpdatePostSchema>;
export type TPublicPostItem = z.infer<typeof PublicPostItemSchema>;
export type TPublicPostDetail = z.infer<typeof PublicPostDetailSchema>;