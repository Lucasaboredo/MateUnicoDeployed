# Mate Unico Frontend

Frontend de Mate Unico construido con Next.js, React, TypeScript y Tailwind CSS.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run start
```

## Modo demo

Para usar la version sin Strapi:

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Los productos demo estan en `src/lib/demoData.ts` y las imagenes en `public/mates`.

## Deploy

En Vercel:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Variables:

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
```

Para Mercado Pago:

```env
MP_ACCESS_TOKEN=TU_ACCESS_TOKEN_DE_MERCADO_PAGO
```
