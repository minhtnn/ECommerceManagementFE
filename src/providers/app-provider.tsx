import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FontProvider from "./font-provider";
import { ThemeProvider } from "./theme-provider";
import ReduxProvider from "./redux-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider from "./auth-provider";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: Props) => {
  return (
    <FontProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider>
            <AuthProvider>{children}</AuthProvider>
            <Toaster
              visibleToasts={1}
              position="top-right"
              toastOptions={{
                classNames: {
                  success:
                    "!bg-green-0 !border !border-green-200 !text-green-600",
                  error: "!bg-red-0 !border !border-red-200 !text-red-600",
                  info: "!bg-blue-0 !border !border-blue-200 !text-blue-600",
                  warning:
                    "!bg-yellow-0 !border !border-yellow-200 !text-yellow-600",
                },
              }}
            />
          </ReduxProvider>
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </ThemeProvider>
    </FontProvider>
  );
};

export default AppProvider;
