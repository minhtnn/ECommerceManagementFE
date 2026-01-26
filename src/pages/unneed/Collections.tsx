import { useParams } from "react-router-dom";
import { categories, groundCoffeeProducts, instantCoffeeProducts, instantMixProducts } from "@/data/mockData";
import ProductCard from "@/pages/guest/products/list/components/ProductCard";
import EndUserLayout from "@/layouts/EndUserLayout";

const Collections = () => {
  const { slug } = useParams();
  
  const category = categories.find(c => c.slug === slug);
  
  // Get products based on category
  const getProducts = () => {
    switch(slug) {
      case "ground-coffee":
        return groundCoffeeProducts;
      case "instant-coffee":
        return instantCoffeeProducts;
      case "instant-mix":
      case "ready-to-drink":
        return instantMixProducts;
      default:
        return [...groundCoffeeProducts, ...instantCoffeeProducts, ...instantMixProducts];
    }
  };

  const products = getProducts();

  return (
    <EndUserLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-primary">Trang chủ</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">{category?.name || "Tất cả sản phẩm"}</span>
        </nav>

        {/* Category Header */}
        <div className="category-header mb-8">
          {category?.name || "Tất cả sản phẩm"}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* <ProductCard product={product} /> */}
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            Không có sản phẩm nào trong danh mục này.
          </div>
        )}
      </div>
    </EndUserLayout>
  );
};

export default Collections;
