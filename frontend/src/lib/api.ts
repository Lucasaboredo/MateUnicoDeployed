// src/lib/api.ts
import { getDemoResponse } from "./demoData";
import { STRAPI_URL } from "./strapi";

// Usamos 127.0.0.1 para máxima compatibilidad local
const API_URL = STRAPI_URL;
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function fetchFromStrapi(path: string, options: RequestInit = {}) {
  // 1. Aseguramos que el path empiece con "/"
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // 2. AUTO-CORRECCIÓN DE RUTA
  if (!cleanPath.startsWith("/api") && !cleanPath.startsWith("/uploads")) {
    cleanPath = `/api${cleanPath}`;
  }

  if (DEMO_MODE) {
    return getDemoResponse(cleanPath, options);
  }

  // 3. 💥 CACHE BUSTER (LA SOLUCIÓN) 💥
  // Agregamos un número aleatorio al final de la URL para que NUNCA se guarde en caché.
  const separator = cleanPath.includes("?") ? "&" : "?";
  const cacheBuster = `t=${Date.now()}`;
  const finalPath = `${cleanPath}${separator}${cacheBuster}`;

  // Construimos la URL final
  const fullUrl = `${API_URL}${finalPath}`;

  console.log(`📡 Fetching (No-Cache): ${fullUrl}`);

  try {
    const res = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
      cache: "no-store", // Instrucción estándar para no guardar caché
      next: { revalidate: 0 } // Instrucción específica de Next.js
    });

    if (!res.ok) {
      console.error(`❌ Error ${res.status} en: ${fullUrl}`);
      // Intentamos leer el error del backend para dar más info
      const errorBody = await res.text(); 
      console.error("   Cuerpo del error:", errorBody);
      throw new Error(`Error ${res.status} al conectar con Strapi`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error(`🔥 ERROR CRÍTICO DE CONEXIÓN: ${fullUrl}`);
    console.warn("Usando datos demo locales porque Strapi no esta disponible.");
    return getDemoResponse(cleanPath, options);
  }
}
