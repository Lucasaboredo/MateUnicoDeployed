"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Stepper from "@/components/stepper/Stepper";
import { useCart } from "@/lib/cartContext";
import { useCheckout } from "@/lib/checkoutContext";
import { useAuth } from "@/lib/authContext"; // 1. Importamos Auth
import type { CartItem } from "@/types/cart";

export default function CheckoutEnvioPage() {
  const router = useRouter();

  const { items, total } = useCart();
  const { buyer, shipping, setShipping } = useCheckout();
  const { user } = useAuth(); // 2. Traemos al usuario

  const [form, setForm] = useState({
    calle: shipping.calle ?? "",
    numero: shipping.numero ?? "",
    ciudad: shipping.ciudad ?? "",
    provincia: shipping.provincia ?? "",
    codigoPostal: shipping.codigoPostal ?? "",

    // Checkbox de envío (calculado si ya hay precio)
    envioSeleccionado: Boolean(shipping.costoEnvio && shipping.costoEnvio > 0),

    costoEnvio: shipping.costoEnvio ?? 0,
    demora: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // 👇 3. MAGIA: Pre-carga de datos de envío desde el Perfil
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        // Prioridad: 1. Lo que ya escribió en el checkout (prev), 2. Lo que tiene guardado en perfil (user), 3. Vacío
        calle: prev.calle || user.direccion || "",     // user.direccion es la CALLE
        numero: prev.numero || user.numero || "",       // user.numero es la ALTURA
        ciudad: prev.ciudad || user.ciudad || "",
        provincia: prev.provincia || user.provincia || "",
        codigoPostal: prev.codigoPostal || user.codigoPostal || "",
      }));
    }
  }, [user]);

  // Si no completó datos personales, volver atrás
  if (!buyer.email) {
    router.push("/checkout/datos");
    return null;
  }

  // Si el carrito está vacío
  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Stepper currentStep={3} />
        <p className="mt-10 text-center text-[#333333]">Tu carrito está vacío.</p>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Lógica de Cálculo de Envío (OCA/Correo Argentino simulado)
  useEffect(() => {
    const cp = form.codigoPostal.trim();

    if (!form.envioSeleccionado) {
      setForm((prev) => ({ ...prev, costoEnvio: 0, demora: "" }));
      setShippingError(null);
      setShippingLoading(false);
      return;
    }

    if (!cp) return;

    let cancelled = false;

    async function calcShipping() {
      try {
        setShippingLoading(true);
        setShippingError(null);

        const res = await fetch("/api/shipping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cp }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error ?? "Error calculando envío");
        }

        const costo = Number(data.price ?? 0);
        const demora = String(data.delay ?? "");

        if (!cancelled) {
          setForm((prev) => ({
            ...prev,
            costoEnvio: costo,
            demora,
          }));
        }
      } catch (e: any) {
        if (!cancelled) {
          setShippingError(e?.message ?? "No se pudo calcular el envío.");
          setForm((prev) => ({ ...prev, costoEnvio: 0, demora: "" }));
        }
      } finally {
        if (!cancelled) setShippingLoading(false);
      }
    }

    const t = setTimeout(calcShipping, 450);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [form.codigoPostal, form.envioSeleccionado]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { calle, numero, ciudad, provincia, codigoPostal } = form;

    if (!calle.trim() || !numero.trim() || !ciudad.trim() || !provincia.trim() || !codigoPostal.trim()) {
      setError("Completá todos los datos de envío.");
      return;
    }

    if (!form.envioSeleccionado) {
      setError("Seleccioná el envío Standard para continuar.");
      return;
    }

    setShipping({
      calle: form.calle,
      numero: form.numero,
      ciudad: form.ciudad,
      provincia: form.provincia,
      codigoPostal: form.codigoPostal,
      metodoEnvio: "standard",
      costoEnvio: form.costoEnvio,
    });

    router.push("/checkout/pago");
  }

  const totalFinal = Number(total) + Number(form.costoEnvio);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Stepper currentStep={3} />

      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* Formulario de Envío */}
        <form onSubmit={handleSubmit} className="rounded-2xl bg-[#FCFAF6] p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-semibold text-[#333333]">Envío</h1>
            {user && (
              <span className="text-xs text-[#5F6B58] bg-[#eef0ec] px-2 py-1 rounded-md">
                Usando dirección de {user.username}
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm text-[#5C5149]">Calle</label>
              <input
                name="calle"
                value={form.calle}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#e7e2d9] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#5F6B58]"
              />
            </div>

            <div>
              <label className="text-sm text-[#5C5149]">Número</label>
              <input
                name="numero"
                value={form.numero}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#e7e2d9] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#5F6B58]"
              />
            </div>

            <div>
              <label className="text-sm text-[#5C5149]">Código Postal</label>
              <input
                name="codigoPostal"
                value={form.codigoPostal}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#e7e2d9] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#5F6B58]"
              />
              {/* Info extra de envío */}
              {form.envioSeleccionado && shippingLoading && (
                <p className="mt-2 text-xs text-[#5C5149]">Calculando envío…</p>
              )}
              {form.envioSeleccionado && shippingError && (
                <p className="mt-2 text-xs text-red-600">{shippingError}</p>
              )}
              {form.envioSeleccionado && !shippingLoading && !shippingError && form.demora && (
                <p className="mt-2 text-xs text-[#5C5149]">{form.demora}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-[#5C5149]">Ciudad</label>
              <input
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#e7e2d9] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#5F6B58]"
              />
            </div>

            <div>
              <label className="text-sm text-[#5C5149]">Provincia</label>
              <input
                name="provincia"
                value={form.provincia}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[#e7e2d9] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#5F6B58]"
              />
            </div>
          </div>

          {/* Opción de Envío */}
          <div className="mt-6 rounded-2xl bg-white p-4">
            <p className="text-sm font-medium text-[#333333]">Método de envío</p>

            <label className="mt-3 flex cursor-pointer flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="envioSeleccionado"
                  checked={form.envioSeleccionado}
                  onChange={handleChange}
                />
                <div>
                  <p className="text-sm text-[#333333]">Envío Standard</p>
                  <p className="text-xs text-[#5C5149]">
                    Se calcula automáticamente según el Código Postal
                  </p>
                </div>
              </div>

              <span className="text-sm text-[#5C5149]">
                {form.envioSeleccionado
                  ? shippingLoading
                    ? "..."
                    : `$${Number(form.costoEnvio).toLocaleString("es-AR")}`
                  : "$0"}
              </span>
            </label>
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
          <div className="mt-6 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5C5149]">Subtotal</span>
              <span className="text-[#333333]">${Number(total).toLocaleString("es-AR")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5C5149]">Envío</span>
              <span className="text-[#333333]">
                {form.envioSeleccionado
                  ? shippingLoading
                    ? "Calculando..."
                    : `$${Number(form.costoEnvio).toLocaleString("es-AR")}`
                  : "$0"}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold">
              <span className="text-[#333333]">Total</span>
              <span className="text-[#333333]">
                ${Number(form.envioSeleccionado ? totalFinal : total).toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
