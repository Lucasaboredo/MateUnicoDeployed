"use client";

import { useState } from "react";
import Link from "next/link";
import Mate2DPreview from "@/components/Mate2DPreview";

// Definimos los modelos disponibles (Ahora son 3)
const MODELOS = [
  { id: 'imperial', nombre: 'Imperial', src: '/mate-frontal.webp' }, // El original
  { id: 'camionero', nombre: 'Camionero', src: '/camionero.png' },
  { id: 'algarrobo', nombre: 'Algarrobo', src: '/algarrobo.png' },
];

export default function SimuladorPage() {
  const [texto, setTexto] = useState("TU NOMBRE");
  const [mateActual, setMateActual] = useState(MODELOS[0]); // Arranca con el Imperial
  const [confirmado, setConfirmado] = useState(false);

  // Fuente fija
  const fontFija = "'Times New Roman', serif";

  const handleConfirmar = () => {
    if (!texto.trim()) return;
    setConfirmado(true);
  };

  const handleReset = () => {
    setConfirmado(false);
    setTexto("TU NOMBRE");
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] pb-14 pt-8 sm:pb-20 sm:pt-12">
      <div className="container mx-auto px-4">
        
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="mb-4 text-3xl font-bold text-[#1a1a1a] sm:text-4xl md:text-5xl">
            Personalizá tu Mate
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {confirmado 
              ? "¡Quedó espectacular! ¿Te lo llevás así?"
              : "Probá cómo quedaría tu nombre grabado en la virola."
            }
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          
          {/* --- PANEL DE CONTROLES (Izquierda) --- */}
          <div className="flex h-fit flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-4 shadow-lg sm:p-6 lg:col-span-5 lg:p-8">
            
            {!confirmado ? (
              // MODO EDICIÓN
              <>
                {/* 1. SELECCIÓN DE MODELO */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Elegí el modelo
                  </label>
                  <div className="grid grid-cols-3 gap-2"> 
                    {MODELOS.map((modelo) => (
                      <button
                        key={modelo.id}
                        onClick={() => setMateActual(modelo)}
                        className={`rounded-xl border-2 px-1 py-3 text-xs font-bold transition-all md:text-sm ${
                          mateActual.id === modelo.id
                            ? "border-[#1a1a1a] bg-[#1a1a1a] text-white shadow-md"
                            : "border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50"
                        }`}
                      >
                        {modelo.nombre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. INGRESO DE TEXTO */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Ingresá el nombre
                  </label>
                  <input
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value.toUpperCase())}
                    maxLength={10} 
                    className="w-full rounded-xl border border-gray-300 px-4 py-4 text-center text-lg font-bold uppercase tracking-widest outline-none transition-all placeholder-gray-300 focus:ring-2 focus:ring-[#4A4A40] sm:text-xl"
                    placeholder="EJ: JUAN"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">Máximo 10 caracteres</span>
                    <span className={`text-xs font-bold ${texto.length === 10 ? 'text-red-500' : 'text-gray-400'}`}>
                      {texto.length}/10
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                   <p className="text-sm text-gray-500 mb-6 text-center bg-gray-50 py-2 rounded-lg border border-gray-100">
                     Tipografía: <b>Clásica (Imperial)</b>
                   </p>
                   <button 
                     onClick={handleConfirmar}
                     disabled={texto.length < 1}
                     className="w-full bg-[#1a1a1a] text-white py-4 rounded-full font-bold uppercase tracking-wide hover:bg-[#333] transition transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                   >
                     Confirmar Diseño
                   </button>
                </div>
              </>
            ) : (
              // MODO CONFIRMADO
              <div className="text-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center">
                    <span className="text-2xl animate-bounce">✨</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                  ¡Diseño Guardado!
                </h3>
                <p className="text-gray-500 mb-2 text-sm px-4">
                  Modelo: <b>{mateActual.nombre}</b>
                </p>
                <p className="text-gray-500 mb-8 text-sm px-4">
                  Grabado: <b>"{texto}"</b>
                </p>

                <div className="space-y-3">
                  <Link 
                    href={`/productos?grabado=${encodeURIComponent(texto)}&modelo=${mateActual.id}`} 
                    className="block w-full bg-[#1a1a1a] text-white py-4 rounded-full font-bold uppercase tracking-wide hover:bg-[#333] shadow-lg transition-all hover:scale-[1.02]"
                  >
                    Ir a Comprar
                  </Link>
                  
                  <button 
                    onClick={handleReset}
                    className="block w-full bg-white border-2 border-gray-200 text-gray-600 py-3 rounded-full font-bold uppercase tracking-wide hover:border-gray-400 hover:text-black transition-all"
                  >
                    Probar otro
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --- VISUALIZADOR (Derecha) --- */}
          <div className={`lg:col-span-7 transition-all duration-700 ease-out ${confirmado ? 'scale-[1.02]' : 'scale-100'}`}>
             <div className={`relative transition-all duration-500 ${confirmado ? 'ring-4 ring-[#4A4A40]/20 rounded-xl shadow-2xl' : ''}`}>
                <Mate2DPreview 
                  texto={texto} 
                  font={fontFija} 
                  imagenFondo={mateActual.src} 
                />
                
                {confirmado && (
                  <div className="absolute top-4 right-4 bg-[#1a1a1a] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg z-10 tracking-wider animate-in fade-in zoom-in duration-300">
                    VISTA PREVIA
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
