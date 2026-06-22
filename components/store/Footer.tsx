"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Instagram, Send, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-white border-t border-rose-100 mt-auto">
      {/* Upper Newsletter Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-rose-50/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#8B1A4A]">Stay Connected</h3>
            <p className="text-gray-500 text-sm mt-1.5 font-medium">
              Get updates on our new arrivals, handcrafted collections, and exclusive offers!
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md md:ml-auto w-full">
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-rose-200 focus:outline-none focus:ring-1 focus:ring-[#8B1A4A] bg-[#FFF5F8] text-sm text-gray-800 placeholder-gray-400 font-medium"
            />
            <Button type="submit" className="bg-[#8B1A4A] hover:bg-[#72123b] text-white px-5 rounded-lg flex gap-1.5 items-center font-semibold transition-all">
              {subscribed ? "Subscribed!" : (
                <>
                  Subscribe <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FFF5F8] flex items-center justify-center border border-rose-200">
              <span className="text-base">🌸</span>
            </div>
            <span className="font-serif text-xl font-bold tracking-wide text-[#8B1A4A]">
              Shaisha Arts
            </span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed font-medium">
            Handcrafted with love, passion, and creativity. We bring you unique custom accessories, anti-tarnish jewelry, macrame designs, and personalized gift hampers to make every occasion memorable.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-lg font-bold text-gray-800 border-b border-rose-100 pb-1.5">
            Quick Links
          </h4>
          <ul className="grid grid-cols-1 gap-2 text-sm font-semibold text-gray-600">
            <li>
              <Link href="/about" className="hover:text-[#8B1A4A] transition-colors">About Us</Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-[#8B1A4A] transition-colors">Products</Link>
            </li>
            <li>
              <Link href="/custom-order" className="hover:text-[#8B1A4A] transition-colors">Custom Orders</Link>
            </li>
            <li>
              <Link href="/track-order" className="hover:text-[#8B1A4A] transition-colors">Track Order</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#8B1A4A] transition-colors">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-lg font-bold text-gray-800 border-b border-rose-100 pb-1.5">
            Follow Us
          </h4>
          <p className="text-gray-500 text-sm font-medium">
            Join our craft community on Instagram for behind-the-scenes and process videos!
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/shaisha_arts"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-full transition-all shadow-sm hover:scale-105"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/message/CEM5UYC3ORSYJ1"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-50 text-emerald-500 hover:bg-emerald-100 rounded-full transition-all shadow-sm hover:scale-105"
            >
              {/* WhatsApp Icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.202-1.362a9.923 9.923 0 004.81 1.233h.005c5.505 0 9.99-4.477 9.99-9.983A9.996 9.996 0 0012.012 2zm0 18.294a8.272 8.272 0 01-4.225-1.157l-.303-.18-3.137.82.835-3.057-.197-.313a8.283 8.283 0 01-1.272-4.453c.001-4.57 3.719-8.286 8.297-8.286A8.258 8.258 0 0120.3 12.015c-.001 4.571-3.719 8.279-8.288 8.279z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-lg font-bold text-gray-800 border-b border-rose-100 pb-1.5">
            Reach Us
          </h4>
          <ul className="flex flex-col gap-3 text-sm font-semibold text-gray-600">
            <li className="flex gap-2.5 items-center">
              <Phone className="w-4 h-4 text-[#8B1A4A] shrink-0" />
              <span>+91 9897015075</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Mail className="w-4 h-4 text-[#8B1A4A] shrink-0" />
              <span>shaishaarts@gmail.com</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <MapPin className="w-4 h-4 text-[#8B1A4A] shrink-0 mt-0.5" />
              <span className="font-medium text-gray-500">Dadri, Uttar Pradesh, India</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="w-full bg-[#FFF5F8] border-t border-rose-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-rose-600 font-semibold select-none">
          <span>&copy; {new Date().getFullYear()} Shaisha Arts. All Rights Reserved.</span>
          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <span className="text-rose-500 text-sm animate-pulse">❤️</span>
            <span>by Shaisha Arts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
