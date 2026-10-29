/**
 * catalogo.js - VANDER STORE
 * Definición estructurada del catálogo oficial de 30 productos para prevención y emergencia.
 * Cumple con los requisitos del PDR (Sección 6).
 */

export const CATEGORIAS = [
  { id: 'all', nombre: 'Todas las categorías', slug: 'todas', icon: '📦' },
  { id: 'iluminacion', nombre: 'Iluminación y energía', slug: 'iluminacion-energia', icon: '🔦' },
  { id: 'lluvias', nombre: 'Protección contra lluvias', slug: 'proteccion-lluvias', icon: '🌧️' },
  { id: 'primeros-auxilios', nombre: 'Primeros auxilios', slug: 'primeros-auxilios', icon: '🩹' },
  { id: 'agua-higiene', nombre: 'Agua e higiene', slug: 'agua-higiene', icon: '💧' },
  { id: 'herramientas', nombre: 'Herramientas de emergencia', slug: 'herramientas-emergencia', icon: '🛠️' },
  { id: 'kits', nombre: 'Kits de emergencia', slug: 'kits-emergencia', icon: '🎒' }
];

export const CATALOGO_INICIAL = [
  // 6.1. Iluminación y energía
  {
    id: 'prod-01',
    name: 'Linterna LED portátil',
    category: 'Iluminación y energía',
    categoryId: 'iluminacion',
    price: 25.90,
    cents: 2590,
    stock: 24,
    active: true,
    description: 'Linterna para uso doméstico y cortes de energía.',
    features: ['Haz de luz concentrado de largo alcance', 'Cuerpo ergonómico antideslizante', 'Bajo consumo de batería', 'Ideal para cortes repentinos'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-02',
    name: 'Linterna recargable USB',
    category: 'Iluminación y energía',
    categoryId: 'iluminacion',
    price: 39.90,
    cents: 3990,
    stock: 18,
    active: true,
    description: 'Linterna portátil recargable.',
    features: ['Batería interna de litio recargable por cable Micro-USB/Tipo C', 'Indicador LED de nivel de carga', '3 modos: alta, media y estroboscópica', 'Cuerpo de aluminio resistente a salpicaduras'],
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-03',
    name: 'Lámpara LED de emergencia',
    category: 'Iluminación y energía',
    categoryId: 'iluminacion',
    price: 34.90,
    cents: 3490,
    stock: 15,
    active: true,
    description: 'Iluminación portátil para el hogar.',
    features: ['Difusor omnidireccional 360 grados', 'Asa plegable para colgar o transportar', 'Autonomía prolongada para habitaciones y salas comunes'],
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-04',
    name: 'Power bank de 10 000 mAh',
    category: 'Iluminación y energía',
    categoryId: 'iluminacion',
    price: 59.90,
    cents: 5990,
    stock: 20,
    active: true,
    description: 'Batería externa para dispositivos compatibles.',
    features: ['Capacidad de 10 000 mAh para 2-3 recargas completas de smartphone', 'Salida doble USB-A de carga rápida', 'Circuito de protección contra sobrecarga'],
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-05',
    name: 'Radio portátil de emergencia',
    category: 'Iluminación y energía',
    categoryId: 'iluminacion',
    price: 69.90,
    cents: 6990,
    stock: 12,
    active: true,
    description: 'Radio portátil para recibir información.',
    features: ['Sintonizador de bandas AM/FM con antena telescópica', 'Altavoz de alta fidelidad y conector de auriculares', 'Funciona con pilas estándar para contingencias climáticas'],
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-06',
    name: 'Pilas alcalinas, paquete',
    category: 'Iluminación y energía',
    categoryId: 'iluminacion',
    price: 12.90,
    cents: 1290,
    stock: 40,
    active: true,
    description: 'Pilas para dispositivos compatibles.',
    features: ['Paquete de 4 pilas alcalinas tipo AA de larga duración', 'Retención de carga hasta por 10 años en almacenamiento seguro', 'Voltaje constante de 1.5V'],
    image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },

  // 6.2. Protección contra lluvias
  {
    id: 'prod-07',
    name: 'Poncho impermeable',
    category: 'Protección contra lluvias',
    categoryId: 'lluvias',
    price: 15.90,
    cents: 1590,
    stock: 50,
    active: true,
    description: 'Protección personal para la lluvia.',
    features: ['Material PVC impermeable sellado térmicamente', 'Capucha incorporada con cordón de ajuste', 'Plegado ultra compacto para llevar en mochila'],
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-08',
    name: 'Impermeable reutilizable con capucha',
    category: 'Protección contra lluvias',
    categoryId: 'lluvias',
    price: 39.90,
    cents: 3990,
    stock: 25,
    active: true,
    description: 'Prenda de protección contra la lluvia.',
    features: ['Tejido EVA ecológico de mayor calibre y durabilidad', 'Botones frontales a presión antioxidantes', 'Mangas amplias y bolsillos frontales con solapa'],
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-09',
    name: 'Botas de lluvia',
    category: 'Protección contra lluvias',
    categoryId: 'lluvias',
    price: 49.90,
    cents: 4990,
    stock: 16,
    active: true,
    hasSizes: true,
    sizes: ['38', '39', '40', '41', '42'],
    description: 'Calzado impermeable, con tallas configurables.',
    features: ['Goma PVC 100% impermeable de una sola pieza', 'Suela estriada antideslizante para barro y charcos', 'Caña alta de protección hasta media pierna'],
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-10',
    name: 'Paraguas reforzado',
    category: 'Protección contra lluvias',
    categoryId: 'lluvias',
    price: 29.90,
    cents: 2990,
    stock: 30,
    active: true,
    description: 'Paraguas para uso cotidiano.',
    features: ['Estructura reforzada con varillas de fibra de vidrio flexibles anti-viento', 'Apertura automática con botón pulsador', 'Tela de secado rápido con repelencia de agua'],
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-11',
    name: 'Mochila impermeable',
    category: 'Protección contra lluvias',
    categoryId: 'lluvias',
    price: 69.90,
    cents: 6990,
    stock: 14,
    active: true,
    description: 'Mochila para proteger pertenencias.',
    features: ['Capacidad de 25L fabricada en lona técnica estanca', 'Cremalleras termoselladas contra filtraciones', 'Compartimento acolchado para documentos y tecnología'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-12',
    name: 'Cubierta impermeable para mochila',
    category: 'Protección contra lluvias',
    categoryId: 'lluvias',
    price: 19.90,
    cents: 1990,
    stock: 35,
    active: true,
    description: 'Cubierta protectora para mochilas compatibles.',
    features: ['Borde elástico adaptable a mochilas de 20 a 35 litros', 'Tejido de nailon ripstop con recubrimiento impermeable', 'Detalle reflectante para visibilidad nocturna'],
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },

  // 6.3. Primeros auxilios
  {
    id: 'prod-13',
    name: 'Botiquín básico familiar',
    category: 'Primeros auxilios',
    categoryId: 'primeros-auxilios',
    price: 49.90,
    cents: 4990,
    stock: 22,
    active: true,
    description: 'Conjunto básico de primeros auxilios.',
    features: ['Estuche rígido con cierre de seguridad', 'Contiene alcohol, gasas estériles, vendas, tijera y algodón', 'Guía elemental de primeros auxilios en emergencias'],
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-14',
    name: 'Botiquín familiar completo',
    category: 'Primeros auxilios',
    categoryId: 'primeros-auxilios',
    price: 89.90,
    cents: 8990,
    stock: 12,
    active: true,
    description: 'Presentación ampliada de primeros auxilios.',
    features: ['Estuche de lona de alta resistencia con divisiones organizadas', 'Incluye termómetro digital, antisépticos, apósitos, vendas elásticas y pinza', 'Adecuado para familias de 4 a 6 personas'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-15',
    name: 'Manta térmica de emergencia',
    category: 'Primeros auxilios',
    categoryId: 'primeros-auxilios',
    price: 12.90,
    cents: 1290,
    stock: 45,
    active: true,
    description: 'Manta compacta para un kit de emergencia.',
    features: ['Material Mylar metalizado que retiene hasta el 90% del calor corporal', 'Impermeable, cortavientos y altamente reflectante', 'Tamaño estándar abierta: 210 x 130 cm'],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-16',
    name: 'Vendas y gasas, paquete',
    category: 'Primeros auxilios',
    categoryId: 'primeros-auxilios',
    price: 14.90,
    cents: 1490,
    stock: 30,
    active: true,
    description: 'Materiales básicos para curaciones.',
    features: ['3 vendas elásticas de diferentes anchos', '10 sobres de gasa hidrófila estéril', 'Libre de hilachas para limpieza y vendaje seguro'],
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-17',
    name: 'Esparadrapo médico',
    category: 'Primeros auxilios',
    categoryId: 'primeros-auxilios',
    price: 6.90,
    cents: 690,
    stock: 40,
    active: true,
    description: 'Cinta adhesiva para uso médico según sus indicaciones.',
    features: ['Rollo de cinta hipoalergénica microperforada', 'Fijación segura de apósitos y gasas sin maltratar la piel', 'Fácil de rasgar con los dedos'],
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },

  // 6.4. Agua e higiene
  {
    id: 'prod-18',
    name: 'Bidón para agua de 10 litros',
    category: 'Agua e higiene',
    categoryId: 'agua-higiene',
    price: 29.90,
    cents: 2990,
    stock: 25,
    active: true,
    description: 'Recipiente para almacenar agua potable.',
    features: ['Plástico HDPE virgen grado alimentario libre de BPA', 'Asa reforzada para transporte seguro', 'Tapa a rosca hermética anti-derrames'],
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-19',
    name: 'Bidón para agua de 20 litros',
    category: 'Agua e higiene',
    categoryId: 'agua-higiene',
    price: 44.90,
    cents: 4490,
    stock: 20,
    active: true,
    description: 'Recipiente de mayor capacidad.',
    features: ['Capacidad de 20 litros ideal para reservas familiares ante cortes de servicio', 'Grifo dispensador inferior desmontable', 'Paredes gruesas reforzadas contra impactos'],
    image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-20',
    name: 'Gel antibacterial de 500 ml',
    category: 'Agua e higiene',
    categoryId: 'agua-higiene',
    price: 16.90,
    cents: 1690,
    stock: 35,
    active: true,
    description: 'Producto para higiene de manos.',
    features: ['Fórmula con 70% alcohol etílico y glicerina humectante', 'Dosificador con válvula pump para uso rápido', 'Desinfección de manos cuando no hay acceso a agua corriente'],
    image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-21',
    name: 'Mascarillas descartables, paquete',
    category: 'Agua e higiene',
    categoryId: 'agua-higiene',
    price: 9.90,
    cents: 990,
    stock: 50,
    active: true,
    description: 'Paquete para uso según las indicaciones del fabricante.',
    features: ['Paquete sellado de 50 mascarillas tricapa con filtro bacteriano meltblown', 'Ajuste nasal maleable y elásticos suaves', 'Protección contra polvo, partículas y humedad ambiental'],
    image: 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-22',
    name: 'Bolsas resistentes para residuos, paquete',
    category: 'Agua e higiene',
    categoryId: 'agua-higiene',
    price: 12.90,
    cents: 1290,
    stock: 45,
    active: true,
    description: 'Bolsas para manejo doméstico de residuos.',
    features: ['Paquete de 10 bolsas gruesas calibre pesado de 75 litros', 'Resistencia a desgarros y retención de humedad', 'Para almacenamiento de desechos o protección de pertenencias'],
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },

  // 6.5. Herramientas de emergencia
  {
    id: 'prod-23',
    name: 'Silbato de emergencia',
    category: 'Herramientas de emergencia',
    categoryId: 'herramientas',
    price: 7.90,
    cents: 790,
    stock: 60,
    active: true,
    description: 'Dispositivo para emitir señales sonoras.',
    features: ['Doble tubo sonoro de alta frecuencia (hasta 120 decibeles)', 'Sin bola interna (funciona incluso mojado)', 'Incluye cordón para colgar al cuello'],
    image: 'https://images.unsplash.com/photo-1590483736622-39da86788790?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-24',
    name: 'Cuerda multiuso de 10 metros',
    category: 'Herramientas de emergencia',
    categoryId: 'herramientas',
    price: 19.90,
    cents: 1990,
    stock: 25,
    active: true,
    description: 'Cuerda para usos generales; no certificada para escalada.',
    features: ['Polipropileno trenzado de 8 mm resistente al desgaste', 'Para amarres domésticos, toldos o sujeción de lonas', 'Aclaración de seguridad: no certificada para escalada o rescate de carga pesada'],
    image: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-25',
    name: 'Guantes de trabajo',
    category: 'Herramientas de emergencia',
    categoryId: 'herramientas',
    price: 14.90,
    cents: 1490,
    stock: 35,
    active: true,
    description: 'Guantes para tareas domésticas y limpieza.',
    features: ['Palma con recubrimiento de látex corrugado para agarre firme', 'Dorso de tejido transpirable', 'Protege contra rozaduras y astillas en limpieza tras inundación'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-26',
    name: 'Cinta de señalización',
    category: 'Herramientas de emergencia',
    categoryId: 'herramientas',
    price: 12.90,
    cents: 1290,
    stock: 30,
    active: true,
    description: 'Cinta para delimitar áreas temporalmente.',
    features: ['Rollo de 50 metros en polietileno amarillo/negro de alta visibilidad', 'Resistente a la intemperie y rayos UV', 'Para delimitar zanjas o zonas de filtración'],
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-27',
    name: 'Herramienta manual multiuso',
    category: 'Herramientas de emergencia',
    categoryId: 'herramientas',
    price: 24.90,
    cents: 2490,
    stock: 20,
    active: true,
    description: 'Herramienta para tareas generales según sus características reales.',
    features: ['Acero inoxidable con alicate, destornilladores plano y cruz, abrelatas y lima', 'Bloqueo seguro y mango ergonómico', 'Funda de transporte incluida'],
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },

  // 6.6. Kits de emergencia
  {
    id: 'prod-28',
    name: 'Kit individual de emergencia',
    category: 'Kits de emergencia',
    categoryId: 'kits',
    price: 49.90,
    cents: 4990,
    stock: 18,
    active: true,
    description: 'Kit compuesto por linterna, silbato y manta térmica.',
    features: ['1 Linterna LED compacta', '1 Silbato de alta resonancia con cordón', '1 Manta térmica Mylar cortavientos', 'Estuche individual estanco de transporte'],
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-29',
    name: 'Kit familiar para lluvias',
    category: 'Kits de emergencia',
    categoryId: 'kits',
    price: 99.90,
    cents: 9990,
    stock: 15,
    active: true,
    description: 'Kit compuesto por ponchos, linterna y productos básicos.',
    features: ['4 Ponchos impermeables termosellados con capucha', '1 Linterna recargable USB', '1 Paquete de bolsas resistentes de 75L', '1 Silbato de emergencia', 'Bolsa protectora impermeable'],
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  },
  {
    id: 'prod-30',
    name: 'Kit familiar de emergencia completo',
    category: 'Kits de emergencia',
    categoryId: 'kits',
    price: 179.90,
    cents: 17990,
    stock: 10,
    active: true,
    description: 'Selección de artículos de preparación familiar.',
    features: ['1 Botiquín básico familiar', '1 Lámpara LED de emergencia 360°', '4 Ponchos impermeables', '2 Mantas térmicas metalizadas', '1 Radio portátil de emergencia AM/FM', '1 Silbato de emergencia'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    updatedAt: '2026-10-28'
  }
];

/**
 * Normaliza cadenas quitando acentos y signos diacríticos, pasando a minúsculas.
 */
function normalizarTexto(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Filtra y ordena los productos en memoria sin modificar los datos originales.
 */
export function filtrarCatalogo(productos, { categoria = 'all', busqueda = '', minPrecio = 0, maxPrecio = Infinity, orden = 'relevancia', disponibilidad = 'all' } = {}) {
  const terminoNormalizado = normalizarTexto(busqueda);

  const filtrados = productos.filter(p => {
    // 1. Categoría
    if (categoria !== 'all' && p.categoryId !== categoria) return false;

    // 2. Disponibilidad
    if (disponibilidad === 'in-stock' && p.stock <= 0) return false;
    if (disponibilidad === 'out-stock' && p.stock > 0) return false;

    // 3. Rango de precio
    if (p.price < minPrecio) return false;
    if (maxPrecio !== Infinity && p.price > maxPrecio) return false;

    // 4. Búsqueda insensible a mayúsculas, acentos y espacios
    if (terminoNormalizado) {
      const nameNorm = normalizarTexto(p.name);
      const descNorm = normalizarTexto(p.description);
      const catNorm = normalizarTexto(p.category);
      const featuresNorm = normalizarTexto((p.features || []).join(' '));

      const matchName = nameNorm.includes(terminoNormalizado);
      const matchDesc = descNorm.includes(terminoNormalizado);
      const matchCat = catNorm.includes(terminoNormalizado);
      const matchFeatures = featuresNorm.includes(terminoNormalizado);

      if (!matchName && !matchDesc && !matchCat && !matchFeatures) return false;
    }

    return true;
  });

  // Ordenamiento
  switch (orden) {
    case 'precio-asc':
      filtrados.sort((a, b) => a.cents - b.cents);
      break;
    case 'precio-desc':
      filtrados.sort((a, b) => b.cents - a.cents);
      break;
    case 'nombre-asc':
      filtrados.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      break;
    case 'relevancia':
    default:
      // Conserva el orden oficial del PDR
      break;
  }

  return filtrados;
}

/**
 * Formatea un precio numérico a soles peruanos con 2 decimales.
 * Formato requerido: S/ 25.90
 */
export function formatearMoneda(monto) {
  const val = Number(monto) || 0;
  return `S/ ${val.toFixed(2)}`;
}
