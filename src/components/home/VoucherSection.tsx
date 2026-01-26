import { vouchers } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VoucherSection = () => {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã: ${code}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Voucher và Freeship</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vouchers.map((voucher, index) => (
          <div
            key={voucher.id}
            className="voucher-card animate-fade-in hover:border-primary transition-colors"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <h3 className="text-primary font-bold text-lg mb-2">{voucher.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {voucher.description}
            </p>
            <div className="flex items-center justify-between">
              <code className="bg-muted px-3 py-1 rounded text-sm font-mono font-medium">
                {voucher.code}
              </code>
              <Button
                size="sm"
                onClick={() => copyCode(voucher.code)}
                className="bg-primary hover:bg-primary/90"
              >
                Lưu
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherSection;
