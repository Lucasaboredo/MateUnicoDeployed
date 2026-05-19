<p align="center">
  <img src="./frontend/public/logo-mate.svg" alt="Mate Unico" width="150" />
</p>

<h1 align="center">Mate Unico</h1>

<p align="center">
  E-commerce academico para venta de mates artesanales, desarrollado con Next.js y Strapi.
</p>

<p align="center">
  <strong>Frontend demo responsive</strong> · Catalogo · Carrito · Checkout · Mercado Pago
</p>

---

## Sobre el proyecto

Mate Unico es una plataforma web de comercio electronico desarrollada como proyecto academico para la carrera Licenciatura en Sistemas de Informacion, en el marco de la obtencion del titulo intermedio de Analista en Sistemas.

El objetivo fue construir una experiencia completa de tienda online: navegacion de productos, detalle de cada mate, variantes, carrito de compras, checkout e integracion con pagos digitales.

Actualmente el repositorio esta preparado para desplegar una version **frontend-only** en Vercel, usando datos e imagenes locales para mostrar el diseno sin necesidad de publicar Strapi.

## Funcionalidades

- Home con carrusel de banners.
- Catalogo de productos responsive.
- Filtros por categoria, combo, color, busqueda y promociones.
- Detalle de producto con galeria de imagenes.
- Favoritos con persistencia en `localStorage`.
- Carrito de compras.
- Checkout por pasos.
- Calculo de envio simulado.
- Simulador de grabado.
- FAQ.
- Integracion opcional con Mercado Pago desde Next.js.
- Modo demo sin backend.

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS.
- **Backend original:** Strapi 5.
- **Pagos:** Mercado Pago SDK.
- **Persistencia demo:** `localStorage` y datos locales.
- **Deploy recomendado:** Vercel.

## Estructura

```txt
.
├── frontend/
│   ├── public/
│   │   ├── mates/
│   │   ├── logo-mate.svg
│   │   └── ...
│   └── src/
│       ├── app/
│       ├── components/
│       └── lib/
└── backend/
    └── Strapi
```

## Ejecutar localmente

```bash
cd frontend
npm install
npm run dev
```

Abrir:

```txt
http://localhost:3000
```

## Modo demo sin Strapi

Para levantar el frontend sin backend:

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

En Vercel usar:

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
```

El modo demo usa:

- Productos definidos en `frontend/src/lib/demoData.ts`.
- Imagenes locales en `frontend/public/mates`.
- Banners y recursos desde `frontend/public`.

## Mercado Pago

Para probar el flujo de pago desde el frontend desplegado:

```env
MP_ACCESS_TOKEN=TU_ACCESS_TOKEN_DE_MERCADO_PAGO
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
```

Sin backend publico, Mercado Pago puede generar la preferencia y volver al frontend, pero no se guardan ordenes reales, no hay webhook confiable, no se descuenta stock real y no se envian emails transaccionales.

## Build

```bash
cd frontend
npm run build
```

## Deploy en Vercel

Configuracion recomendada:

- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output:** automatico de Next.js
- **Environment Variables:**
  - `NEXT_PUBLIC_DEMO_MODE=true`
  - `NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app`
  - `MP_ACCESS_TOKEN=...` si se usa Mercado Pago

## Finalidad academica

Mate Unico representa una instancia de integracion de conocimientos de analisis, diseno, desarrollo frontend, backend, bases de datos, autenticacion, gestion de productos, carrito, pagos digitales y despliegue.
