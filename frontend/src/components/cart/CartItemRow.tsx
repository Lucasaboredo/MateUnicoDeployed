"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { getStrapiMediaUrl } from "@/lib/strapi";

export default function CartItemRow({ item }: any) {
  // 1. IMPORTANTE: Traemos 'items' para calcular el stock global compartido
  const { updateQuantity, removeFromCart, items } = useCart();

  const imgUrl = getStrapiMediaUrl(item.imagenUrl);

  // 2. LÓGICA DE STOCK COMPARTIDO
  const cantidadTotalOcupada = items
    .filter((i) => i.productId === item.productId && i.variantId === item.variantId)
    .reduce((acc, i) => acc + i.cantidad, 0);

  const stockTotalFisico = item.stock ?? 999999;
  
  // Stock real que queda disponible para agregar (Global)
  const quedanParaAgregar = Math.max(0, stockTotalFisico - cantidadTotalOcupada);
  
  // Validaciones visuales
  const stockLleno = quedanParaAgregar === 0;

  // ---------- HANDLERS ----------
  const handleDecrease = () => {
    if (item.cantidad > 1) {
      updateQuantity(item, item.cantidad - 1);
    }
  };

  const handleIncrease = () => {
    // Solo permitimos sumar si queda stock GLOBALMENTE compartido
    if (quedanParaAgregar > 0) {
      updateQuantity(item, item.cantidad + 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(item);
  };

  return (
    <div className="bg-[#5C5149] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-[#4A3E36] transition-all hover:translate-y-[-2px]">
      
      {/* SECCIÓN IZQUIERDA: IMAGEN + INFO */}
      <Link
        href={`/productos/${item.slug}`}
        className="flex items-start gap-5 flex-1 w-full sm:w-auto cursor-pointer group"
      >
        {/* IMAGEN */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#6B5E55] flex-shrink-0 bg-[#4A3E36]">
          <Image
            src={imgUrl}
            alt={item.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* TEXTO */}
        <div className="flex flex-col gap-1 pt-1">
          {/* Nombre base */}
          <h3 className="text-[#FCFAF6] font-bold text-lg leading-tight group-hover:text-[#E6E1D8] transition-colors">
            {item.nombre.split(" - ")[0]} 
          </h3>
          
          {/* Variante / Color */}
          {item.nombre.includes(" - ") && !item.nombre.includes("Grabado") && (
            <p className="text-[#C9C1B5] text-sm font-medium">
              Color: {item.nombre.split(" - ")[1].split(" (")[0]}
            </p>
          )}

          {/* Grabado (Destacado) */}
          {item.grabado && (
            <div className="flex flex-col mt-1">
              <span className="text-[10px] uppercase font-bold text-[#C9C1B5] tracking-wide mb-0.5">
                Personalización:
              </span>
              <div className="flex items-center gap-2 bg-[#4A3E36] w-fit px-3 py-1.5 rounded-md border border-[#6B5E55]">
                <span className="text-xs font-semibold text-[#E6E1D8]">
                  ✍️ "{item.textoGrabado}"
                </span>
              </div>
            </div>
          )}

          {/* STOCK GENERAL VISIBLE (DISEÑO #5F6B58 SOLICITADO) */}
          <div className="mt-2 flex items-center gap-2">
             <span className={`text-xs font-bold px-3 py-1 rounded-full border border-[#5F6B58] bg-[#5F6B58] text-white shadow-sm tracking-wide`}>
               {stockLleno 
                 ? "Stock máximo alcanzado" 
                 : `${quedanParaAgregar} más disponibles`
               }
             </span>
          </div>
        </div>
      </Link>

      {/* SECCIÓN DERECHA: CONTROLES + PRECIO */}
      <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#6B5E55]">
        
        {/* CONTROLES DE CANTIDAD */}
        <div className="flex items-center bg-[#4A3E36] rounded-full p-1 border border-[#6B5E55] shadow-inner">
          <button
            onClick={(e) => { e.stopPropagation(); handleDecrease(); }}
            disabled={item.cantidad <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#5C5149] text-[#FCFAF6] hover:bg-[#6B5E55] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            -
          </button>

          <span className="w-10 text-center text-[#FCFAF6] font-bold text-sm tabular-nums">
            {item.cantidad}
          </span>

          <button
            onClick={(e) => { e.stopPropagation(); handleIncrease(); }}
            disabled={stockLleno} // 🔒 Se bloquea si el stock GLOBAL se llenó
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all shadow-sm ${
                stockLleno 
                ? "bg-gray-600 text-gray-400 opacity-50 cursor-not-allowed" 
                : "bg-[#FCFAF6] text-[#4A4A40] hover:bg-white"
            }`}
          >
            +
          </button>
        </div>

        {/* PRECIO Y BORRAR */}
        <div className="flex flex-col items-end gap-1 min-w-[80px]">
          <span className="text-[#FCFAF6] font-bold text-xl">
            ${(item.precioUnitario * item.cantidad).toLocaleString("es-AR")}
          </span>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemove();
            }}
            className="text-xs text-[#C9C1B5] hover:text-red-300 underline decoration-dotted underline-offset-2 transition-colors flex items-center gap-1 mt-1 group/trash"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/trash:text-red-400"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
