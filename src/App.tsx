import { BrowserRouter } from "react-router-dom";
import AppProvider from "./providers/app-provider";
import { AppRoutes } from "./routes/routes";
import { BreadcrumbProvider } from "./contexts/BreadcrumbContext";

function App() {
  return (
    // <SignalRProvider>
    <BreadcrumbProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </BreadcrumbProvider>

    // </SignalRProvider>
  );
}

export default App;
