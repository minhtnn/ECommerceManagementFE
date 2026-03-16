import { Banner1, Banner2, Banner3 } from "@/assets";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const banners = [
  {
    id: 1,
    // title: "Siêu Sale 12.12",
    // subtitle: "Đông Này, Mang Uni Coffee Về Nhà",
    // promo: "Từ 09.12 đến 17.12",
    // cta: "Mua Ngay",
    // bgColor: "from-primary to-primary/80",
    image: Banner1,
  },
  {
    id: 2,
    // title: "Tặng 01 Túi 200g",
    // subtitle: "Khi Mua Túi 1kg Cà Phê Truyền Thống",
    // promo: "Ưu đãi có hạn",
    // cta: "Khám Phá",
    // bgColor: "from-coffee-dark to-primary/90",
    image: Banner2,
  },
  {
    id: 3,
    // title: "Freeship Toàn Quốc",
    // subtitle: "Cho đơn hàng từ 399.000đ",
    // promo: "Áp dụng toàn bộ sản phẩm",
    // cta: "Mua Sắm",
    // bgColor: "from-accent to-primary",
    image: Banner3,
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="min-w-full relative h-[400px] md:h-[500px]"
          >
            {/* Background Image */}
            <img
              src={banner.image}
              // alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <div
              className={cn(
                "absolute inset-0",
                // "bg-gradient-to-r from-primary/90 via-primary/50 to-transparent",
              )}
            />
            {/* Content */}
            {/* <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 h-full flex items-center">
              <div className="max-w-2xl">
                <div className="text-primary-foreground/80 text-sm md:text-base mb-2 animate-fade-in">
                  {banner.promo}
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 animate-fade-in-up drop-shadow-lg">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-2xl text-primary-foreground/90 mb-8 animate-fade-in-up drop-shadow" style={{ animationDelay: "0.1s" }}>
                  {banner.subtitle}
                </p>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  {banner.cta}
                </Button>
              </div>
            </div> */}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary-foreground w-8"
                : "bg-primary-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
