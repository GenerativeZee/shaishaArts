import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shaisha Arts | Handcrafted Gifts & Anti-Tarnish Jewelry",
  description:
    "Explore Shaisha Arts for exquisite anti-tarnish jewelry, handcrafted macrame car hangings, keychains, phone charms, and curated gift hampers made with love.",
  keywords: [
    "handmade jewelry",
    "anti-tarnish necklace",
    "macrame car hanging",
    "custom keychains",
    "gift hampers",
    "handcrafted gifts india",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-background font-sans antialiased text-foreground flex flex-col">
        <CartProvider>
          <WishlistProvider>
            {children}
            <Toaster position="top-center" richColors />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
