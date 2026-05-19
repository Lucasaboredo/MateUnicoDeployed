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
    <section className="relative w-full h-[calc(100svh-118px)] min-h-[430px] max-h-[620px] overflow-hidden bg-[#F4F1EB] sm:h-[520px] lg:h-[600px]">
      
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
              className="object-cover object-center sm:object-right"
            />
          </div>
        );
      })}

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#F4F1EB]/65 z-20 sm:bg-[#F4F1EB]/55" />

      {/* TEXTO */}
      <div className="relative z-30 h-full mx-auto flex max-w-[1200px] items-center px-5 py-10 sm:px-6 lg:px-4">
        <div className="max-w-[600px]">
          <h1 className="mb-4 text-[42px] leading-[1.05] font-bold text-[#2F4A2D] sm:mb-6 sm:text-[56px] lg:text-[64px]">
            {home.titulo}
          </h1>

          <p className="mb-8 max-w-[34rem] text-lg leading-relaxed text-[#4B4B4B] sm:mb-10 sm:text-2xl">
            {home.subtitulo}
          </p>

          {/* 👉 SIEMPRE VA A PRODUCTOS */}
          <a
            href={home.cta_link || "/productos"}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#486837] px-8 py-3 text-base font-semibold text-white transition hover:bg-[#3A542D] sm:w-auto sm:px-10 sm:py-4 sm:text-lg"
          >
            {home.cta_texto || "Comprar ahora"}
          </a>
        </div>
      </div>

      {/* DOTS */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
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
