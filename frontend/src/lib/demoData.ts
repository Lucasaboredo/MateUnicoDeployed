const demoProducts = [
  {
    id: 1,
    documentId: "demo-imperial-negro",
    nombre: "Imperial Negro",
    descripcion:
      "Mate estilo imperial con terminacion sobria, pensado para una presentacion elegante y uso diario.",
    precioBase: 42000,
    material: "Algarrobo",
    activo: true,
    slug: "imperial-negro",
    destacado: true,
    permite_grabado: true,
    en_promocion: true,
    precio_oferta: 36000,
    combo: "mate_bombilla",
    color: "negro",
    categoria: { id: 1, nombre: "Madera", slug: "madera" },
    imagen: [
      { id: 1, url: "/demo-products/imperial-negro.png" },
      { id: 2, url: "/demo-products/camionero-algarrobo.png" },
    ],
    variantes: [
      { id: 101, nombre: "Negro", stock: 8, precio: 42000, codigo_color: "#111111", indice_imagen: 0 },
      { id: 102, nombre: "Natural", stock: 3, precio: 39000, codigo_color: "#8B5E34", indice_imagen: 1 },
    ],
    opinions: [
      { id: 1, Puntuacion: 5, Texto: "Muy buena terminacion y excelente presentacion.", createdAt: "2026-04-10" },
    ],
  },
  {
    id: 2,
    documentId: "demo-camionero-algarrobo",
    nombre: "Camionero Algarrobo",
    descripcion:
      "Mate camionero amplio, con madera calida y boca comoda para quienes prefieren cebadas largas.",
    precioBase: 38000,
    material: "Algarrobo",
    activo: true,
    slug: "camionero-algarrobo",
    destacado: true,
    permite_grabado: true,
    en_promocion: false,
    combo: "mate",
    color: "marron",
    categoria: { id: 1, nombre: "Madera", slug: "madera" },
    imagen: [{ id: 3, url: "/demo-products/camionero-algarrobo.png" }],
    variantes: [
      { id: 201, nombre: "Natural", stock: 10, precio: 38000, codigo_color: "#8B5E34", indice_imagen: 0 },
    ],
    opinions: [],
  },
  {
    id: 3,
    documentId: "demo-calabaza-clasico",
    nombre: "Calabaza Clasico",
    descripcion:
      "Mate de calabaza tradicional con virola metalica, liviano y listo para completar el ritual.",
    precioBase: 31000,
    material: "Calabaza",
    activo: true,
    slug: "calabaza-clasico",
    destacado: false,
    permite_grabado: false,
    en_promocion: true,
    precio_oferta: 27500,
    combo: "mate_bombilla_bolso",
    color: "marron",
    categoria: { id: 2, nombre: "Calabaza", slug: "calabaza" },
    imagen: [{ id: 4, url: "/demo-products/calabaza-clasico.png" }],
    variantes: [
      { id: 301, nombre: "Clasico", stock: 4, precio: 31000, codigo_color: "#7A4A2B", indice_imagen: 0 },
    ],
    opinions: [],
  },
  {
    id: 4,
    documentId: "demo-torpedo-premium",
    nombre: "Torpedo Premium",
    descripcion:
      "Formato torpedo con buen agarre, cuerpo firme y detalle artesanal para una linea mas premium.",
    precioBase: 46000,
    material: "Algarrobo",
    activo: true,
    slug: "torpedo-premium",
    destacado: true,
    permite_grabado: true,
    en_promocion: false,
    combo: "mate_bombilla",
    color: "bordo",
    categoria: { id: 1, nombre: "Madera", slug: "madera" },
    imagen: [{ id: 5, url: "/demo-products/torpedo-premium.png" }],
    variantes: [
      { id: 401, nombre: "Bordo", stock: 6, precio: 46000, codigo_color: "#7B1F2A", indice_imagen: 0 },
    ],
    opinions: [
      { id: 2, Puntuacion: 4, Texto: "Se siente robusto y queda muy bien para regalo.", createdAt: "2026-03-28" },
    ],
  },
];

const homeData = [
  {
    id: 1,
    titulo: "Mate Unico",
    subtitulo: "Mates artesanales con estilo propio, listos para regalar o disfrutar todos los dias.",
    cta_texto: "Ver productos",
    cta_link: "/productos",
    imagen_hero: [{ id: 1, url: "/demo-products/hero-mates.jpg", alternativeText: "Mates artesanales" }],
  },
];

const faqData = [
  {
    id: 1,
    secciones: [
      {
        id: 1,
        titulo: "Como funcionan los envios?",
        descripcion: [{ type: "paragraph", children: [{ type: "text", text: "Calculamos un costo estimado segun codigo postal durante el checkout." }] }],
      },
      {
        id: 2,
        titulo: "Puedo personalizar mi mate?",
        descripcion: [{ type: "paragraph", children: [{ type: "text", text: "Algunos productos permiten grabado personalizado desde la pagina de detalle." }] }],
      },
      {
        id: 3,
        titulo: "Que medios de pago aceptan?",
        descripcion: [{ type: "paragraph", children: [{ type: "text", text: "La demo puede redirigir a Mercado Pago si se configura el access token." }] }],
      },
    ],
    imagen_footer: { id: 2, url: "/demo-products/hero-mates.jpg" },
  },
];

function bySlug(path: string) {
  const match = path.match(/filters\[slug\]\[\$eq\]=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function filterProducts(path: string) {
  let products = [...demoProducts];
  const slug = bySlug(path);

  if (slug) products = products.filter((product) => product.slug === slug);
  if (path.includes("filters[destacado][$eq]=true")) {
    products = products.filter((product) => product.destacado);
  }
  if (path.includes("filters[en_promocion][$eq]=true")) {
    products = products.filter((product) => product.en_promocion);
  }

  return products;
}

export function getDemoResponse(path: string, options: RequestInit = {}) {
  const cleanPath = path.replace(/^\/api/, "");

  if (cleanPath.startsWith("/homes")) return { data: homeData };
  if (cleanPath.startsWith("/faq-pages")) return { data: faqData };
  if (cleanPath.startsWith("/productos")) return { data: filterProducts(cleanPath) };

  if (cleanPath.startsWith("/ordens") && options.method?.toUpperCase() === "POST") {
    return { data: { id: `DEMO-${Date.now()}` } };
  }

  return { data: [] };
}
