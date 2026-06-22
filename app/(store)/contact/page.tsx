import React from "react";
import { Phone, Instagram, MessageCircle, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="w-full bg-[#FFF5F8]">
      {/* Hero */}
      <section className="py-16 bg-white border-b border-rose-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mt-4">
            Contact Us
          </h1>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            We&apos;d love to hear from you! Reach out for orders, custom requests, or any
            questions.
          </p>
          <div className="w-16 h-0.5 bg-rose-200 mx-auto mt-6"></div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* WhatsApp */}
          <a
            href="https://wa.me/message/CEM5UYC3ORSYJ1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-rose-100 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-gray-800 text-lg mb-1">WhatsApp</h3>
            <p className="text-sm text-gray-500 mb-3">Chat with us for quick replies</p>
            <span className="text-emerald-600 font-bold">9897015075</span>
          </a>

          {/* Phone */}
          <a
            href="tel:9897015075"
            className="bg-white rounded-2xl border border-rose-100 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-4 bg-rose-50 rounded-full text-[#8B1A4A] mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-gray-800 text-lg mb-1">Call Us</h3>
            <p className="text-sm text-gray-500 mb-3">Mon – Sat, 10 AM – 7 PM</p>
            <span className="text-[#8B1A4A] font-bold">9897015075</span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/shaisha_arts"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-rose-100 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-4 bg-purple-50 rounded-full text-purple-600 mb-4 group-hover:scale-110 transition-transform">
              <Instagram className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-gray-800 text-lg mb-1">Instagram</h3>
            <p className="text-sm text-gray-500 mb-3">Follow us for updates & inspiration</p>
            <span className="text-purple-600 font-bold">@shaisha_arts</span>
          </a>
        </div>

        {/* Location Note */}
        <div className="mt-12 bg-white rounded-2xl border border-rose-100 p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
          <div className="p-4 bg-rose-50 rounded-full text-[#8B1A4A] shrink-0">
            <MapPin className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-gray-800 text-lg mb-1">
              Pan India Shipping
            </h3>
            <p className="text-gray-500 text-sm">
              We ship across all of India. Orders are carefully packed and dispatched within 2–4
              business days. For bulk or urgent orders, please contact us directly via WhatsApp.
            </p>
          </div>
        </div>

        {/* Quick Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            For custom orders or bulk inquiries, please use our{" "}
            <a href="/custom-order" className="text-[#8B1A4A] font-bold hover:underline">
              Custom Order form
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
