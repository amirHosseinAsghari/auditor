import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import { store } from "./store/store";
import "./index.css";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster position="bottom-right" richColors />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
