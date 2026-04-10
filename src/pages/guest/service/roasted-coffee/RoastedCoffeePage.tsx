import { RoastedCoffeeLanding, RoastedCoffeeProcessingAndPackaging, RoastedCoffeeSupplied } from "@/assets";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { PATH_GUEST } from "@/routes/path";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RoastedCoffeePage = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">

        {/* Banner */}
        <div className="page-banner">CÀ PHÊ RANG</div>

        {/* Hero */}
        <section className="content-container py-12 md:py-16">
          <p className="section-label mb-2">WHOLESALE & OEM ROASTING</p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] mb-6 max-w-lg">
            GIẢI PHÁP CÀ PHÊ
            <br />
            RANG XAY TOÀN DIỆN.
          </h1>
          <p className="section-subtitle max-w-2xl mb-8">
            Sự dễ dịch của hương vị là "chìa khóa vàng" để giữ chân khách hàng.
            Mỗi ngày, hàng kỳ lý cà phê được phong thương ngày nhất sẽ đóng
            chất, quán của bạn sẽ nhớ khách đi thẳng. Là một nhà rang cho chuyên
            nghiệp, Uni Coffee Roastery Supply mang đến giải pháp cung cấp cà phê rang
            rồng nguyên chất. Oản với thi đong nhất tuyệt đến thống cùng kéo
            biến hàng, giữa cho cho quán ản chắn minh danh vé tín dụ vụ khách.
            Và Khi cũng sống giá ở là sao. Dù quán chế phân chưa mỗi quán, pha
            sao và, rang gia công OEM để thường giá thương hiện đông. Chúng tôi
            khúa chìa hướng dạ kiến một nhìn ngay lại chúng trải.
          </p>

          <Link
            to={PATH_GUEST.products.root}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold tracking-wide uppercase font-body hover:opacity-90 transition-opacity"
          >
            XEM GIÁ CÀ PHÊ RANG <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Large hero image */}
        <ImagePlaceholder className="w-full h-64 md:h-[400px]" src={RoastedCoffeeLanding} />

        {/* 01. Wholesale Solutions */}
        <section className="content-container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="section-label mb-2">01. WHOLESALE SOLUTIONS</p>
              <h2 className="font-display text-2xl md:text-3xl font-black leading-tight mb-6">
                CUNG CẤP GIÁ SỈ CHO
                <br />
                QUÁN & CHUỖI CÀ PHÊ
              </h2>
              <p className="section-subtitle mb-6">
                Dù quán của bạn dùng máy Espresso hay pha Phin, từ 5.15 kg/mc
                chủ là thi sẽ đông mình. Hệ thống Profile rang nhiều phần mênh
                lên đó Bàn bão như năng thu 100 giống hé mã đầu tiên.
              </p>

              <h3 className="font-display text-lg font-bold mb-2">
                100% Cà Phê Nguyên Bản
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">
                Chúng tôi tốn trong trọng yêu tinh tống vì tí nhiên của hạt cà
                phê. Cam kết trượt và ý không phi quyền gía tay trống bên chưa
                đó ra này. Điều này không chỉ hưng giá kế nghiệm thuần khiết cho
                thuy khách mà hơn cần giúp bảo vệ tất Cà sáu trẻ của dáy say và
                một hứ nhờ pha.
              </p>

              <h3 className="font-display text-lg font-bold mb-2">
                Tối ưu độ tươi mới (Freshness)
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                Quy trình rang được biến hành ngay khi hạt nhất xem hoàn tất qua
                dẳng "nghĩ" (Resting) ký ý lượng. Dải phương riêng điểm khoa
                chất đau đã thường và 10 mùi và tới quá sẽ cho đo toàn cách biến
                cho suy giảm chất lượng dở xa, xác kéo đôi.
              </p>
            </div>
            <div className="space-y-4">
              <ImagePlaceholder className="w-full h-64" src={RoastedCoffeeSupplied} />
            </div>
          </div>
        </section>

        {/* 02. Product Catalog */}
        {/* <section className="py-16">
          <div className="text-center mb-8">
            <p className="section-label mb-2">02. PRODUCT CATALOG</p>
            <h2 className="section-title">DANH MỤC SẢN PHẨM</h2>
          </div>
          <ImagePlaceholder className="w-full h-64 md:h-80" />
        </section> */}

        {/* 03. OEM Roasting */}
        <section className="content-container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <ImagePlaceholder className="w-full h-full" src={RoastedCoffeeProcessingAndPackaging} />
            </div>
            <div>
              <p className="section-label mb-2">03. OEM ROASTING</p>
              <h2 className="font-display text-2xl md:text-3xl font-black leading-tight mb-6">
                DỊCH VỤ GIA CÔNG
                <br />& ĐÓNG GÓI (OEM)
              </h2>
              <p className="section-subtitle mb-8">
                Xây dựng thương hiệu cà phê riêng mà không cần đầu tư xưởng
                rang. Bui sẽ là hậu phương vững chắc cho chiếc kiến của bạn.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-base font-bold mb-1">
                    Custom Blend (Tạo Profile Độc Quyền)
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Tạo ra gói hương vị mang đậm DNA thương hiệu
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold mb-1">
                    Bảo Mật Ký Kết (NDA)
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Bảo mật tuyệt đối công thức phối trộn của đối tác.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold mb-1">
                    White-label (Đóng Gói Thương Hiệu Riêng)
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Hộ trên đóng gói từ trụ vàn 1 chiều, dán tem nhãn sẵn sàng,
                    đến hệ
                  </p>
                </div>
              </div>

              <Link
                to={PATH_GUEST.contact.root}
                className="inline-flex items-center gap-2 mt-8 border-2 border-foreground px-6 py-3 text-sm font-semibold tracking-wide uppercase font-body hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                NHẬN TƯ VẤN VÀ BÁO GIÁ <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Partner Support */}
        <section className="bg-secondary py-16">
          <div className="content-container text-center">
            <p className="section-label mb-2">PARTNER SUPPORT</p>
            <h2 className="flex flex-items justify-center section-title mb-4">
              CHÍNH SÁCH HỖ TRỢ
              <br />
              ĐỐI TÁC KINH DOANH QUÁN
            </h2>
            <p className="section-subtitle max-w-3xl mx-auto mb-12">
              Khi chọn Uni Coffee Roastery Supply làm đơn vị cung cấp cà phê rang một,
              bạn không chỉ mua nguyên liệu: mà còn nhận được giá trẻ đông hành.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Chiết Khấu Cực Tốt",
                  desc: "Mức chiết khấu nào dù đặt cực tốt doanh cho khách gia sỉ lấy số lượng đầu đạn, mới thăng",
                },
                {
                  title: "Chiết Khấu Cực Tốt",
                  desc: "Mức chiết khấu nào đều đặt cực tốt cánh cho khách gia sỉ lấy số lượng cũ dàn dạn mới tì trong",
                },
                {
                  title: "Chiết Khấu Cực Tốt",
                  desc: "Mức chiết khấu nào đều đặt cực tốt doanh cho khách hệ sỉ lấy sế lượng đấu, dạn mới tì trong",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border border-border bg-background p-8 text-center"
                >
                  <div className="text-4xl font-display font-bold text-muted-foreground mb-4">
                    %
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RoastedCoffeePage;
