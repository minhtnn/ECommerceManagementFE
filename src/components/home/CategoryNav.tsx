import { Link } from "react-router-dom";
import { categories } from "@/data/mockData";

const CategoryNav = () => {
  return (
    <div className="bg-cream border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/collections/${category.slug}`}
              className="text-primary hover:text-primary/80 font-medium text-sm md:text-base transition-colors whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
