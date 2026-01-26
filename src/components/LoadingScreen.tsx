import { LoaderCircle } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="relative w-full min-h-[200px]">
      <div className="fixed top-0 left-0 z-50 h-1 w-full overflow-hidden bg-muted">
        <div className="h-full bg-primary animate-progress-bar" />
      </div>
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
      </div>
    </div>
  );
};

export default LoadingScreen;

export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-4">
    <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
    <p className="text-sm text-muted-foreground">Đang tải...</p>
  </div>
);