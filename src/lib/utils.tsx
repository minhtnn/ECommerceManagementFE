import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDateTimeInShort = (dateTime: Date) => {
  return formatDate(dateTime, "dd/MM/yyyy");
}

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat("vi-VN").format(number);
};

export const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast(
      <div className="flex flex-col">
        <span className="font-medium text-green-600">
          {label} đã được sao chép.
        </span>
      </div>
    );
  } catch (err) {
    toast(
      <div className="flex flex-col">
        <span className="font-medium text-red-600">
          Không thể sao chép {label}.
        </span>
      </div>
    );
  }
};

export interface ExtractedInlineImage {
    index: number;
    base64: string;
    mimeType: string;
}

export interface ExtractResult {
    cleanHtml: string;
    images: ExtractedInlineImage[];
}
export const extractBase64Images = (html: string): ExtractResult => {
    const images: ExtractedInlineImage[] = [];
    let index = 0;

    const cleanHtml = html.replace(
        /src="(data:(image\/[^;]+);base64,([^"]+))"/g,
        (_, fullBase64, mimeType) => {
            images.push({ index, base64: fullBase64, mimeType });
            const placeholder = `__inline_${index}__`;
            index++;
            return `src="${placeholder}"`;
        }
    );

    return { cleanHtml, images };
};

export const base64ToFile = (
    base64: string,
    mimeType: string,
    index: number
): File => {
    const base64Data = base64.split(",")[1];
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++)
        byteArray[i] = byteCharacters.charCodeAt(i);

    const extension = mimeType.split("/")[1];
    return new File([byteArray], `inline_${index}.${extension}`, {
        type: mimeType,
    });
};

export const buildPostFormData = (params: {
    fields: Record<string, string | number | undefined | null>;
    image?: File | null;
    htmlContent?: string | null;
}): FormData => {
    const { fields, image, htmlContent } = params;
    const formData = new FormData();

    // 1. Append fields thông thường
    Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "")
            formData.append(key, String(value));
    });

    // 2. Append featured image
    if (image)
        formData.append("Image", image);

    // 3. Extract base64 → placeholder, append inline images
    if (htmlContent) {
        const { cleanHtml, images } = extractBase64Images(htmlContent);
        formData.append("Content", cleanHtml);

        images.forEach(({ base64, mimeType, index }) => {
            const file = base64ToFile(base64, mimeType, index);
            formData.append(`InlineImages[${index}]`, file);
        });
    } else {
        formData.append("Content", "");
    }

    return formData;
};