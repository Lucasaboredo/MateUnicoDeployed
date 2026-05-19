# Desplegar solo el frontend

Para mostrar una demo sin publicar Strapi, activar el modo demo. El frontend usa productos e imagenes locales empaquetadas en `public/demo-products`.

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SITE_URL=https://tu-frontend.vercel.app
```

Con esto se ve home, catalogo, detalle, carrito y checkout visual sin depender de Strapi.

## Mercado Pago sin Strapi

Se puede crear la preferencia desde la API route de Next/Vercel usando:

```env
MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://tu-frontend.vercel.app
```

Limitaciones sin backend:

- No se guardan ordenes reales en base de datos.
- No hay webhook confiable para confirmar pagos.
- No se descuenta stock real.
- No se envian mails transaccionales desde Strapi.

Si mas adelante hay backend publico, se puede sumar:

```env
NEXT_PUBLIC_BACKEND_URL=https://tu-backend-publico.com
```

## Con Strapi publico

## Opciones

- Frontend en Vercel/Netlify + Strapi publicado en un hosting/Strapi Cloud.
- Frontend en Vercel/Netlify + Strapi local expuesto temporalmente con una URL publica tipo tunnel, solo para demo corta.
- Frontend 100% estatico sin Strapi: usar `NEXT_PUBLIC_DEMO_MODE=true`, pero ya no seria editable desde el admin.

## Variables del frontend

```env
NEXT_PUBLIC_STRAPI_URL=https://tu-strapi-publico.com
NEXT_PUBLIC_API_URL=https://tu-strapi-publico.com
```

Si se usa checkout con Mercado Pago:

```env
MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BACKEND_URL=https://tu-strapi-publico.com
```

## Checklist de Strapi

- Los roles publicos deben tener permiso de lectura para productos, categorias, home y FAQ.
- Los archivos de `uploads` deben responder publicamente, por ejemplo `https://tu-strapi-publico.com/uploads/archivo.jpg`.
- Si usas login/registro desde el deploy, configurar CORS y providers OAuth con el dominio final del frontend.
