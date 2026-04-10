import { GreenCoffeeDeepProcessing, GreenCoffeeEcologicalFarming, GreenCoffeeIsolateModel, GreenCoffeeLarge, GreenCoffeeRelatedPartyValue, GreenCoffeeVissionAndMission, GreenCoffeeWoodBlock } from "@/assets";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { PATH_GUEST } from "@/routes/path";
import { Link } from "react-router-dom";

const GreenCoffeePage = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">

        {/* Page Banner */}
        <div className="page-banner">CUNG CẤP NHÂN XANH</div>

        {/* Hero Section */}
        <section className="bg-secondary">
          <div className="content-container py-12 md:py-16">
            <p className="section-label mb-2">The Sustainable Crop</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-6">
               Uni Coffee Roastery.
              <br />
              Hạt Cà Phê Bền Vững.
            </h1>
            <p className="section-subtitle max-w-xl mb-8">
              Chúng tôi tìm đóng sự phát triển bền vững bắt đầu từ nguồn đất
              sạch và những người nông dân tâm huyết.  Uni Coffee Roastery không chỉ cung
              cấp cà phê nhân xanh, chúng tôi xây dựng một hệ sinh thái khép kín
              từ farm đến xưởng rang.
            </p>
            <div className="flex gap-12">
              <div>
                <p className="font-display text-4xl md:text-5xl font-bold">
                  1.080m
                </p>
                <p className="text-sm text-muted-foreground font-body mt-1">
                  Độ cao lý tưởng (MASL) cho Fine Robusta
                </p>
              </div>
              <div>
                <p className="font-display text-4xl md:text-5xl font-bold">
                  20+
                </p>
                <p className="text-sm text-muted-foreground font-body mt-1">
                  Nông hộ liên kết sản xuất bền vững
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Large image */}
        <ImagePlaceholder className="w-full h-64 md:h-96" src={GreenCoffeeLarge} alt="Green Coffee" />

        {/* Section 01 - Location & USP */}
        <section className="content-container py-16 text-center">
          <p className="section-label mb-2">01. THE LOCATION & USP</p>
          <h2 className="section-title mb-4">
            Vùng Nguyên Liệu Đất Đỏ Nam Ban
          </h2>
          <p className="section-subtitle max-w-3xl mx-auto mb-12">
            Nằm ở độ cao 1.080 m tại Lâm Đồng,  Uni Coffee Roastery sở hữu vị thế chiến
            lược trên dải đất đỏ thổ nhưỡng biệt lập. Đây là nơi mỗi nguồn nước,
            mỗi cà phê được kiểm soát cho chế biến.
          </p>

          {/* 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Chuyên Sâu Sơ Chế",
                desc: "Áp dụng các kỹ thuật sơ chế nâng cao Candy Wash/Honey tùy mùi vị mong muốn. Sản phẩm Natural Là Gì? Phá vỡ ranh giới qua 24h, Phả sấy khô trên giàn phơi sạch đến các loại khác.",
                src: GreenCoffeeDeepProcessing,
              },
              {
                title: "Mô Hình Khép Kín",
                desc: "Dựa từ mô hình ly Planet De Farm - Cà phê được quang ngợc và nhập liệu Bữi trữ lượng không có gì mới là liên kết toàn vùng một duy nhất.",
                src: GreenCoffeeIsolateModel,
              },
              {
                title: "Mộc Bản 100%",
                desc: "Tự hào cung cấp các cà phê không hóc Bui artisan, tuyển chọn những tinh anh của cà Mã, dấu ấn Mật mật rượu nắng Bui truy hồi.",
                src: GreenCoffeeWoodBlock,
              },
            ].map((item, i) => (
              <div key={i} className="text-left">
                <ImagePlaceholder className="w-full h-48 mb-4" src={item.src}  />
                <h3 className="font-display text-xl font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 02 - Farmers */}
        <section className="bg-secondary py-16">
          <div className="content-container text-center">
            <p className="section-label mb-2">02. NÔNG HỘ & BỀN VỮNG</p>
            <h2 className="section-title mb-4">
              Đồng Hành Cùng Nông Hộ
              <br />
              Vì Tương Lai Cà Phê Việt
            </h2>
            <p className="section-subtitle max-w-3xl mx-auto mb-12">
              Chúng tôi liên kết đã cam sóc và chất lượng, sai mua quyết chính
              100% vật gối cao hành trên thị trường, kiến bạch toàn bộ sự đóng
              góp từ bà mới mua sỉ - từ lĩ mở 130.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Nông Nghiệp Sinh Thái",
                  desc: "Nâng cao giá trị cà phê Việt Nam bằng cách sản đậu kiên thâo và kỹ thuật canh tác sinh thái để hiện đại liên đến tăng kết lệ khi vào.",
                  src: GreenCoffeeEcologicalFarming,
                },
                {
                  title: "Tầm Nhìn & Sứ Mệnh",
                  desc: "Sứ mệnh của chúng tôi là tạo ra sản chất biến nâng cấp cho quốc gia, phê quê và cung cấp nguồn Đ minh xanh kiến thần hơn đôi có tuyển đời.",
                  src: GreenCoffeeVissionAndMission,
                
                },
                {
                  title: "Giá Trị Liên Kết",
                  desc: "Bản bảo nguồn nông Ort bản cho nông trại. Thu mua quyết chế 1325 vể giá cao nước đóng thê thương Bề để cộng mua, phát triển thêm quá.",
                  src: GreenCoffeeRelatedPartyValue,
                },
              ].map((item, i) => (
                <div key={i} className="text-left">
                  <ImagePlaceholder className="w-full h-48 mb-4" src={item.src} />
                  <h3 className="font-display text-xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section B.3 - Green Bean Collection */}
        <section className="content-container py-16">
          <p className="section-label mb-2">B.3 GREEN BEAN COLLECTION</p>
          <h2 className="section-title mb-4">
            Tuyển tập Nhân Xanh New Crop 2026
          </h2>
          <p className="section-subtitle max-w-3xl mb-10">
            Dưới mặt những gỗ chân quý vẻ Relogion thôn Forest là hàn thụ Bản
            gắn "tập ong rú nhà cáo tự hàng thường mỗi đến cáo xưởng ba
            Specialty" đào hiện.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div>
              <h3 className="font-display text-xl font-bold mb-3">
                Fine & Premium Robusta
              </h3>
              <div className="space-y-4 text-sm font-body">
                <div>
                  <p className="font-semibold">Nam Ban Candy Main / Honey</p>
                  <p className="text-muted-foreground">
                    1365 masl | Candy Process, Tỉ lệ chín 100%, Àm hưởng vị chín
                    và minh, hậu vị ngọt dài.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Nam Ban Super Natural</p>
                  <p className="text-muted-foreground">
                    100 ông quân spy Chất khoa tới mọt hứng trả giữa đầu mùa tái
                    thơm dịu.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Robusta G1 & Commercial</p>
                  <p className="text-muted-foreground">
                    Thương vụ lý minh, để trồng các giá phù đủ và cân thiết cho
                    mua cải.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold mb-3">
                Specialty Arabica (Catimor)
              </h3>
              <div className="space-y-4 text-sm font-body">
                <div>
                  <p className="font-semibold">Cầu Đất Washed</p>
                  <p className="text-muted-foreground">
                    1400 masl | Cầu Đất, Đà Lạt | Acid sáng, hương trà ngọt tự
                    tiếp hậu vị đánh lạc.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Cầu Đất Tropical</p>
                  <p className="text-muted-foreground">
                    1400 masl | Lên hàn quý chín mùa, vưaly 20 hương vã đôi sống
                    khổ khác cà.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Lạc Dương Natural Chi</p>
                  <p className="text-muted-foreground">
                    Hiệu suất Mua cà đất chẳng hậu Mano kiến. Bàn cùng chất
                    hương nồng rồi.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold mb-3">
                Limited Edition & Others
              </h3>
              <div className="space-y-4 text-sm font-body">
                <div>
                  <p className="font-semibold">Fruit Fermentation Series</p>
                  <p className="text-muted-foreground">
                    Nam Ban Pink Guava, Dì Mùng, Peach 80oz, Cimmomon Quart -
                    Lartilan thay chế lạc.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Liberica Nguyên Bản</p>
                  <p className="text-muted-foreground">
                    Lạng Ia - Lì Kiến mọi - mặt nhận(bì, bốc và tương mì, rồi đi
                    trở đôi chéo chào.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Robusta Seasonal</p>
                  <p className="text-muted-foreground">
                    Chọ sáu Cồn, Corm thương thấp vì tường vị, vvakhe: ask kể
                    cho thương vì ở hữu lãnh.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-body mb-6">
            *Sản lượng và Profile có thể thay đổi - sao cung thời điểm trong mùa
            vụ mùa
          </p>

          <Link
            to={PATH_GUEST.contact.root}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold tracking-wide uppercase font-body hover:opacity-90 transition-opacity"
          >
            LIÊN HỆ HỒ SƠ NĂNG LỰC & BÁO GIÁ ↓
          </Link>
        </section>

      </div>
    </>
  );
};

export default GreenCoffeePage;
