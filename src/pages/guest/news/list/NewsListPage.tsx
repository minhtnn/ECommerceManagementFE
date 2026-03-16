import { usePost } from "@/hooks/use-post";
import EndUserLayout from "@/layouts/EndUserLayout";

import { useCallback, useEffect, useRef } from "react";
import { PostCard, PostCardSkeleton } from "./components/PostCard";
import { Loader2 } from "lucide-react";

// Adjust to your actual route param name
const PAGE_SIZE = 10;

const PublicPostListPage = () => {
  const { getInfinitePosts } = usePost();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = getInfinitePosts(PAGE_SIZE);

  // Intersection Observer sentinel for auto-loading
  const sentinelRef = useRef<HTMLDivElement>(null);
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const allPosts =
    data?.pages.flatMap((page) => page?.data?.data?.items ?? []) ?? [];

  return (
    <EndUserLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8 text-center uppercase tracking-wide">
          Tin tức
        </h1>

        <div className="space-y-8">
          {/* Initial skeleton */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}

          {/* Error state */}
          {isError && !isLoading && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Không thể tải danh sách bài đăng. Vui lòng thử lại sau.
              </p>
            </div>
          )}

          {/* Post list */}
          {!isLoading &&
            allPosts.map((post) => <PostCard key={post.id} post={post} />)}

          {/* Empty state */}
          {!isLoading && !isError && allPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Chưa có bài đăng nào.</p>
            </div>
          )}

          {/* Loading more indicator */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* End of list */}
          {!hasNextPage && !isLoading && allPosts.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Bạn đã xem hết tất cả bài đăng.
            </p>
          )}
        </div>

        {/* Invisible sentinel for IntersectionObserver */}
        <div ref={sentinelRef} className="h-1" />
      </div>
    </EndUserLayout>
  );
};

export default PublicPostListPage;
