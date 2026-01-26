import { useProductMenu } from "@/hooks/use-product-menu";
import EndUserLayout from "@/layouts/EndUserLayout";
import { handleApiError } from "@/lib/error";
import ProductCard from "@/pages/guest/products/list/components/ProductCard";
import { RootState } from "@/redux/store";
import { Zap } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { CategoryTreeItem } from "./components/CategoryTreeItem";
import { handleSetChosenCategoryId } from "@/redux/modal/modal-slice";

interface SubCategory {
  name: string;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
  children?: SubCategory[];
}

const categories: Category[] = [
  {
    name: "TRANG CHỦ",
    slug: "/",
    children: [
      { name: "Trang chủ", slug: "/" },
      { name: "FLASH DEAL", slug: "/guest/products" },
    ],
  },
  { name: "SALE 25.12", slug: "/guest/products" },
  {
    name: "GIỚI THIỆU",
    slug: "/guest/introduce",
    children: [
      { name: "Giới thiệu", slug: "/guest/introduce" },
      { name: "Giới thiệu Sản phẩm Uni Coffee", slug: "/guest/introduce" },
    ],
  },
  { name: "TIN TỨC", slug: "/guest/news" },
];

// const featuredProducts = flashSaleProducts.slice(0, 2);

const ProductPage = () => {
  const dispatch = useDispatch();
  const { chosenCategoryId } = useSelector(
      (state: RootState) => state.modal
    );
  const { getPublicProductMenu } = useProductMenu();
  const {
    data: menuData,
    isLoading: IsMenuLoading,
    isError,
    error,
  } = getPublicProductMenu((chosenCategoryId) ? { categoryId: chosenCategoryId } : {});

  if (isError && error) {
    handleApiError(error);
  }

  if(menuData?.data.data === null){
    return (
      <EndUserLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-foreground/70">
            <h2 className="text-2xl font-semibold mb-4">Không có sản phẩm nào</h2>
            <p>Hiện tại không có sản phẩm nào trong danh mục này. Vui lòng quay lại sau hoặc chọn danh mục khác.</p>
          </div>
        </div>
      </EndUserLayout>
    );
  }

  const categoriesTree = menuData?.data.data.productCategoriesTree || [];
  const products = menuData?.data.data.products;
  // const totalProducts = menuData?.data.data.totalProducts || 0;

  if(categoriesTree && categoriesTree.length === 0 && products && products.length === 0){
    return (
      <EndUserLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-foreground/70">
            <h2 className="text-2xl font-semibold mb-4">Không có sản phẩm nào</h2>
            <p>Hiện tại không có sản phẩm nào trong danh mục này. Vui lòng quay lại sau hoặc chọn danh mục khác.</p>
          </div>
        </div>
      </EndUserLayout>
    );
  }
  const handleCategorySelect = (categoryId) => {
    dispatch(handleSetChosenCategoryId(categoryId));
  };
  return (
    <EndUserLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wide">
                Danh mục
              </h3>
              <div className="space-y-1">
                {categoriesTree.map((category) => (
                  <CategoryTreeItem
                    key={category.id}
                    category={category}
                    selectedId={chosenCategoryId}
                    onSelect={handleCategorySelect}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-8 mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="fill-accent text-accent" size={32} />
                <h1 className="text-3xl md:text-4xl font-bold">FLASH SALE</h1>
                <Zap className="fill-accent text-accent" size={32} />
              </div>
              <p className="text-primary-foreground/80">
                Chính hãng 100% - Ưu đãi có hạn
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EndUserLayout>
  );
};
export default ProductPage;
