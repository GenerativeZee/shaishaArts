import React from "react";
import Link from "next/link";
import { Heart, Award, Gift, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FFF5F8]">
      {/* Hero */}
      <section className="py-16 bg-white border-b border-rose-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
            Our Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mt-4">
            About Shaisha Arts
          </h1>
          <div className="w-16 h-0.5 bg-rose-200 mx-auto mt-5"></div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="rounded-3xl overflow-hidden border-8 border-white shadow-2xl aspect-[4/3] bg-rose-50 rotate-[-2deg]">
            <img
              src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=700"
              alt="Handmade Art Creation"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-white px-5 py-3 rounded-2xl border border-rose-100 shadow-lg text-sm font-bold text-[#8B1A4A]">
            🌸 Handmade With Love
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 leading-tight">
            Creativity, Passion, and Lots of Love
          </h2>
          <div className="w-12 h-0.5 bg-rose-200 mt-4 mb-6"></div>
          <p className="text-gray-600 leading-relaxed mb-4">
            Shaisha Arts is a small business built on creativity, passion, and lots of love. We
            create beautiful, handcrafted accessories, macrame decorations, custom hampers, and
            gifts that add a personal, unique touch to your special moments.
          </p>
          <p className="text-gray-500 leading-relaxed mb-4">
            Every piece is carefully handmade, ensuring the best quality materials and
            craftsmanship. We believe in the power of handmade — that a gift made with your own
            hands carries a warmth that no factory-made product can replicate.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Thank you for supporting our dream and shopping small. Your support means the world
            to us and helps us keep doing what we love!
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white border-y border-rose-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-gray-900">What We Stand For</h2>
            <div className="w-12 h-0.5 bg-rose-200 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Made With Love",
                desc: "Every single piece is crafted by hand with care and attention to detail.",
              },
              {
                icon: Award,
                title: "Premium Quality",
                desc: "We use only the finest materials to ensure lasting beauty and durability.",
              },
              {
                icon: Gift,
                title: "Perfect For Gifting",
                desc: "Unique, thoughtful designs that make every occasion extra special.",
              },
              {
                icon: Sparkles,
                title: "Custom Orders",
                desc: "We love creating personalised pieces tailored to your exact vision.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-rose-100 hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-rose-50 rounded-full text-[#8B1A4A] mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Ready to find something beautiful?
          </h2>
          <p className="text-gray-500 mb-8">
            Browse our collections and discover the perfect handmade piece for yourself or as a
            gift.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-[#8B1A4A] hover:bg-[#72123b] text-white px-8 py-3.5 rounded-full font-bold shadow-lg transition-all"
            >
              Shop Now
            </Link>
            <Link
              href="/custom-order"
              className="bg-white hover:bg-rose-50 text-[#8B1A4A] border border-rose-200 px-8 py-3.5 rounded-full font-bold shadow-sm transition-all"
            >
              Custom Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
