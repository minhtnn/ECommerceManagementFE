import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { usePost } from "@/hooks/use-post";
import EndUserLayout from "@/layouts/EndUserLayout";
import { formatDateTimeInShort } from "@/lib/utils";
import { PATH_GUEST } from "@/routes/path";
import { Calendar, ChevronLeft, Clock, ImageOff, User } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const estimateReadingTime = (text?: string | null) => {
  if (!text) return 1;
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));
};

// ── Skeleton ─────────────────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="space-y-3">
      <div className="h-7 w-3/4 rounded bg-muted" />
      <div className="h-7 w-1/2 rounded bg-muted" />
      <div className="h-4 w-40 rounded bg-muted" />
    </div>
    <div className="aspect-video rounded-lg bg-muted" />
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`h-4 rounded bg-muted ${i % 4 === 3 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  </div>
);

// ── Related post sidebar card ────────────────────────────────────
interface SidebarCardProps {
  id: string;
  title: string;
  imageUrl?: string | null;
}
const SidebarCard = ({ id, title, imageUrl }: SidebarCardProps) => (
  <Link to={PATH_GUEST.news.detail(id)} className="flex gap-3 group">
    <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      ) : (
        <ImageOff className="w-4 h-4 text-muted-foreground/40" />
      )}
    </div>
    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
      {title}
    </p>
  </Link>
);

// ── Page ─────────────────────────────────────────────────────────
const PublicPostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { setBreadcrumbs, setShowBreadcrumb } = useBreadcrumb();

  const { getPublicPostById, getInfinitePosts } = usePost();
  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = getPublicPostById(id ?? "");
  const { data: listData, isLoading: isSidebarLoading } = getInfinitePosts(6);

  const post = postData?.data?.data;
  const sidebarPosts =
    listData?.pages
      .flatMap((p) => p?.data?.data?.items ?? [])
      .filter((p) => p.id !== id)
      .slice(0, 4) ?? [];

  useEffect(() => {
    if (post) {
      setBreadcrumbs([
        { title: "Tin tức", url: PATH_GUEST.news.root },
        { title: post.title },
      ]);
      setShowBreadcrumb(true);
    }
    return () => setShowBreadcrumb(false);
  }, [post, setBreadcrumbs, setShowBreadcrumb]);

  // ── Error / not found ────────────────────────────────────────

  return (
    <EndUserLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-4">
              <h3 className="font-bold text-foreground mb-4 uppercase tracking-wide text-sm">
                Bài đăng khác
              </h3>
              <div className="space-y-4">
                {/* Skeleton chỉ hiện khi đang loading */}
                {isSidebarLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-12 rounded bg-muted flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 rounded bg-muted w-full" />
                        <div className="h-3 rounded bg-muted w-3/4" />
                      </div>
                    </div>
                  ))}

                {/* Load xong, có bài */}
                {!isSidebarLoading &&
                  sidebarPosts.map((p) => (
                    <SidebarCard
                      key={p.id}
                      id={p.id}
                      title={p.title}
                      imageUrl={p.imageUrl}
                    />
                  ))}

                {/* Load xong, không có bài nào khác */}
                {!isSidebarLoading && sidebarPosts.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Chưa có bài đăng khác.
                  </p>
                )}
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            {isLoading ? (
              <DetailSkeleton />
            ) : post ? (
              <>
                {/* Header */}
                <header className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                    {post.author && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateTimeInShort(post.publishedAt)}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {estimateReadingTime(post.content)} phút đọc
                    </span>
                  </div>
                </header>

                {/* Featured image */}
                <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-8 flex items-center justify-center">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                      <ImageOff className="w-12 h-12" />
                      <span className="text-sm">Chưa có ảnh bìa</span>
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                {post.excerpt && (
                  <div className="mb-6 pl-4 border-l-2 border-primary/40">
                    <p className="text-muted-foreground leading-relaxed italic">
                      {post.excerpt}
                    </p>
                  </div>
                )}

                {/* Content */}
                {post.content ? (
                  <article
                    className="prose prose-lg max-w-none text-foreground
                                            prose-headings:text-foreground prose-headings:font-bold
                                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                                            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                                            prose-strong:text-foreground
                                            prose-em:text-primary
                                            prose-ul:text-muted-foreground prose-ul:my-4
                                            prose-li:my-1"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <p className="text-muted-foreground italic">
                    Bài đăng này chưa có nội dung.
                  </p>
                )}

                {/* Back navigation */}
                <div className="mt-12 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Bạn đang xem:</span>{" "}
                      <span className="text-foreground">{post.title}</span>
                    </div>
                    <Link
                      to={PATH_GUEST.news.root}
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Tất cả bài đăng
                    </Link>
                  </div>
                </div>
              </>
            ) : !isLoading && !post ? (
              <div className="text-center py-16">
                <h2 className="text-xl font-bold text-foreground mb-3">
                  Không tìm thấy bài viết
                </h2>
                <Link
                  to={PATH_GUEST.news.root}
                  className="inline-flex items-center gap-2 text-primary hover:underline mt-4"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Quay lại trang tin tức
                </Link>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </EndUserLayout>
  );
};

export default PublicPostDetailPage;
