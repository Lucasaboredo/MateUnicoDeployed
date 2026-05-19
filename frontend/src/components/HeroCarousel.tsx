"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getStrapiMediaUrl } from "@/lib/strapi";

type Media = {
  url: string;
  alternativeText?: string;
};

type HomeEntry = {
  titulo: string;
  subtitulo: string;
  cta_texto: string;
  cta_link?: string;
  imagen_hero: Media[];
};

export default function HeroCarousel({ slides }: { slides: HomeEntry[] }) {
  // Usamos solo el primer home
  const home = slides[0];
  const images = home?.imagen_hero ?? [];
  const [current, setCurrent] = useState(0);

  // ⏱️ AUTOPLAY MÁS LENTO (8 segundos)
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000); // 👈 ACÁ CONTROLÁS EL TIEMPO

    return () => clearInterval(interval);
  }, [images.length]);

  if (!home || images.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[520px] min-h-[480px] w-full overflow-hidden bg-[#F4F1EB] sm:h-[560px] lg:h-[600px]">
      
      {/* IMÁGENES */}
      {images.map((img, index) => {
        const isActive = index === current;
        const url = getStrapiMediaUrl(img.url);

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={url}
              alt={img.alternativeText || "Banner Mate Único"}
              fill
              priority={isActive}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        );
      })}

      {/* Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#F4F1EB]/25 via-[#F4F1EB]/60 to-[#F4F1EB]/95 sm:bg-[#F4F1EB]/55 sm:bg-none" />

      {/* TEXTO */}
      <div className="relative z-30 mx-auto flex h-full max-w-[1200px] items-end justify-center px-5 pb-16 pt-10 text-center sm:items-center sm:justify-start sm:px-6 sm:py-10 sm:text-left lg:px-4">
        <div className="mx-auto max-w-[560px] sm:mx-0 sm:max-w-[600px]">
          <h1 className="mb-4 text-[clamp(2.5rem,12vw,4rem)] font-bold leading-[1.03] text-[#2F4A2D] sm:mb-6 sm:text-[56px] lg:text-[64px]">
            {home.titulo}
          </h1>

          <p className="mx-auto mb-7 max-w-[30rem] text-base font-medium leading-relaxed text-[#4B4B4B] sm:mx-0 sm:mb-10 sm:text-2xl">
            {home.subtitulo}
          </p>

          {/* 👉 SIEMPRE VA A PRODUCTOS */}
          <a
            href={home.cta_link || "/productos"}
            className="inline-flex min-h-12 w-auto min-w-[220px] items-center justify-center rounded-md bg-[#486837] px-8 py-3 text-base font-semibold text-white transition hover:bg-[#3A542D] sm:px-10 sm:py-4 sm:text-lg"
          >
            {home.cta_texto || "Comprar ahora"}
          </a>
        </div>
      </div>

      {/* DOTS */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-3 sm:bottom-6">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === current
                  ? "bg-[#486837] scale-125"
                  : "bg-[#486837]/40 hover:bg-[#486837]/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
