import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingCart, MessageCircle, Heart, Award, Gift, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ProductCard from "@/components/store/ProductCard";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: { select: { name: true; slug: true } } };
}>;

export default async function HomePage() {
  let featuredProducts: ProductWithCategory[] = [];
  let bestSellers: ProductWithCategory[] = [];
  try {
    featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      take: 4,
    });

    bestSellers = await prisma.product.findMany({
      where: { isBestseller: true, isActive: true },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      take: 4,
    });
  } catch (error) {
    console.error("Home page DB fetch error:", error);
  }

  const collections = [
    { name: "Phone Charms", slug: "charms", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500" },
    { name: "Bag Charms", slug: "charms", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500" },
    { name: "Keychains", slug: "keychains", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500" },
    { name: "Scrunchies", slug: "accessories", image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=500" },
    { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500" },
    { name: "Stationery", slug: "stationery", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500" },
    { name: "Jewelry", slug: "jewelry", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500" },
    { name: "Hampers", slug: "hampers", image: "https://images.unsplash.com/photo-1549465220-1a8b9238f519?w=500" },
  ];

  return (
    <div className="w-full bg-[#FFF5F8]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-rose-100/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-rose-50/30 to-[#FFF5F8]">
        {/* Floating Heart Ornaments */}
        <div className="absolute top-10 left-10 text-rose-300/40 text-2xl animate-bounce">❤️</div>
        <div className="absolute bottom-16 right-12 text-rose-300/40 text-xl animate-pulse">🌸</div>
        <div className="absolute top-20 right-[25%] text-rose-300/30 text-lg animate-pulse">✨</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Box */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-rose-500 bg-rose-100/60 px-3.5 py-1.5 rounded-full mb-6 inline-block shadow-sm">
              Handcrafted Gifts
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Made With Love, <br />
              <span className="text-[#8B1A4A] inline-block mt-1.5">Just For You</span>
            </h1>
            <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-lg font-medium leading-relaxed">
              Unique, elegant, and handmade creations to make every moment special. Explore our collections and add a personalized touch to your gifting.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/shop"
                className="bg-[#8B1A4A] hover:bg-[#72123b] text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                SHOP NOW <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/message/CEM5UYC3ORSYJ1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-emerald-50 text-[#8B1A4A] border border-rose-200 hover:border-emerald-300 px-8 py-3.5 rounded-full font-bold shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5 text-emerald-500 fill-current" />
                ORDER ON WHATSAPP
              </a>
            </div>
          </div>

          {/* Right Product Gallery Collage */}
          <div className="relative flex justify-center items-center">
            {/* Soft pink backdrop frame */}
            <div className="absolute w-[80%] aspect-square bg-rose-200/30 rounded-full blur-3xl -z-10"></div>
            
            {/* Collage layouts matching reference */}
            <div className="grid grid-cols-12 gap-4 w-full max-w-[500px]">
              <div className="col-span-8 overflow-hidden rounded-2xl border-4 border-white shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-300 aspect-[4/3] bg-rose-50">
                <img
                  src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500"
                  alt="Handmade Macrame Decor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-4 overflow-hidden rounded-2xl border-4 border-white shadow-xl rotate-[4deg] hover:rotate-0 transition-transform duration-300 aspect-square mt-6 bg-rose-50">
                <img
                  src="https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=500"
                  alt="Scrunchies Accessories"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-4 overflow-hidden rounded-2xl border-4 border-white shadow-xl rotate-[-4deg] hover:rotate-0 transition-transform duration-300 aspect-square bg-rose-50">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500"
                  alt="Premium Anti-Tarnish Jewelry"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-8 overflow-hidden rounded-2xl border-4 border-white shadow-xl rotate-[2deg] hover:rotate-0 transition-transform duration-300 aspect-[4/3] bg-rose-50">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238f519?w=500"
                  alt="Custom Hampers Box"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR COLLECTION CATEGORIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-1.5 text-rose-500 font-bold text-sm">
            <span>🌸</span> OUR COLLECTION <span>🌸</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
            Handpicked Favorites Just For You
          </h2>
          <div className="w-16 h-0.5 bg-rose-200 mx-auto mt-4"></div>
        </div>

        {/* Categories Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {collections.map((col, idx) => (
            <Link
              key={idx}
              href={`/category/${col.slug}`}
              className="group bg-white rounded-2xl border border-rose-100 p-3 text-center shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-rose-50/30">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="font-serif font-bold text-gray-800 text-sm mt-3.5 group-hover:text-[#8B1A4A]">
                {col.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (IF AVAILABLE) */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white border-y border-rose-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs uppercase font-extrabold text-rose-500 tracking-wider">Top Selections</span>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mt-2">Featured Products</h2>
              </div>
              <Link href="/shop" className="text-sm font-bold text-[#8B1A4A] hover:underline flex gap-1 items-center">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. USP FEATURES ROW */}
      <section className="bg-rose-50/50 py-12 border-b border-rose-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-rose-100/60 rounded-full text-[#8B1A4A] mb-4">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <h4 className="font-serif font-bold text-gray-800 text-sm">Handmade With Love</h4>
            <p className="text-xs text-gray-500 font-medium mt-1">Every piece is crafted with utmost care</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-rose-100/60 rounded-full text-[#8B1A4A] mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-gray-800 text-sm">Premium Quality</h4>
            <p className="text-xs text-gray-500 font-medium mt-1">We use the best quality materials</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-rose-100/60 rounded-full text-[#8B1A4A] mb-4">
              <Gift className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-gray-800 text-sm">Perfect For Gifting</h4>
            <p className="text-xs text-gray-500 font-medium mt-1">Unique designs for every occasion</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-rose-100/60 rounded-full text-[#8B1A4A] mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-gray-800 text-sm">Pan India Shipping</h4>
            <p className="text-xs text-gray-500 font-medium mt-1">Safe and fast delivery across India</p>
          </div>
        </div>
      </section>

      {/* 5. ABOUT SHAISHA ARTS SNIPPET */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Handcrafted Image */}
        <div className="relative rounded-3xl overflow-hidden border-8 border-white shadow-xl rotate-[-2deg] aspect-[4/3] max-w-[500px] mx-auto bg-rose-50">
          <img
            src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600"
            alt="Handmade Art Creation Heart"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-white/95 px-4 py-2 rounded-xl border border-rose-100 text-xs font-bold text-[#8B1A4A] shadow-sm">
            🌸 made with love
          </div>
        </div>

        {/* Right About Text */}
        <div className="flex flex-col items-start text-left">
          <div className="flex items-center gap-1 text-rose-500 font-bold text-sm">
            <span>🌸</span> ABOUT SHAISHA ARTS <span>🌸</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 mt-3 leading-tight">
            Creativity, Passion, and Lots of Love
          </h2>
          <div className="w-12 h-0.5 bg-rose-200 mt-4 mb-6"></div>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
            Shaisha Arts is a small business built on creativity, passion, and lots of love. We create beautiful, handcrafted accessories, macrame decorations, custom hampers, and gifts that add a personal, unique touch to your special moments.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-medium mt-4">
            Every piece is carefully handmade, ensuring the best quality materials and craftsmanship. Thank you for supporting our dream and shopping small!
          </p>
          <Link
            href="/about"
            className="mt-8 bg-[#8B1A4A] hover:bg-[#72123b] text-white px-7 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
          >
            KNOW MORE ABOUT US
          </Link>
        </div>
      </section>

      {/* 6. BEST SELLERS GRID */}
      {bestSellers.length > 0 && (
        <section className="py-20 bg-rose-50/20 border-t border-rose-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs uppercase font-extrabold text-rose-500 tracking-wider">Top Favorites</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 mt-2">Our Bestsellers</h2>
              <div className="w-12 h-0.5 bg-rose-200 mx-auto mt-4"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {bestSellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. INSTAGRAM FEED BLOCK */}
      <section className="py-16 bg-white border-t border-rose-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase font-extrabold text-rose-500 tracking-widest">Follow us on Instagram</span>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mt-2">@shaisha_arts</h2>
          <div className="w-10 h-0.5 bg-rose-200 mx-auto mt-3 mb-10"></div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <a
              href="https://www.instagram.com/shaisha_arts"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square rounded-2xl overflow-hidden border border-rose-50 shadow-sm relative group bg-rose-100"
            >
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500"
                alt="Instagram post anti tarnish"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                View Post 📸
              </div>
            </a>
            <a
              href="https://www.instagram.com/shaisha_arts"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square rounded-2xl overflow-hidden border border-rose-50 shadow-sm relative group bg-rose-100"
            >
              <img
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500"
                alt="Instagram post bracelets"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                View Post 📸
              </div>
            </a>
            <a
              href="https://www.instagram.com/shaisha_arts"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square rounded-2xl overflow-hidden border border-rose-50 shadow-sm relative group bg-rose-100"
            >
              <img
                src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500"
                alt="Instagram post macrame"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                View Post 📸
              </div>
            </a>
            <a
              href="https://www.instagram.com/shaisha_arts"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square rounded-2xl overflow-hidden border border-rose-50 shadow-sm relative group bg-rose-100"
            >
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238f519?w=500"
                alt="Instagram post gift hampers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                View Post 📸
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
