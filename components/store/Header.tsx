"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronDown, Instagram, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function Header() {
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { name: "Anti-Tarnish Jewelry", slug: "anti-tarnish" },
    { name: "Phone/Bag Charms", slug: "charms" },
    { name: "Keychains", slug: "keychains" },
    { name: "Macrame Items", slug: "macrame" },
    { name: "Accessories", slug: "accessories" },
    { name: "Stationery", slug: "stationery" },
    { name: "Gift Hampers", slug: "hampers" },
  ];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Custom Orders", href: "/custom-order" },
    { name: "Track Order", href: "/track-order" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-rose-100">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#8B1A4A] text-white text-xs py-2 px-4 flex flex-col sm:flex-row justify-between items-center gap-1 font-medium select-none">
        <div className="flex items-center gap-1.5 animate-pulse">
          <span>🌸</span> Welcome to Shaisha Arts - Handcrafted with love, just for you!
        </div>
        <div className="flex items-center gap-3">
          <span>🇮🇳 Pan India Shipping</span>
          <span className="hidden sm:inline">|</span>
          <span>💖 Made With Love</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-full border border-rose-200 bg-[#FFF5F8] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
            {/* Simple Wreath/Flower Logo Mockup */}
            <span className="text-xl">🌸</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-wide text-[#8B1A4A] leading-none">
              Shaisha
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-rose-500 font-bold leading-none mt-1">
              Arts
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-all hover:text-[#8B1A4A] relative py-1 ${
                  isActive
                    ? "text-[#8B1A4A] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#8B1A4A]"
                    : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Categories Dropdown */}
          <div className="relative group/menu py-4">
            <button className="flex items-center gap-1 text-sm font-semibold text-gray-600 group-hover/menu:text-[#8B1A4A] transition-colors">
              Categories <ChevronDown className="w-4 h-4 transition-transform group-hover/menu:rotate-180" />
            </button>
            <div className="absolute top-14 left-1/2 -translate-x-1/2 w-56 bg-white border border-rose-100 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 transform group-hover/menu:translate-y-2 z-50">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-[#8B1A4A] font-medium"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/shaisha_arts"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
            title="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>

          {/* WhatsApp Quick Link */}
          <a
            href="https://wa.me/919897015075"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:text-emerald-500 hover:bg-emerald-50 rounded-full transition-colors"
            title="Chat on WhatsApp"
          >
            <Phone className="w-5 h-5" />
          </a>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2.5 text-[#8B1A4A] hover:bg-rose-50 rounded-full transition-colors group"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5.5 h-5.5 group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#8B1A4A] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Hamburguer Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="lg:hidden p-2 text-gray-600 hover:bg-rose-50 rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-rose-100 bg-[#FFF5F8]">
              <SheetTitle className="text-left font-serif text-xl text-[#8B1A4A] border-b border-rose-100 pb-4">
                🌸 Shaisha Arts
              </SheetTitle>
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase font-bold tracking-widest text-rose-400">Navigation</span>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-base font-semibold py-1.5 transition-colors hover:text-[#8B1A4A] ${
                        pathname === link.href ? "text-[#8B1A4A]" : "text-gray-700"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-rose-100 pt-4">
                  <span className="text-xs uppercase font-bold tracking-widest text-rose-400">Shop Categories</span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-gray-600 hover:text-[#8B1A4A]"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 border-t border-rose-100 pt-6 justify-center">
                  <a
                    href="https://www.instagram.com/shaisha_arts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white hover:bg-rose-50 rounded-full shadow-sm text-rose-500 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://wa.me/919897015075"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white hover:bg-emerald-50 rounded-full shadow-sm text-emerald-500 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
