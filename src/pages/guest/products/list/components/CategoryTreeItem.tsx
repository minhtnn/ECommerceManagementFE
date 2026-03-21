import { ImageOff, Minus, Plus } from "lucide-react";
import { useState } from "react";

export const CategoryTreeItem = ({
  category,
  level = 0,
  selectedId,
  onSelect,
}) => {
  // const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedId === category.id;

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <div
        className={`rounded-md flex items-center justify-between h-auto py-3 px-3 w-full hover:bg-[hsl(var(--tree-item-hover))] cursor-pointer transition-colors ${
          isSelected ? "bg-[hsl(var(--tree-item-selected))]" : ""
        }`}
        style={{ paddingLeft: level > 0 ? `${level * 16 + 12}px` : undefined }}
        onClick={() => onSelect(category.id)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0.5 hover:bg-[hsl(var(--tree-button-hover))] rounded flex-shrink-0 transition-colors"
            >
              {isExpanded ? (
                <Minus className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Plus className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5 flex-shrink-0" />} */}

          {/* Category Image */}
          {category.imageUrl ? (
            <div className="w-10 h-10 overflow-hidden flex-shrink-0 border border-[hsl(var(--tree-border-image))] rounded-full">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex justify-center items-center w-10 h-10 overflow-hidden flex-shrink-0 border border-[hsl(var(--tree-border-image))] rounded-full">
              <ImageOff className="w-5 h-5 text-[hsl(var(--tree-icon-empty))]" />
            </div>
          )}

          <div className="flex flex-col items-start flex-1 min-w-0 overflow-hidden">
            <span
              className={`block text-sm transition-colors overflow-hidden text-ellipsis whitespace-nowrap w-full text-left ${
                isSelected
                  ? "text-[hsl(var(--tree-item-text-selected))] font-medium"
                  : "text-[hsl(var(--tree-item-text))]"
              } hover:text-primary`}
              title={category.name}
            >
              {category.name}
            </span>

            {/* Product counts */}
            {/* {(category.productCount > 0 || category.totalProductCount > 0) && (
              <div className="flex items-center gap-2 mt-0.5">
                {category.productCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {category.productCount} sản phẩm
                  </span>
                )}
                {category.totalProductCount > category.productCount && (
                  <span className="text-xs text-[hsl(var(--tree-item-text-selected))]">
                    (+{category.totalProductCount - category.productCount})
                  </span>
                )}
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Render children recursively */}
      {hasChildren && (
        // && isExpanded
        <div className="ml-2">
          {category.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
