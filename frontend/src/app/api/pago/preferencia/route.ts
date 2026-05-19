export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new Error(`Falta la variable ${name}`);
  }
  return v.trim();
}

export async function POST(req: Request) {
  try {
    const accessToken = mustGetEnv("MP_ACCESS_TOKEN");
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin).replace(/\/$/, "");
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim().replace(/\/$/, "");

    const body = await req.json().catch(() => null);
    const orderId = body?.orderId;
    const items = body?.items;

    if (!orderId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Body invalido: se requiere { orderId, items[] }" },
        { status: 400 }
      );
    }

    const normalizedItems = items.map((item: any) => ({
      title: String(item?.title || "Producto"),
      quantity: Math.max(1, Number(item?.quantity || 1)),
      unit_price: Number(item?.unit_price ?? item?.price ?? 0),
      currency_id: "ARS",
    }));

    if (normalizedItems.some((item) => !Number.isFinite(item.unit_price) || item.unit_price <= 0)) {
      return NextResponse.json(
        { error: "Items invalidos: unit_price debe ser un numero mayor a 0" },
        { status: 400 }
      );
    }

    const preference: any = {
      items: normalizedItems,
      external_reference: String(orderId),
      back_urls: {
        success: `${siteUrl}/checkout/exito?order_id=${encodeURIComponent(String(orderId))}`,
        failure: `${siteUrl}/checkout/error?order_id=${encodeURIComponent(String(orderId))}`,
        pending: `${siteUrl}/checkout/pendiente?order_id=${encodeURIComponent(String(orderId))}`,
      },
      auto_return: "approved",
    };

    if (backendUrl?.startsWith("https://")) {
      preference.notification_url = `${backendUrl}/api/pago/webhook`;
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preferenceClient = new Preference(client);
    const response = await preferenceClient.create({ body: preference });

    return NextResponse.json({ init_point: response.init_point });
  } catch (err: any) {
    console.error("/api/pago/preferencia error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Error interno creando preferencia" },
      { status: 500 }
    );
  }
}
