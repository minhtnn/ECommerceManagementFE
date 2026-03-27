import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
    Check,
    ChevronRight,
    Loader2,
    Sparkles,
    Tag
} from "lucide-react";

interface ApplicablePromotionsSheetProps {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  isApplicableLoading: boolean;
  applicableData: any;
  applicablePromotions: any[];
  appliedPromotionIds: Set<string>;
  applyingId: string | null;
  updateCartMutation: any;
  handleApplyFromSheet: (code: string, id: string) => void;
}

export const ApplicablePromotionsSheet = ({
  sheetOpen,
  setSheetOpen,
  isApplicableLoading,
  applicableData,
  applicablePromotions,
  appliedPromotionIds,
  applyingId,
  updateCartMutation,
  handleApplyFromSheet,
}: ApplicablePromotionsSheetProps) => (
  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
    <SheetTrigger asChild>
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors text-sm"
      >
        <span className="flex items-center gap-2 text-primary font-medium">
          <Sparkles size={14} />
          Xem khuyến mãi có thể áp dụng
        </span>
        <ChevronRight size={14} className="text-primary/60" />
      </button>
    </SheetTrigger>

    <SheetContent
      side="bottom"
      className="rounded-t-2xl !max-h-[85vh] min-h-[85vh]"
    >
      <SheetHeader className="pb-2">
        <SheetTitle className="flex items-center gap-2 text-base">
          <Sparkles size={16} className="text-primary" />
          Khuyến mãi có thể áp dụng
        </SheetTitle>
      </SheetHeader>

      <div className="overflow-y-auto max-h-[calc(100vh-100px)] pb-4">
        <div
          className={cn(
            (isApplicableLoading && !applicableData) ||
              applicablePromotions.length === 0
              ? "flex flex-col items-center justify-center py-12 gap-3"
              : "space-y-3 pt-2",
          )}
        >
          {isApplicableLoading && !applicableData ? (
            <>
              <Loader2 size={28} className="animate-spin text-primary/50" />
              <p className="text-sm text-muted-foreground">
                Đang tải khuyến mãi...
              </p>
            </>
          ) : applicablePromotions.length === 0 ? (
            <>
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Tag size={22} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Không có khuyến mãi nào phù hợp với giỏ hàng hiện tại
              </p>
            </>
          ) : (
            <div>
              {applicablePromotions.map((promo) => {
                const isApplied = appliedPromotionIds.has(promo.id);
                const isApplyingThis = applyingId === promo.id;

                return (
                  <div
                    key={promo.id}
                    className={`relative flex items-start gap-3 p-4 rounded-xl border transition-all ${
                      isApplied
                        ? "border-green-300 bg-green-50"
                        : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isApplied ? "bg-green-100" : "bg-primary/10"
                      }`}
                    >
                      <Tag
                        size={16}
                        className={
                          isApplied ? "text-green-600" : "text-primary"
                        }
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm leading-snug ${
                          isApplied ? "text-green-800" : "text-foreground"
                        }`}
                      >
                        {promo.name}
                      </p>
                      {promo.shortDescription && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {promo.shortDescription}
                        </p>
                      )}
                    </div>

                    {/* Action */}
                    <div className="shrink-0 ml-2">
                      {isApplied ? (
                        <Badge
                          variant="outline"
                          className="text-green-700 border-green-300 bg-green-50 text-xs gap-1"
                        >
                          <Check size={10} />
                          Đã áp dụng
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 px-3 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                          disabled={
                            isApplyingThis || updateCartMutation.isPending
                          }
                          onClick={() =>
                            handleApplyFromSheet(promo.code, promo.id)
                          }
                        >
                          {isApplyingThis ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            "Áp dụng"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SheetContent>
  </Sheet>
);