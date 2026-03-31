import { AboutUniCoffeeRoastery } from "@/assets";
import { PATH_GUEST } from "@/routes/path";
import { Award, Coffee, Heart, Users } from "lucide-react";

const IntroductionPage = () => {
  return (
    <>
      {/* Hero */}
      <div className="relative h-[300px] md:h-[400px]">
        <img
          src={AboutUniCoffeeRoastery}
          alt="About Uni Coffee"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Story */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Câu chuyện của chúng tôi
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
            Uni Coffee Roastery là đơn vị hoạt động chuyên sâu trong lĩnh vực
            cung ứng cà phê nhân xanh, rang xay và phát triển giải pháp nguyên
            liệu cà phê dành cho doanh nghiệp. Với định hướng xây dựng một hệ
            thống vận hành bài bản, tiêu chuẩn chất lượng rõ ràng và năng lực
            cung ứng ổn định, Uni Coffee Roastery tập trung trở thành đối tác uy
            tín của các chuỗi F&B, quán cà phê, nhà phân phối và doanh nghiệp
            kinh doanh cà phê trên toàn thị trường. Chúng tôi cung cấp nguồn cà
            phê nhân xanh chất lượng, được tuyển chọn kỹ lưỡng từ các vùng
            nguyên liệu phù hợp, đồng thời vận hành hệ thống rang theo profile
            chuẩn, kiểm soát chặt chẽ từng mẻ rang nhằm đảm bảo sự đồng nhất về
            hương vị, màu sắc và hiệu suất chiết xuất trong suốt quá trình sử
            dụng.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
            Với Uni Coffee Roastery, chất lượng không chỉ nằm ở sản phẩm đầu ra
            mà còn được xây dựng từ toàn bộ quy trình làm việc. Từ khâu lựa chọn
            nguyên liệu, đánh giá đặc tính hạt, xây dựng profile rang, kiểm soát
            thành phẩm cho đến đóng gói và bàn giao, mọi công đoạn đều được thực
            hiện theo tinh thần chính xác, minh bạch và nhất quán. Điều đó giúp
            khách hàng yên tâm về độ ổn định của sản phẩm, đồng thời tối ưu hiệu
            quả vận hành, kiểm soát chi phí và duy trì chất lượng đồng đều trong
            kinh doanh.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
            Bên cạnh vai trò là nhà cung cấp, Uni Coffee Roastery hướng đến vị
            thế của một đơn vị đồng hành chiến lược cùng khách hàng trong quá
            trình phát triển sản phẩm và thương hiệu cà phê. Chúng tôi hiểu rằng
            mỗi mô hình kinh doanh sẽ có nhu cầu khác nhau về khẩu vị, phân khúc
            khách hàng, phương pháp pha chế và định hướng thương hiệu. Vì vậy,
            Uni Coffee Roastery luôn đề cao khả năng tư vấn, tùy chỉnh giải pháp
            nguyên liệu và hỗ trợ khách hàng xây dựng sản phẩm phù hợp với thực
            tế vận hành, thay vì chỉ cung cấp cà phê theo cách thông thường.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
            Chúng tôi cũng đặt trọng tâm vào việc xây dựng uy tín bằng năng lực
            cung ứng lâu dài và tinh thần hợp tác bền vững. Trong bối cảnh thị
            trường ngày càng đòi hỏi cao về chất lượng, tính ổn định và tốc độ
            đáp ứng, Uni Coffee Roastery cam kết mang đến cho đối tác sự an tâm
            trong từng lô hàng, sự rõ ràng trong từng tiêu chuẩn và sự chuyên
            nghiệp trong từng điểm chạm hợp tác. Đó không chỉ là cam kết về sản
            phẩm, mà còn là cam kết về trách nhiệm, sự nghiêm túc và giá trị lâu
            dài mà chúng tôi mong muốn cùng khách hàng tạo dựng.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
            Với định hướng phát triển bền vững, Uni Coffee Roastery không ngừng
            hoàn thiện năng lực chuyên môn, công nghệ rang xay và hệ thống kiểm
            soát chất lượng để đáp ứng ngày càng tốt hơn nhu cầu của thị trường.
            Chúng tôi tin rằng một đơn vị rang xay chuyên nghiệp không chỉ tạo
            ra cà phê ngon, mà còn phải tạo ra sự tin cậy, tính ổn định và nền
            tảng hợp tác lâu dài cho khách hàng. Trên hành trình đó, Uni Coffee
            Roastery mong muốn trở thành lựa chọn đáng tin cậy của các doanh
            nghiệp đang tìm kiếm một nhà cung cấp cà phê có tâm, có năng lực và
            có định hướng phát triển rõ ràng.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Coffee,
              title: "Chất lượng",
              desc: "100% cà phê nguyên chất",
            },
            {
              icon: Users,
              title: "Uy tín",
              desc: "Tin dùng bởi 1M+ khách hàng",
            },
            { icon: Award, title: "Đẳng cấp", desc: "Tiêu chuẩn quốc tế" },
            {
              icon: Heart,
              title: "Tâm huyết",
              desc: "Từ nông trại đến bàn ăn",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="text-center p-6 bg-cream rounded-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <item.icon size={40} className="mx-auto text-primary mb-4" />
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-primary text-primary-foreground rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Trải nghiệm ngay hôm nay</h2>
          <p className="text-primary-foreground/80 mb-6">
            Khám phá bộ sưu tập cà phê đa dạng của chúng tôi
          </p>
          <a
            href={PATH_GUEST.products.root}
            className="inline-block bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-3 rounded-full transition-colors"
          >
            Mua sắm ngay
          </a>
        </div>
      </div>
    </>
  );
};
export default IntroductionPage;
