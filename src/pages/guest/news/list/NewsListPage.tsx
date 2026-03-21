import { handleApiError } from "@/lib/error";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { PostCard, PostCardSkeleton } from "./components/PostCard";
import { useQueryParams } from "@/hooks/use-query-params";
import { usePost } from "@/hooks/use-post";

const PublicPostListPage = () => {
  const { pageSize, sortBy, isAsc } = useQueryParams({
    defaultSortBy: "createdDate",
  });

  const {getInfinitePublicPosts} = usePost()
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = getInfinitePublicPosts({
    size: pageSize,
    sortBy,
    isAsc,
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError && error) handleApiError(error);

  const allPosts =
    data?.pages.flatMap((page) => page?.data?.data?.items ?? []) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-8 text-center uppercase tracking-wide">
        Tin tức
      </h1>

      <div className="space-y-8">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <PostCardSkeleton key={i} />)}

        {isError && !isLoading && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              Không thể tải danh sách bài đăng. Vui lòng thử lại sau.
            </p>
          </div>
        )}

        {/* Overlay khi refetch (filter/sort thay đổi) */}
        <div className="relative">
          {isFetching && !isFetchingNextPage && !isLoading && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-start justify-center pt-16 rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {!isLoading &&
            allPosts.map((post) => <PostCard key={post.id} post={post} />)}

          {!isLoading && !isError && allPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Chưa có bài đăng nào.</p>
            </div>
          )}
        </div>

        {isFetchingNextPage && (
          <div className="flex justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!hasNextPage && !isLoading && allPosts.length > 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            Bạn đã xem hết tất cả bài đăng.
          </p>
        )}
      </div>

      {/* Sentinel cho IntersectionObserver */}
      <div ref={observerTarget} className="h-1" />
    </div>
  );
};

export default PublicPostListPage;