"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Stepper from "@/components/stepper/Stepper";
import { useCart } from "@/lib/cartContext";
import { useCheckout } from "@/lib/checkoutContext";
import { useAuth } from "@/lib/authContext";
import type { CartItem } from "@/types/cart";

export default function CheckoutDatosPage() {
  const router = useRouter();

  const { items, total } = useCart();
  const { buyer, setBuyer } = useCheckout();
  const { user } = useAuth();

  const [form, setForm] = useState({
    nombre: buyer.nombre,
    apellido: buyer.apellido,
    email: buyer.email,
    telefono: buyer.telefono,
  });

  const [error, setError] = useState<string | null>(null);

  // Pre-carga de datos
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nombre: prev.nombre || user.nombre || "",
        apellido: prev.apellido || user.apellido || "",
        email: prev.email || user.email || "",
        telefono: prev.telefono || user.telefono || "",
      }));
    }
  }, [user]);

  // Si el carrito está vacío...
  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Stepper currentStep={2} />
        <p className="mt-10 text-center text-[#333333]">Tu carrito está vacío.</p>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { nombre, apellido, email, telefono } = form;

    if (!nombre.trim() || !apellido.trim() || !email.trim() || !telefono.trim()) {
      setError("Completá todos los campos.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("El email no es válido.");
      return;
    }

    setBuyer(form);
    router.push("/checkout/envio");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Stepper currentStep={2} />

      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="rounded-2xl bg-[#FCFAF6] p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-semibold text-[#333333]">Datos del comprador</h1>
            {user && (
              <span className="text-xs text-[#5F6B58] bg-[#eef0ec] px-2 py-1 rounded-md">
                Logueado como {user.username}
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-[#5C5149]">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#e7e2d9] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#5F6B58]"
              />
            </div>

            <div>
              <label className="text-sm text-[#5C5149]">Apellido</label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#e7e2d9] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#5F6B58]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-[#5C5149]">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                // Deshabilitamos email si viene del usuario para evitar conflictos
                disabled={!!user?.email} 
                className={`mt-1 w-full rounded-xl border border-[#e7e2d9] px-4 py-3 text-[#333333] outline-none focus:border-[#5F6B58] ${user?.email ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-[#5C5149]">Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#e7e2d9] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#5F6B58]"
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-[#5F6B58] px-6 py-3 font-medium text-white hover:opacity-95"
          >
            Continuar
          </button>
        </form>

        {/* Resumen */}
        <aside className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-36 lg:self-start">
          <h2 className="text-lg font-semibold text-[#333333]">Resumen</h2>
          <div className="mt-4 space-y-3">
            {(items as CartItem[]).map((item) => (
              <div key={`${item.productId}-${item.variantId ?? "noVar"}`} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-[#333333]">{item.nombre}</p>
                  <p className="text-[#5C5149]">x{item.cantidad}</p>
                </div>
                <p className="font-medium text-[#333333]">${(item.precioUnitario * item.cantidad).toLocaleString("es-AR")}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t pt-4">
            <span className="text-sm text-[#5C5149]">Total</span>
            <span className="font-semibold text-[#333333]">${Number(total).toLocaleString("es-AR")}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
