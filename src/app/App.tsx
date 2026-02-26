import { RouterProvider } from "react-router";
import { Toaster } from "@/app/components/ui/sonner";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { LanguageProvider } from "@/app/contexts/LanguageContext";
import { CartProvider } from "@/app/contexts/CartContext";
import { ErrorBoundary } from "@/app/components/ui/ErrorBoundary";
import { router } from "@/app/routes.tsx";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}