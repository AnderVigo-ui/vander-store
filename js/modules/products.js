/**
 * products.js - Gestión del catálogo de productos comerciales, filtros y búsqueda
 */

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Consultoría Estratégica Digital',
    category: 'servicios',
    price: 850.00,
    tag: 'Más Solicitado',
    description: 'Diagnóstico exhaustivo y plan de transformación comercial para empresas en crecimiento.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-002',
    name: 'Suite de Automatización CRM',
    category: 'software',
    price: 420.00,
    tag: 'Destacado',
    description: 'Integración centralizada de flujos de venta, canalización de prospectos y métricas en tiempo real.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-003',
    name: 'Auditoría de Ciberseguridad y Cumplimiento',
    category: 'seguridad',
    price: 990.00,
    tag: 'Seguridad',
    description: 'Evaluación de vulnerabilidades web, protocolos de datos sensibles y directivas de privacidad.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-004',
    name: 'Diseño de Identidad de Marca Corporativa',
    category: 'diseno',
    price: 650.00,
    tag: 'Creativo',
    description: 'Manual de marca completo, sistemas tipográficos, iconografía y activos listos para producción.',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-005',
    name: 'Plataforma E-commerce Headless',
    category: 'software',
    price: 1200.00,
    tag: 'Enterprise',
    description: 'Arquitectura modular para comercio electrónico de alto tráfico con pasarelas de pago globales.',
    image: 'https://images.unsplash.com/photo-1556742049-0a67e557224d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-006',
    name: 'Soporte y Mantenimiento Técnico 24/7',
    category: 'servicios',
    price: 290.00,
    tag: 'Mensual',
    description: 'Monitoreo proactivo, parches de seguridad continuos y tiempos de respuesta garantizados por SLA.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80'
  }
];

export function initProducts(onAddToCart, onQuickView) {
  const container = document.getElementById('products-grid');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const searchInput = document.getElementById('product-search');

  if (!container) return;

  let currentCategory = 'all';
  let searchQuery = '';

  const render = () => {
    const filtered = INITIAL_PRODUCTS.filter(item => {
      const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
          <p style="font-size: 1.125rem; font-weight: 500;">No se encontraron productos que coincidan con su búsqueda.</p>
          <button class="btn btn--outline btn--sm" style="margin-top: 1rem;" id="reset-filters-btn">Restablecer filtros</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          filterButtons.forEach(b => b.classList.toggle('filter-btn--active', b.dataset.filter === 'all'));
          render();
        });
      }
      return;
    }

    container.innerHTML = filtered.map(product => `
      <article class="product-card" id="card-${product.id}">
        <div class="product-card__media">
          <img 
            src="${product.image}" 
            alt="Ilustración representativa de ${product.name}" 
            class="product-card__img" 
            loading="lazy"
            width="400"
            height="300"
          />
          ${product.tag ? `<span class="product-card__tag">${product.tag}</span>` : ''}
        </div>
        <div class="product-card__content">
          <span class="product-card__category">${product.category}</span>
          <h3 class="product-card__title">${product.name}</h3>
          <p class="product-card__desc">${product.description}</p>
          <div class="product-card__footer">
            <span class="product-card__price">$${product.price.toFixed(2)} USD</span>
            <div style="display: flex; gap: 0.5rem;">
              <button 
                type="button" 
                class="btn btn--outline btn--sm" 
                data-action="view" 
                data-id="${product.id}"
                aria-label="Ver detalles de ${product.name}">
                Detalles
              </button>
              <button 
                type="button" 
                class="btn btn--primary btn--sm" 
                data-action="add" 
                data-id="${product.id}"
                aria-label="Añadir ${product.name} al carrito">
                Añadir
              </button>
            </div>
          </div>
        </div>
      </article>
    `).join('');

    // Event delegation para botones de acción dentro de las tarjetas
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const product = INITIAL_PRODUCTS.find(p => p.id === id);

        if (!product) return;

        if (action === 'add' && typeof onAddToCart === 'function') {
          onAddToCart(product);
        } else if (action === 'view' && typeof onQuickView === 'function') {
          onQuickView(product);
        }
      });
    });
  };

  // Listeners de botones de filtro por categoría
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      currentCategory = btn.dataset.filter || 'all';
      render();
    });
  });

  // Búsqueda en tiempo real
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      render();
    });
  }

  // Render inicial
  render();
}
