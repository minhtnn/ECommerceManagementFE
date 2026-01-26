import { z } from 'zod'

const configSchema = z.object({
    ECOMERCE_COFFEE_API_URL: z.string(),
    BRAND_CODE: z.string(),
});

const configProject = configSchema.safeParse({
    ECOMERCE_COFFEE_API_URL: import.meta.env.VITE_ECOMERCE_COFFEE_API_URL,
    BRAND_CODE: import.meta.env.VITE_BRAND_CODE,
});

if (!configProject.success) {
    // console.error('Các giá trị khai báo trong file .env không hợp lệ:', configProject.error.issues);
    throw new Error('Các giá trị khai báo trong file .env không hợp lệ. Vui lòng kiểm tra lại file .env.');
}

const envConfig = configProject.data;
export default envConfig;