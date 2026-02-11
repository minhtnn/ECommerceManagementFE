import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/mockData";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import EndUserLayout from "@/layouts/EndUserLayout";
import { PATH_GUEST } from "@/routes/path";

const Cart = () => {
  const { items: cartItems, removeItem, updateQuantity, subtotal } = useCart();

  const shipping = subtotal >= 399000 ? 0 : 30000;
  const total = subtotal + shipping;

  return (
    <EndUserLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <ShoppingCart size={28} />
          Giỏ hàng của bạn
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-6">Giỏ hàng trống</p>
            <Link to={PATH_GUEST.products.root}>
              <Button className="bg-primary hover:bg-primary/90">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div 
                  key={item.id}
                  className="bg-card rounded-lg p-4 flex gap-4 shadow-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain bg-cream rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-primary">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="flex items-center border border-border rounded">
                      <button 
                        className="p-2 hover:bg-muted"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button 
                        className="p-2 hover:bg-muted"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-lg p-6 shadow-sm h-fit animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="font-bold text-lg mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Mua thêm {formatPrice(399000 - subtotal)} để được freeship
                  </p>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
              <Link to="/checkout">
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90 font-bold py-6">
                  Tiến hành thanh toán
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </EndUserLayout>
  );
};

export default Cart;
