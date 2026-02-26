import { useContext } from "react";
import { CartContext } from "@/app/contexts/CartContext";

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
