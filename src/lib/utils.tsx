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

export const getOptimizedImageUrl = (
  url: string | null,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "auto";
  } = {}
): string => {
  if (!url) return "";

  const { width, height, quality = 75, format = "auto" } = options;

  // Cloudinary
  if (url.includes("cloudinary.com")) {
    const transforms = [
      "f_auto",           // tự chọn format tốt nhất (webp/avif)
      `q_${quality}`,     // quality
      width ? `w_${width}` : "",
      height ? `h_${height}` : "",
      "c_fill",
    ]
      .filter(Boolean)
      .join(",");

    return url.replace("/upload/", `/upload/${transforms}/`);
  }

  if (url.includes("imagekit.io")) {
    const params = new URLSearchParams();
    if (width) params.set("tr", `w-${width},h-${height || width},q-${quality},f-auto`);
    return `${url}?${params.toString()}`;
  }

  return url;
};
