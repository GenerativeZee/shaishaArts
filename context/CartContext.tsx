"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, getCartFromStorage, saveCartToStorage, getCartTotal, getCartCount } from "@/lib/cart";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from storage on mount
  useEffect(() => {
    setItems(getCartFromStorage());
    setIsLoaded(true);
  }, []);

  // Sync cart with storage when it changes
  const updateItems = (newItems: CartItem[]) => {
    setItems(newItems);
    saveCartToStorage(newItems);
  };

  const addToCart = (product: Omit<CartItem, "qty">, qty = 1) => {
    const existing = items.find((i) => i.productId === product.productId);
    if (existing) {
      updateItems(
        items.map((i) =>
          i.productId === product.productId
            ? { ...i, qty: i.qty + qty }
            : i
        )
      );
    } else {
      updateItems([...items, { ...product, qty }]);
    }
  };

  const removeFromCart = (productId: string) => {
    updateItems(items.filter((i) => i.productId !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    updateItems(
      items.map((i) => (i.productId === productId ? { ...i, qty } : i))
    );
  };

  const clearCart = () => {
    updateItems([]);
  };

  const cartCount = getCartCount(items);
  const cartTotal = getCartTotal(items);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
