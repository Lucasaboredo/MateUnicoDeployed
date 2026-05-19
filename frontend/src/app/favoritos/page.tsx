"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

/**
 * Guardamos favoritos en localStorage.
 * Estructura esperada:
 *  - "favorites": JSON.stringify([...productos])
 *
 * Donde cada "producto" tiene, como mínimo:
 * { id, nombre, slug, precioBase, imagen?, variantes? }
 *
 * Si ustedes guardan solo IDs, avísenme y lo adaptamos para fetchear a Strapi.
 */
const LS_KEY = "favorites";

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Cargar favoritos desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setFavoritos(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavoritos([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Helpers
  const total = favoritos.length;

  const limpiarFavoritos = () => {
    localStorage.removeItem(LS_KEY);
    setFavoritos([]);
  };

  const quitarFavorito = (id: number) => {
    const next = favoritos.filter((p) => Number(p?.id) !== Number(id));
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    setFavoritos(next);
  };

  // Evitar romper ProductCard si faltan campos
  const favoritosSeguros = useMemo(() => {
    return favoritos
      .filter((p) => p && p.nombre)
      .map((p) => ({
        ...p,
        precioBase: Number(p.precioBase ?? 0),
        imagen: Array.isArray(p.imagen) ? p.imagen : [],
        variantes: Array.isArray(p.variantes) ? p.variantes : [],
      }));
  }, [favoritos]);

  return (
    <main className="min-h-screen w-full bg-[#F4F1EB] font-sans text-[#5C5149]">
      <section className="mx-auto max-w-[1400px] px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2F4A2D]">
              Favoritos ❤️
            </h1>
            <p className="text-sm text-[#5C5149]/70 mt-2">
              {loaded ? (
                <>
                  Tenés <span className="font-bold text-[#5C5149]">{total}</span>{" "}
                  producto{total === 1 ? "" : "s"} guardado{total === 1 ? "" : "s"}.
                </>
              ) : (
                "Cargando..."
              )}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/productos"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#8D868D] px-6 py-2 text-sm font-medium text-[#333] transition hover:bg-[#5F6B58] hover:text-white"
            >
              Ir a productos
            </Link>

            <button
              onClick={limpiarFavoritos}
              disabled={!loaded || total === 0}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#5C5149] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#4a413a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Vaciar favoritos
            </button>
          </div>
        </div>

        {/* Estado vacío */}
        {loaded && total === 0 ? (
          <div className="mt-10 rounded-2xl border border-[#E0DCD3] bg-white/60 p-6 text-center sm:mt-12 sm:p-10">
            <p className="text-lg font-semibold text-[#2F4A2D] mb-2">
              Todavía no agregamos favoritos.
            </p>
            <p className="text-sm text-[#5C5149]/70 mb-6">
              Toquen el ❤️ en un producto para guardarlo acá.
            </p>

            <Link
              href="/productos"
              className="inline-flex items-center justify-center rounded-full bg-[#2F4A2D] px-8 py-3 text-sm font-bold text-white hover:opacity-90 transition"
            >
              Explorar productos
            </Link>
          </div>
        ) : null}

        {/* Grid */}
        {loaded && total > 0 ? (
          <div className="mt-12">
            <div className="grid justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-10">
              {favoritosSeguros.map((prod: any) => (
                <div key={prod.id} className="w-full max-w-[360px]">
                  <ProductCard producto={prod} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
