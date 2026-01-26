import { useParams, Link } from "react-router-dom";
import EndUserLayout from "@/layouts/EndUserLayout";
import { ChevronRight, ChevronLeft, Calendar } from "lucide-react";
import { newsArticles } from "@/data/newsData";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";
import { PATH_GUEST } from "@/routes/path";

const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { setBreadcrumbs, setShowBreadcrumb } = useBreadcrumb();

  const article = newsArticles.find(
    (a) => a.slug === slug && a.status === "active"
  );

  // Find previous and next articles for navigation
  const currentIndex = newsArticles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? newsArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < newsArticles.length - 1
      ? newsArticles[currentIndex + 1]
      : null;

  // Get featured news (other active articles)
  const featuredNews = newsArticles
    .filter((a) => a.id !== article?.id && a.status === "active")
    .slice(0, 3);

  useEffect(() => {
    if (article) {
      setBreadcrumbs([
        { title: "Tin tức", url: PATH_GUEST.news.root },
        { title: article.title },
      ]);
      setShowBreadcrumb(true);
    }

    return () => {
      setShowBreadcrumb(false);
    };
  }, [slug, article, setBreadcrumbs, setShowBreadcrumb]);

  if (!article) {
    return (
      <EndUserLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Không tìm thấy bài viết
          </h1>
          <p className="text-muted-foreground mb-8">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            to="/guest/news"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại trang tin tức
          </Link>
        </div>
      </EndUserLayout>
    );
  }

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            {/* Featured News */}
            <div className="sticky top-4">
              <h3 className="font-bold text-foreground mb-4 uppercase">
                Tin nổi bật
              </h3>
              <div className="space-y-4">
                {featuredNews.map((news) => (
                  <Link
                    key={news.id}
                    to={`/guest/news/${news.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {news.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Uni Coffee Roastery</span>
                <span className="mx-1">•</span>
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishDate)}</span>
              </div>
            </header>

            {/* Featured Image */}
            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-8">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <article
              className="prose prose-lg max-w-none text-foreground
                prose-headings:text-foreground prose-headings:font-bold
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-foreground
                prose-em:text-primary
                prose-ul:text-muted-foreground prose-ul:my-4
                prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Article Navigation */}
            <div className="mt-12 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Bạn đang xem:</span>{" "}
                  <span className="text-foreground">{article.title}</span>
                </div>
                {prevArticle && (
                  <Link
                    to={`/guest/news/${prevArticle.slug}`}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Bài trước
                  </Link>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </EndUserLayout>
  );
};
export default NewsDetailPage;
