import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  className?: string;
  aspectRatio?: string;
}

const ImagePlaceholder = ({ className = "", aspectRatio }: ImagePlaceholderProps) => {
  return (
    <div
      className={`image-placeholder ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
    </div>
  );
};

export default ImagePlaceholder;
