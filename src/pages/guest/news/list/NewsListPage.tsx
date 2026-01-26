import EndUserLayout from "@/layouts/EndUserLayout";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { newsArticles } from "@/data/newsData";

const NewsListPage = () => {
  // Only show active news articles
  const activeNews = newsArticles.filter((article) => article.status === "active");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <EndUserLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8 text-center">
          TIN TỨC
        </h1>

        <div className="space-y-8">
          {activeNews.map((article) => (
            <article key={article.id} className="group border-b border-border pb-8 last:border-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Article Image */}
                <Link to={`/guest/news/${article.slug}`} className="block md:col-span-1">
                  <div className="aspect-video md:aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>

                {/* Article Content */}
                <div className="md:col-span-2">
                  {/* Article Meta */}
                  <div className="text-sm text-muted-foreground mb-2">
                    <span>{formatDate(article.publishDate)}</span>
                    <span className="mx-2">-</span>
                    <span>Uni Coffee Roastery</span>
                  </div>

                  {/* Article Title */}
                  <Link to={`/guest/news/${article.slug}`}>
                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h2>
                  </Link>

                  {/* Article Excerpt */}
                  <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Read More Link */}
                  <Link
                    to={`/guest/news/${article.slug}`}
                    className="inline-block text-foreground font-medium hover:text-primary transition-colors border-b border-foreground hover:border-primary pb-0.5"
                  >
                    Xem thêm
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {activeNews.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Chưa có tin tức nào.</p>
          </div>
        )}
      </div>
    </EndUserLayout>
  );
}
export default NewsListPage;