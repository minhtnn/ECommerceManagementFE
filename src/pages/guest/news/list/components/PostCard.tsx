import { formatDateTimeInShort } from "@/lib/utils";
import { PATH_GUEST } from "@/routes/path";
import { TPublicPostItem } from "@/schemas/post.schema";
import { ImageOff } from "lucide-react";
import { Link } from "react-router-dom";

export const PostCardSkeleton = () => (
  <div className="group border-b border-border pb-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="aspect-video md:aspect-[4/3] rounded-lg bg-muted" />
      </div>
      <div className="md:col-span-2 space-y-3 py-1">
        <div className="h-3.5 w-32 rounded bg-muted" />
        <div className="h-5 w-4/5 rounded bg-muted" />
        <div className="h-5 w-2/3 rounded bg-muted" />
        <div className="space-y-2 mt-2">
          <div className="h-3.5 w-full rounded bg-muted" />
          <div className="h-3.5 w-11/12 rounded bg-muted" />
          <div className="h-3.5 w-3/4 rounded bg-muted" />
        </div>
        <div className="h-4 w-20 rounded bg-muted mt-4" />
      </div>
    </div>
  </div>
);

interface PostCardProps {
  post: TPublicPostItem;
}

export const PostCard = ({ post }: PostCardProps) => (
  <article className="group border-b border-border pb-8 last:border-0">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link
        to={PATH_GUEST.news.detail(post.id)}
        className="block md:col-span-1"
      >
        <div className="aspect-video md:aspect-[16/9] rounded-lg overflow-hidden bg-muted">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-8 h-8 text-muted-foreground/40" />
            </div>
          )}
        </div>
      </Link>

      <div className="md:col-span-2">
        {/* Meta — giống NewsListPage */}
        <div className="text-sm text-muted-foreground mb-2">
          {post.publishedAt && (
            <span>{formatDateTimeInShort(post.publishedAt)}</span>
          )}
          {post.publishedAt && post.author && <span className="mx-2">-</span>}
          {post.author && <span>{post.author}</span>}
        </div>

        <Link to={PATH_GUEST.news.detail(post.id)}>
          <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt — điểm khác biệt lớn nhất */}
        {post.excerpt && (
          <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <Link
          to={PATH_GUEST.news.detail(post.id)}
          className="inline-block text-foreground font-medium hover:text-primary transition-colors border-b border-foreground hover:border-primary pb-0.5"
        >
          Xem thêm
        </Link>
      </div>
    </div>
  </article>
);
