"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFromStrapi } from "@/lib/api";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";

const FAVORITES_KEY = "mate-unico:favorites";

export default function Home() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loadingHero, setLoadingHero] = useState(true);
  const [productosDestacados, setProductosDestacados] = useState<any[]>([]);
  const [loadingDestacados, setLoadingDestacados] = useState(true);
  const [promociones, setPromociones] = useState<any[]>([]);
  const [loadingPromos, setLoadingPromos] = useState(true);

  useEffect(() => {
    async function load() {
      // HERO
      setLoadingHero(true);
      try {
        const homeRes = await fetchFromStrapi("/api/homes?populate[imagen_hero]=true");
        setSlides(homeRes.data || []);
      } catch (e) {
        console.error("⚠️ Error Hero:", e);
      } finally {
        setLoadingHero(false);
      }

      // DESTACADOS
      setLoadingDestacados(true);
      try {
        const prodRes = await fetchFromStrapi(
          "/api/productos?filters[destacado][$eq]=true&populate=imagen&populate=variantes"
        );
        setProductosDestacados(prodRes.data || []);
      } catch (e) {
        console.error("⚠️ Error destacados:", e);
      } finally {
        setLoadingDestacados(false);
      }

      // PROMOCIONES
      setLoadingPromos(true);
      try {
        const promosRes = await fetchFromStrapi(
          "/api/productos?filters[en_promocion][$eq]=true&populate=imagen&populate=variantes"
        );
        setPromociones(promosRes.data || []);
      } catch (e) {
        console.error("⚠️ Error promociones:", e);
      } finally {
        setLoadingPromos(false);
      }
    }
    load();
  }, []);

  return (
    <div className="w-full flex flex-col items-center bg-[#FCFAF6]">
      {/* HERO SECTION */}
      {!loadingHero && slides.length > 0 ? (
        <HeroCarousel slides={slides} />
      ) : (
        <div className="flex h-[360px] w-full items-center justify-center bg-[#E5E0D8] px-6 text-center text-[#5C5149] sm:h-[400px]">
          <p className="text-xl font-medium tracking-widest uppercase">Mate Único</p>
        </div>
      )}

      {/* ================= SECCIÓN PROMOCIONES 🔥 ================= */}
      <section className="w-full border-b border-[#E5E0D8] bg-[#FAF7F2] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-9 flex flex-col items-center text-center sm:mb-12">
            <h2 className="mb-4 text-center text-3xl font-black uppercase tracking-tight text-[#2F4A2D] sm:text-4xl md:text-5xl">
              Promociones 🔥
            </h2>
            <div className="mb-5 h-1 w-20 rounded-full bg-[#2F4A2D] sm:mb-6"></div>
            <p className="text-[#5C5149] font-medium text-sm max-w-md text-center">
              Aprovechá nuestros precios exclusivos por tiempo limitado.
            </p>
          </div>

          {loadingPromos ? (
            <div className="flex justify-center py-10">
              <div className="animate-pulse text-[#2F4A2D] font-bold text-center">Buscando ofertas...</div>
            </div>
          ) : promociones.length > 0 ? (
            /* ✨ AJUSTE: Mismo grid y centrado que Destacados */
            <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {promociones.map((prod: any) => (
                <div key={`promo-${prod.id}`} className="flex w-full justify-center">
                  <ProductCard producto={prod} />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto py-10 bg-white/50 rounded-3xl border-2 border-dashed border-[#E5E0D8] text-center">
              <p className="text-[#5C5149] italic text-sm font-medium text-center">Próximamente nuevas promociones...</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= SECCIÓN DESTACADOS ✨ ================= */}
      <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-9 flex flex-col items-center text-center sm:mb-12">
            <h2 className="mb-4 text-center text-3xl font-bold uppercase tracking-tight text-[#1a1a1a] md:text-4xl">
              Nuestros Destacados
            </h2>
            <div className="mb-5 h-1 w-12 bg-[#4A4A40] sm:mb-6"></div>
            <p className="text-gray-500 max-w-lg text-sm leading-relaxed text-center">
              La calidad que nos define en cada pieza.
            </p>
          </div>

          {loadingDestacados ? (
            <div className="text-center py-10 text-gray-400 animate-pulse">Cargando destacados...</div>
          ) : productosDestacados.length > 0 ? (
            /* ✨ flex-wrap hace que se apilen hacia abajo si o si en mobile pero manteniendo 4 por fila en compu */
            <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {productosDestacados.map((prod: any) => (
                <div key={`dest-${prod.id}`} className="flex w-full justify-center">
                  <ProductCard producto={prod} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 italic">No hay productos destacados hoy.</p>
          )}

          <div className="mt-12 text-center sm:mt-16">
            <Link
              href="/productos"
              className="group relative inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#4A4A40] px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:bg-[#2F4A2D] active:scale-95 sm:w-auto sm:px-10"
            >
              <span className="text-xs uppercase tracking-[0.2em]">Ver Toda la Tienda</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
