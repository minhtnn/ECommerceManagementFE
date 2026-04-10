import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  className?: string;
  src?: string;
  alt?: string;
  aspectRatio?: string;
}

const ImagePlaceholder = ({
  className = "",
  src,
  alt = "",
  aspectRatio,
}: ImagePlaceholderProps) => {
  return (
    <div
      className={`image-placeholder ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : null}
      {!src ? (
        <div className="flex items-center justify-center h-full w-full bg-gray-200">
          <ImageIcon className="text-gray-500" size={48} />
        </div>
      ) : null}
    </div>
  );
};

export default ImagePlaceholder;
