import { useState } from "react";
import { Link } from "react-router-dom";
import { quickLinks, groundCoffeeProducts, instantCoffeeProducts, instantMixProducts, formatPrice } from "@/data/mockData";
import { Truck, Tag, Flame, Store, Coffee, MessageCircle, Star, Phone, Mail, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, React.ReactNode> = {
  "🚚": <Truck size={28} />,
  "🏷️": <Tag size={28} />,
  "🔥": <Flame size={28} />,
  "🏪": <Store size={28} />,
  "☕": <Coffee size={28} />,
  "💬": <MessageCircle size={28} />,
};

const QuickLinks = () => {
  const [bestSellersOpen, setBestSellersOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [exclusiveOpen, setExclusiveOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Combine all products and sort by reviewCount (highest first) as proxy for purchases
  const allProducts = [
    // ...flashSaleProducts,
    ...groundCoffeeProducts,
    ...instantCoffeeProducts,
    ...instantMixProducts,
  ];

  // Sort by reviewCount descending and take top 20
  const bestSellerProducts = [...allProducts]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 20);

  const handleQuickLinkClick = (label: string, e: React.MouseEvent) => {
    if (label === "Bán chạy") {
      e.preventDefault();
      setBestSellersOpen(true);
    } else if (label === "Giao hàng") {
      e.preventDefault();
      setDeliveryOpen(true);
    } else if (label === "ĐỘC QUYỀN") {
      e.preventDefault();
      setExclusiveOpen(true);
    } else if (label === "Liên hệ") {
      e.preventDefault();
      setContactOpen(true);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {quickLinks.map((link, index) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={(e) => handleQuickLinkClick(link.label, e)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {iconMap[link.icon] || <span className="text-2xl">{link.icon}</span>}
              </div>
              <span className="text-sm font-medium text-center text-foreground">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Best Sellers Sheet */}
      <Sheet open={bestSellersOpen} onOpenChange={setBestSellersOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0">
          <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                <SheetTitle>Sản phẩm bán chạy</SheetTitle>
                <Badge variant="secondary" className="ml-2">
                  Top 20
                </Badge>
              </div>
            </div>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-4 space-y-4">
              {bestSellerProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={() => setBestSellersOpen(false)}
                  className="flex gap-4 p-3 rounded-lg hover:bg-muted transition-colors border"
                >
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < product.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      {product.discount && (
                        <Badge variant="destructive" className="text-xs">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>
                    {product.badge && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Delivery Policy Sheet */}
      <Sheet open={deliveryOpen} onOpenChange={setDeliveryOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0">
          <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <SheetTitle>Chính sách giao hàng</SheetTitle>
            </div>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-4 space-y-6 text-sm leading-relaxed">
              {/* Section 1 */}
              <section>
                <h3 className="font-bold text-base mb-3">1. Giới thiệu</h3>
                <p className="text-muted-foreground mb-2">
                  Chào mừng Quý khách hàng đến với website shop.thaikiencoffee.com.vn.
                </p>
                <p className="text-muted-foreground mb-2">
                  Khi Quý khách hàng truy cập vào trang website của chúng tôi có nghĩa là Quý khách đồng ý với các điều khoản này. Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều khoản mua bán hàng hóa này, vào bất cứ lúc nào.
                </p>
                <p className="text-muted-foreground">
                  Quý khách hàng vui lòng kiểm tra thường xuyên để cập nhật những thay đổi của chúng tôi.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h3 className="font-bold text-base mb-3">2. Hướng dẫn sử dụng website</h3>
                <p className="text-muted-foreground mb-2">
                  Khi vào web của chúng tôi, khách hàng phải đảm bảo đủ 18 tuổi, hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp pháp.
                </p>
                <p className="text-muted-foreground">
                  Trong suốt quá trình đăng ký, Quý khách đồng ý nhận email quảng cáo từ website. Nếu không muốn tiếp tục nhận mail, Quý khách có thể từ chối bằng cách nhấp vào đường link ở dưới cùng trong mọi email quảng cáo.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h3 className="font-bold text-base mb-3">3. CHÍNH SÁCH THANH TOÁN</h3>
                <p className="text-muted-foreground mb-3">
                  Để thanh toán, khách hàng có thể lựa chọn hai hình thức:
                </p>
                
                <h4 className="font-semibold mb-2">Thanh toán khi nhận hàng (COD)</h4>
                <p className="text-muted-foreground mb-3">
                  Khách hàng trả tiền mặt cho nhân viên giao hàng COD ngay khi nhận được đơn hàng của mình. Chúng tôi chấp nhận hình thức thanh toán khi nhận hàng (COD) cho tất cả các đơn hàng trên toàn quốc.
                </p>
                <p className="text-muted-foreground mb-4">
                  Thanh toán khi giao hàng (COD) đơn hàng giá trị từ 0đ đến 2.500.000đ
                </p>

                <h4 className="font-semibold mb-2">Thanh toán chuyển khoản</h4>
                <p className="text-muted-foreground mb-3">
                  Khách hàng thực hiện chuyển khoản cho chúng tôi với đơn hàng từ 2,5 triệu trở lên. Chúng tôi không ship COD với đơn hàng giá trị cao.
                </p>
                
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="font-medium mb-2">Thông tin chuyển khoản:</p>
                  <p className="text-muted-foreground">TÊN CHỦ TÀI KHOẢN: CÔNG TY TNHH MTV THÁI KIÊN</p>
                  <p className="text-muted-foreground">Số tài khoản: 119002632865</p>
                  <p className="text-muted-foreground">Tại ngân hàng: Vietinbank - CN7 Tp.HCM - 346 Bùi Hữu Nghĩa, Phường 2, Quận Bình Thạnh, TP. HCM</p>
                  <p className="text-muted-foreground mt-2">
                    Vui lòng liên hệ: <span className="text-primary font-medium">0937.722.522</span> để báo xác nhận thông tin đơn hàng và xác nhận thanh toán.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <h3 className="font-bold text-base mb-3">4. CHÍNH SÁCH VẬN CHUYỂN</h3>
                <p className="text-muted-foreground mb-3">
                  <span className="font-medium">Phạm vi:</span> Giao hàng trên toàn quốc
                </p>
                
                <h4 className="font-semibold mb-2">Chi phí vận chuyển</h4>
                <p className="text-muted-foreground mb-4">
                  Cước vận chuyển được tính dựa trên đơn hàng, địa chỉ giao hàng và chương trình hỗ trợ vận chuyển được áp dụng từ nhà bán hàng (nếu có); khách hàng chịu phí vận chuyển tính theo cước chuyển phát của đơn vị cung cấp dịch vụ.
                </p>

                <h4 className="font-semibold mb-2">Thời gian giao hàng:</h4>
                <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                  <li>Đối với khách hàng tại nội thành TP Hồ Chí Minh, thời gian giao hàng từ 2-4 ngày</li>
                  <li>Khách hàng ngoại thành TP HCM và các tỉnh thành khác, thời gian giao hàng 5-7 ngày (tuỳ theo đơn vị vận chuyển)</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  Trong trường hợp xảy ra sự cố khiến đơn hàng bị chậm trễ so với thời gian giao dự kiến, chúng tôi sẽ thông báo tới quý khách hàng.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h3 className="font-bold text-base mb-3">5. CHÍNH SÁCH KIỂM HÀNG</h3>
                <p className="text-muted-foreground mb-2">
                  Khi nhân viên giao nhận giao hàng, khách hàng có thể kiểm tra sản phẩm và xác nhận với nhân viên tình trạng sản phẩm trước khi thanh toán.
                </p>
                <p className="text-muted-foreground">
                  Với các sản phẩm vỡ, hỏng hóc, bị bóp méo, hoặc thiếu số lượng, Khách hàng có thể báo lại nhân viên giao hàng và phản hồi chúng tôi. Chúng tôi sẽ thực hiện chính sách đổi sản phẩm nếu do lỗi của nhà sản xuất hoặc do lỗi của bên giao nhận.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h3 className="font-bold text-base mb-3">6. Trách nhiệm đối với bên cung cấp dịch vụ giao nhận</h3>
                <p className="text-muted-foreground mb-2">
                  Đối tác vận chuyển có trách nhiệm cung cấp dịch vụ vận chuyển theo đúng yêu cầu, tiêu chuẩn dịch vụ đã đề ra và đã được thỏa thuận trong hợp đồng hợp tác.
                </p>
                <p className="text-muted-foreground">
                  Đơn vị vận chuyển có trách nhiệm cung cấp các chứng từ liên quan tới hàng hóa khi được yêu cầu bởi cơ quan quản lý nhà nước có thẩm quyền trong quá trình thực hiện dịch vụ giao nhận.
                </p>
              </section>

              {/* Contact Info */}
              <section className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="font-medium text-primary mb-3 italic">
                  Mọi thông tin cần hỗ trợ, khách hàng vui lòng liên hệ:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="font-medium text-foreground">Công ty TNHH MTV Thái Kiên</span></p>
                  <p>Địa chỉ: 127 Nguyễn Cơ Thạch, An Lợi Đông, Quận 2, TP. Hồ Chí Minh</p>
                  <p>Điện thoại: <span className="text-primary font-medium">0937 722 522</span></p>
                  <p>Email: <span className="text-primary">khac.ngo@vtijs.com</span></p>
                </div>
              </section>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Exclusive/Promotions Policy Sheet */}
      <Sheet open={exclusiveOpen} onOpenChange={setExclusiveOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0">
          <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <SheetTitle>Chính sách khuyến mãi</SheetTitle>
            </div>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-4 space-y-6 text-sm leading-relaxed">
              {/* Section 1 */}
              <section>
                <h3 className="font-bold text-base mb-3">1. Giới thiệu chương trình khuyến mãi</h3>
                <p className="text-muted-foreground mb-2">
                  Chào mừng Quý khách hàng đến với các chương trình khuyến mãi của Thái Kiên Coffee.
                </p>
                <p className="text-muted-foreground">
                  Chúng tôi thường xuyên tổ chức các chương trình ưu đãi đặc biệt dành cho khách hàng thân thiết và khách hàng mới. Các chương trình khuyến mãi được áp dụng theo từng thời điểm và có thể thay đổi mà không cần báo trước.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h3 className="font-bold text-base mb-3">2. Các hình thức khuyến mãi</h3>
                
                <h4 className="font-semibold mb-2">Giảm giá trực tiếp</h4>
                <p className="text-muted-foreground mb-3">
                  Áp dụng mức giảm giá trực tiếp trên giá bán sản phẩm. Mức giảm có thể từ 5% đến 50% tùy theo chương trình và loại sản phẩm.
                </p>

                <h4 className="font-semibold mb-2">Mã giảm giá (Voucher)</h4>
                <p className="text-muted-foreground mb-3">
                  Khách hàng có thể sử dụng mã giảm giá khi thanh toán để được hưởng ưu đãi. Mỗi mã giảm giá có điều kiện áp dụng riêng về giá trị đơn hàng tối thiểu và thời hạn sử dụng.
                </p>

                <h4 className="font-semibold mb-2">Combo ưu đãi</h4>
                <p className="text-muted-foreground mb-3">
                  Mua combo sản phẩm với giá ưu đãi hơn so với mua lẻ từng sản phẩm. Combo thường bao gồm các sản phẩm bổ trợ hoặc sản phẩm cùng loại.
                </p>

                <h4 className="font-semibold mb-2">Quà tặng kèm</h4>
                <p className="text-muted-foreground">
                  Khi mua đơn hàng đạt giá trị nhất định, khách hàng sẽ được tặng kèm quà hoặc sản phẩm miễn phí.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h3 className="font-bold text-base mb-3">3. Điều kiện áp dụng khuyến mãi</h3>
                <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                  <li>Mỗi đơn hàng chỉ được áp dụng một mã giảm giá duy nhất</li>
                  <li>Không áp dụng đồng thời nhiều chương trình khuyến mãi trừ khi có thông báo cụ thể</li>
                  <li>Khuyến mãi không áp dụng cho đơn hàng đã thanh toán hoặc đang trong quá trình giao hàng</li>
                  <li>Một số sản phẩm có thể không tham gia chương trình khuyến mãi</li>
                  <li>Số lượng sản phẩm khuyến mãi có giới hạn và áp dụng theo thứ tự đặt hàng</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h3 className="font-bold text-base mb-3">4. Thời gian áp dụng</h3>
                <p className="text-muted-foreground mb-2">
                  Mỗi chương trình khuyến mãi có thời gian áp dụng riêng, được thông báo rõ ràng trên website và các kênh truyền thông của chúng tôi.
                </p>
                <p className="text-muted-foreground">
                  Chương trình khuyến mãi có thể kết thúc sớm hơn dự kiến nếu hết số lượng ưu đãi hoặc theo quyết định của công ty.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h3 className="font-bold text-base mb-3">5. Chương trình Flash Sale</h3>
                <p className="text-muted-foreground mb-2">
                  Flash Sale là chương trình giảm giá đặc biệt trong thời gian ngắn với mức ưu đãi hấp dẫn nhất.
                </p>
                <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                  <li>Thời gian diễn ra: Thường vào các khung giờ cố định trong ngày</li>
                  <li>Số lượng giới hạn: Mỗi sản phẩm Flash Sale chỉ có số lượng nhất định</li>
                  <li>Giảm giá sâu: Mức giảm từ 20% đến 50% so với giá gốc</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section>
                <h3 className="font-bold text-base mb-3">6. Chính sách hoàn tiền khuyến mãi</h3>
                <p className="text-muted-foreground mb-2">
                  Khi hoàn trả sản phẩm đã mua với giá khuyến mãi, số tiền hoàn lại sẽ được tính theo giá đã thanh toán thực tế, không phải giá gốc.
                </p>
                <p className="text-muted-foreground">
                  Mã giảm giá đã sử dụng sẽ không được hoàn lại sau khi đơn hàng bị hủy hoặc hoàn trả.
                </p>
              </section>

              {/* Contact Info */}
              <section className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="font-medium text-primary mb-3 italic">
                  Mọi thắc mắc về chương trình khuyến mãi, vui lòng liên hệ:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><span className="font-medium text-foreground">Công ty TNHH MTV Thái Kiên</span></p>
                  <p>Hotline: <span className="text-primary font-medium">0937 722 522</span></p>
                  <p>Email: <span className="text-primary">khac.ngo@vtijs.com</span></p>
                  <p>Fanpage: <span className="text-primary">facebook.com/thaikiencoffee</span></p>
                </div>
              </section>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Contact Sheet */}
      <Sheet open={contactOpen} onOpenChange={setContactOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <SheetTitle>Liên hệ với chúng tôi</SheetTitle>
              </div>
            </div>
          </SheetHeader>
          <div className="p-4 space-y-3">
            {/* Chat Messenger */}
            <a
              href="https://www.facebook.com/unicoffeeroastery"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br  from-blue-500 to-purple-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                  <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.444 5.544 3.683 7.226V22l3.358-1.85c.893.248 1.84.383 2.828.383l.131-.001C17.523 20.532 22 16.387 22 11.243S17.523 2 12 2zm1.197 12.517l-2.758-2.944-5.38 2.944 5.916-6.274 2.827 2.944 5.31-2.944-5.915 6.274z"/>
                </svg>
              </div>
              <span className="font-medium text-foreground">Chat Messenger</span>
            </a>

            {/* Chat Zalo */}
            <a
              href="https://zalo.me/0909429323"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Zalo</span>
              </div>
              <span className="font-medium text-foreground">Chat Zalo</span>
            </a>

            {/* Register & Leave Message */}
            {/* <Link
              to="/guest/contact"
              onClick={() => setContactOpen(false)}
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium text-foreground">Đăng kí thông tin và để lại lời nhắn</span>
            </Link> */}

            {/* Call Now */}
            <a
              href="tel:0909429323"
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-foreground">Gọi ngay</span>
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default QuickLinks;
