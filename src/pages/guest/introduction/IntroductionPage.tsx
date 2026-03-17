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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Câu chuyện của chúng tôi</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Uni Coffee Roastery được thành lập với mục tiêu mang đến những sản phẩm cà phê Việt Nam chất lượng cao đến tay người tiêu dùng. Chúng tôi tự hào là đối tác tin cậy của hàng ngàn gia đình Việt trong việc lựa chọn cà phê mỗi ngày.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Với hơn 10 năm kinh nghiệm trong ngành cà phê, chúng tôi không ngừng cải tiến quy trình sản xuất và chất lượng sản phẩm để đảm bảo mỗi ly cà phê đều mang đến trải nghiệm tuyệt vời nhất.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Coffee, title: "Chất lượng", desc: "100% cà phê nguyên chất" },
            { icon: Users, title: "Uy tín", desc: "Tin dùng bởi 1M+ khách hàng" },
            { icon: Award, title: "Đẳng cấp", desc: "Tiêu chuẩn quốc tế" },
            { icon: Heart, title: "Tâm huyết", desc: "Từ nông trại đến bàn ăn" },
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
          <p className="text-primary-foreground/80 mb-6">Khám phá bộ sưu tập cà phê đa dạng của chúng tôi</p>
          <a 
            href= {PATH_GUEST.products.root}
            className="inline-block bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-3 rounded-full transition-colors"
          >
            Mua sắm ngay
          </a>
        </div>
      </div>
    </>
  );
}   
export default IntroductionPage;