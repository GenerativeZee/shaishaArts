"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  LogOut,
  Store,
  MessageSquare,
  Image as ImageIcon,
  Tag,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/inventory", icon: Boxes, label: "Inventory" },
  { href: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
  { href: "/admin/hero-images", icon: ImageIcon, label: "Hero Images" },
  { href: "/admin/offer", icon: Tag, label: "Sitewide Offer" },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isActive
                ? "bg-rose-50 text-[#8B1A4A]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-gray-200 px-4 h-14 shrink-0">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-r border-gray-200 bg-white flex flex-col">
            <SheetTitle className="text-left px-5 pt-5 pb-4 border-b border-gray-100">
              <p className="font-serif font-bold text-[#8B1A4A] text-lg leading-none">Shaisha Arts</p>
              <p className="text-xs text-gray-400 mt-1 font-normal">Admin Panel</p>
            </SheetTitle>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </nav>
            <div className="px-3 pb-5 space-y-1 border-t border-gray-100 pt-4">
              <a
                href="/"
                target="_blank"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50"
              >
                <Store className="w-4 h-4" /> View Store
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </SheetContent>
        </Sheet>
        <p className="font-serif font-bold text-[#8B1A4A] text-base leading-none">Shaisha Arts</p>
        <div className="w-9" />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 bg-white border-r border-gray-200 flex-col min-h-screen sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="font-serif font-bold text-[#8B1A4A] text-lg leading-none">Shaisha Arts</p>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLinks pathname={pathname} />
        </nav>

        <div className="px-3 pb-4 space-y-1 border-t border-gray-100 pt-4">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50"
          >
            <Store className="w-4 h-4" /> View Store
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
