"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import CommentSection from "@/components/comments/CommentSection";
import { withBasePath } from "@/lib/base-path";
import { getProductById } from "@/lib/products";

export default function ProductPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const product = getProductById(id);

  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderVerileri = [
    { id: 1, gorsel: "/slider1.jpeg" },
    { id: 2, gorsel: "/slider2.jpeg" },
    { id: 3, gorsel: "/slider3.jpeg" },
    { id: 4, gorsel: "/slider4.jpeg" },
    { id: 5, gorsel: "/slider5.jpeg" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderVerileri.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderVerileri.length]);

  if (!product) {
    return (
      <div className="w-full px-4 md:px-12 py-16 text-center">
        <h1 className="text-2xl font-black text-[#00519E]">Ürün bulunamadı</h1>
        <Link href="/" className="inline-block mt-6 text-[#00519E] font-semibold hover:underline">
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F9FA] pb-24 font-sans antialiased overflow-x-clip">
      {/* KAHRAMAN SLIDER (Bölünmüş Tasarım - Sol Yazı, Sağ Görsel) */}
      <div className="w-full px-4 md:px-12 pt-6">
        <div className="w-full rounded-2xl shadow-[0_16px_40px_-12px_rgba(15,54,92,0.45)] overflow-hidden flex flex-col md:flex-row bg-[#0F365C] h-auto md:h-[450px] lg:h-[500px]">

          {/* Sol Taraf: Yazı ve İletişim Bilgileri (İstikbal Laciverti) */}
          <div className="w-full md:w-[45%] lg:w-[40%] p-8 md:p-10 lg:p-12 flex flex-col justify-center relative z-20 min-w-0">
            <span className="bg-[#E30613] text-white text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full w-max mb-6 shadow-md uppercase tracking-wider">
              Demka Mobilya İstikbal
            </span>

            <h2 className="font-black text-white leading-[1.1] mb-2">
              <span className="block text-sm md:text-base lg:text-lg font-semibold text-white/80 tracking-wide mb-3 md:mb-4">
                Alışveriş Kodunuz
              </span>
              <span className="block text-[3.5rem] md:text-[4.5rem] lg:text-[5.25rem] text-[#F2A900] leading-none tracking-tight drop-shadow-[0_4px_20px_rgba(242,169,0,0.35)]">
                4080
              </span>
            </h2>

            {/* Kurumsal İletişim Bilgileri (Profesyonel SVG İkonlar) */}
            <div className="mt-8 flex flex-col gap-3">
              {/* Adres */}
              <div className="flex items-center text-white/90 text-xs md:text-sm bg-white/5 p-3 rounded-lg border border-white/10 transition-all duration-300 ease-out min-w-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-[#F2A900] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hero-address-text leading-relaxed min-w-0">Esenler Cad. No:99 A Bayrampaşa/İST (34035)</span>
              </div>

              {/* İletişim Butonları */}
              <div className="flex flex-wrap gap-3">
                <a href="tel:05327460570" className="hero-contact-chip flex items-center text-white/90 text-xs bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/12 hover:border-white/20 transition-all duration-300 ease-out min-w-0 max-w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 text-[#F2A900]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">0532 746 0570</span>
                </a>

                <a href="https://instagram.com/demkamobilya_istikbal" target="_blank" rel="noreferrer" className="hero-contact-chip flex items-center text-white/90 text-xs bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/12 hover:border-white/20 transition-all duration-300 ease-out min-w-0 max-w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 text-[#F2A900]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7 21h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4z" />
                  </svg>
                  <span className="font-medium">@demkamobilya_istikbal</span>
                </a>

                <a href="mailto:demkamobiyaistikbal@gmail.com" className="hero-contact-chip flex items-center text-white/90 text-xs bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/12 hover:border-white/20 transition-all duration-300 ease-out cursor-pointer min-w-0 max-w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 text-[#F2A900]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">demkamobiyaistikbal@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Slayt Noktaları (Sadece yazının altına hizalandı) */}
            <div className="mt-8 flex space-x-2">
              {sliderVerileri.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Slayt ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ease-out ${currentSlide === index
                      ? "w-8 bg-[#F2A900] shadow-[0_0_8px_rgba(242,169,0,0.5)]"
                      : "w-2 bg-white/30 hover:bg-white/60 hover:scale-110"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Sağ Taraf: Sadece Görseller (Sağa yaslı, temiz görünüm) */}
          <div className="w-full md:w-[55%] lg:w-[60%] relative h-[250px] md:h-full bg-gray-100">
            <Image
              key={`main-${currentSlide}`}
              src={withBasePath(sliderVerileri[currentSlide].gorsel)}
              alt={`Demka Mobilya Görsel ${currentSlide + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover object-center transition-opacity duration-700 ease-in-out"
              priority
            />
          </div>

        </div>
      </div>

      <div className="w-full px-4 md:px-12">
        <CommentSection productId={product.id} />
      </div>
    </div>
  );
}
