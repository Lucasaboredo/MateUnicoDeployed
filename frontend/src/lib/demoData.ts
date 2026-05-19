type DemoImage = {
  id: number;
  url: string;
  alternativeText?: string;
};

const mateGroups = [
  { base: "1", name: "Imperial Premium", category: "Madera", color: "marron", combo: "mate_bombilla", promo: true },
  { base: "2", name: "Camionero Clasico", category: "Madera", color: "marron", combo: "mate", promo: false },
  { base: "3", name: "Torpedo Artesanal", category: "Calabaza", color: "marron", combo: "mate_bombilla", promo: false },
  { base: "4", name: "Imperial Bordo", category: "Madera", color: "bordo", combo: "mate_bombilla_bolso", promo: true },
  { base: "5", name: "Calabaza Premium", category: "Calabaza", color: "marron", combo: "mate", promo: false },
  { base: "6", name: "Camionero Negro", category: "Madera", color: "negro", combo: "mate_bombilla", promo: true },
  { base: "7", name: "Torpedo Natural", category: "Calabaza", color: "marron", combo: "mate_bombilla", promo: false },
  { base: "8", name: "Imperial Cincelado", category: "Metal", color: "gris", combo: "mate_bombilla_bolso", promo: false },
  { base: "9", name: "Mate Urbano", category: "Metal", color: "negro", combo: "mate", promo: true },
  { base: "10", name: "Calabaza Criolla", category: "Calabaza", color: "marron", combo: "mate_bombilla", promo: false },
  { base: "11", name: "Torpedo Deluxe", category: "Madera", color: "bordo", combo: "mate_bombilla_bolso", promo: true },
  { base: "12", name: "Imperial Natural", category: "Madera", color: "marron", combo: "mate_bombilla", promo: false },
  { base: "13", name: "Camionero Especial", category: "Madera", color: "negro", combo: "mate", promo: false },
];

const pairedImages = new Set(["5", "6", "7", "8"]);

const demoProducts = mateGroups.map((mate, index) => {
  const id = index + 1;
  const price = 30000 + id * 1800;
  const images = [
    { id: id * 10, url: `/mates/${mate.base}.jpg` },
    ...(pairedImages.has(mate.base)
      ? [{ id: id * 10 + 1, url: `/mates/${mate.base}.1.jpg` }]
      : []),
  ];

  return {
    id,
    documentId: `demo-mate-${mate.base}`,
    nombre: mate.name,
    descripcion:
      "Mate seleccionado para la demo de Mate Unico, con terminacion artesanal y presencia cuidada para mostrar el catalogo desplegado.",
    precioBase: price,
    material: mate.category,
    activo: true,
    slug: mate.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-"),
    destacado: id <= 4 || id === 11 || id === 13,
    permite_grabado: mate.category !== "Metal",
    en_promocion: mate.promo,
    precio_oferta: mate.promo ? price - 3500 : undefined,
    combo: mate.combo,
    color: mate.color,
    categoria: { id, nombre: mate.category, slug: mate.category.toLowerCase() },
    imagen: images,
    variantes: [
      {
        id: id * 100 + 1,
        nombre: mate.color === "negro" ? "Negro" : mate.color === "bordo" ? "Bordo" : "Natural",
        stock: id % 4 === 0 ? 3 : 8 + id,
        precio: price,
        codigo_color:
          mate.color === "negro" ? "#111111" : mate.color === "bordo" ? "#7B1F2A" : mate.color === "gris" ? "#777777" : "#8B5E34",
        indice_imagen: 0,
      },
    ],
    opinions:
      id <= 3
        ? [
            {
              id,
              Puntuacion: id === 2 ? 4 : 5,
              Texto: "Muy buena terminacion y excelente presentacion.",
              createdAt: "2026-04-10",
            },
          ]
        : [],
  };
});

const homeData = [
  {
    id: 1,
    titulo: "Mate Unico",
    subtitulo: "Mates artesanales con estilo propio, listos para regalar o disfrutar todos los dias.",
    cta_texto: "Ver productos",
    cta_link: "/productos",
    imagen_hero: [
      { id: 1, url: "/banner-perfil.png", alternativeText: "Banner Mate Unico" },
      { id: 2, url: "/mates/banner2.png", alternativeText: "Banner de productos Mate Unico" },
    ] satisfies DemoImage[],
  },
];

const faqData = [
  {
    id: 1,
    secciones: [
      {
        id: 1,
        titulo: "Como funcionan los envios?",
        descripcion: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Calculamos un costo estimado segun codigo postal durante el checkout." }],
          },
        ],
      },
      {
        id: 2,
        titulo: "Puedo personalizar mi mate?",
        descripcion: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Algunos productos permiten grabado personalizado desde la pagina de detalle." }],
          },
        ],
      },
      {
        id: 3,
        titulo: "Que medios de pago aceptan?",
        descripcion: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "La demo puede redirigir a Mercado Pago si se configura el access token." }],
          },
        ],
      },
    ],
    imagen_footer: { id: 2, url: "/mates/fyq.png" },
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
