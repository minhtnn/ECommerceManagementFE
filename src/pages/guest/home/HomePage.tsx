import CategoryNav from "@/components/home/CategoryNav";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import HeroBanner from "@/components/home/HeroBanner";
import ProductSection from "@/components/home/ProductSection";
import QuickLinks from "@/pages/guest/home/components/QuickLinks";
import VoucherSection from "@/components/home/VoucherSection";
import { groundCoffeeProducts, instantCoffeeProducts, instantMixProducts } from "@/data/mockData";
import EndUserLayout from "@/layouts/EndUserLayout";

const HomePage = () => {
  return (
    <EndUserLayout>
      {/* SEO Meta */}
      <title>Uni Coffee Roastery - Cà Phê Việt Nam Chất Lượng Cao</title>
      
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Navigation */}
      {/* <CategoryNav /> */}

      {/* Quick Links */}
      <QuickLinks />

      {/* Voucher Section */}
      {/* <VoucherSection /> */}

      {/* Flash Sale */}
      {/* <FlashSaleSection /> */}

      {/* Ground Coffee Section */}
      {/* <ProductSection
        title="Cà phê rang xay"
        products={groundCoffeeProducts}
        slug="ground-coffee"
      /> */}

      {/* Instant Coffee Section */}
      {/* <ProductSection
        title="Cà phê uống liền"
        products={instantCoffeeProducts}
        slug="instant-coffee"
      /> */}

      {/* Instant Mix Section */}
      {/* <ProductSection
        title="Cà phê hoà tan"
        products={instantMixProducts}
        slug="instant-mix"
      /> */}
    </EndUserLayout>
  );
}
export default HomePage;