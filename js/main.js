/**
 * main.js - VANDER STORE
 * Controlador principal de la tienda comercial en JavaScript ES6+ nativo sin dependencias.
 */

import { CATEGORIAS, CATALOGO_INICIAL, filtrarCatalogo, formatearMoneda } from './catalogo.js';
import { CarritoCompras } from './carrito.js';
import { CheckoutManager } from './checkout.js';
import { validarCampo } from './validaciones.js';
import { enviarContactoFormspree } from './api.js';

// Sistema de Notificaciones Toast Accesibles
function mostrarToast(mensaje, tipo = 'info', duracion = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${tipo}`;
  toast.setAttribute('role', 'status');
  toast.textContent = mensaje;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  }, duracion);
}

// Controlador de Diálogos Modales Accesibles (WCAG 2.1 AA)
class ModalAccesible {
  constructor(overlayId) {
    this.overlay = document.getElementById(overlayId);
    this.closeButtons = this.overlay ? this.overlay.querySelectorAll('[data-close-modal]') : [];
    this.lastFocused = null;
    this.init();
  }

  init() {
    if (!this.overlay) return;

    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (this.isOpen() && e.key === 'Escape') {
        this.close();
      }
    });
  }

  isOpen() {
    return this.overlay && this.overlay.classList.contains('is-open');
  }

  open() {
    if (!this.overlay) return;
    this.lastFocused = document.activeElement;
    this.overlay.classList.add('is-open');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const focusable = this.overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 60);
    }
  }

  close() {
    if (!this.overlay || !this.isOpen()) return;
    this.overlay.classList.remove('is-open');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (this.lastFocused && typeof this.lastFocused.focus === 'function') {
      this.lastFocused.focus();
    }
  }
}

// Inicialización de la aplicación cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {

  // 1. Modales
  const cartModal = new ModalAccesible('cart-modal');
  const detailModal = new ModalAccesible('product-detail-modal');
  const checkoutModal = new ModalAccesible('checkout-modal');

  // 2. Carrito de Compras
  const carrito = new CarritoCompras({
    onUpdate: (cart) => actualizarVistaCarrito(cart),
    onNotify: (msg, tipo) => mostrarToast(msg, tipo)
  });

  // 3. Gestor de Checkout
  const checkoutManager = new CheckoutManager(carrito, checkoutModal, (msg, tipo) => mostrarToast(msg, tipo));

  // 4. Estado de Filtros del Catálogo
  const estadoFiltros = {
    categoria: 'all',
    busqueda: '',
    minPrecio: 0,
    maxPrecio: Infinity,
    orden: 'relevancia',
    disponibilidad: 'all'
  };

  // 5. Elementos del DOM
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const productsGrid = document.getElementById('products-grid');
  const productCountEl = document.getElementById('catalog-products-count');
  const searchInput = document.getElementById('header-search-input');
  const searchForm = document.getElementById('header-search-form');
  const clearSearchBtn = document.getElementById('header-search-clear');
  const sortSelect = document.getElementById('sort-select');
  const minPriceInput = document.getElementById('filter-min-price');
  const maxPriceInput = document.getElementById('filter-max-price');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const categoryPillsContainer = document.getElementById('category-pills-container');
  const featuredCategoriesContainer = document.getElementById('featured-categories-grid');

  // Menú Hamburguesa Móvil
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isExp = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExp));
      mobileNav.classList.toggle('is-open');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
      });
    });
  }

  // Renderizar Categorías Destacadas en la página de inicio
  if (featuredCategoriesContainer) {
    featuredCategoriesContainer.innerHTML = CATEGORIAS.filter(c => c.id !== 'all').map(cat => {
      const count = CATALOGO_INICIAL.filter(p => p.categoryId === cat.id).length;
      return `
        <article class="category-card" data-cat-id="${cat.id}" role="button" tabindex="0" aria-label="Ver productos de ${cat.nombre}">
          <div class="category-card__icon" aria-hidden="true">${cat.icon}</div>
          <h3 class="category-card__title">${cat.nombre}</h3>
          <span class="category-card__count">${count} productos</span>
        </article>
      `;
    }).join('');

    featuredCategoriesContainer.querySelectorAll('.category-card').forEach(card => {
      const handleClick = () => {
        const catId = card.dataset.catId;
        seleccionarCategoria(catId);
        const catalogoSection = document.getElementById('catalogo');
        if (catalogoSection) {
          catalogoSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
      card.addEventListener('click', handleClick);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      });
    });
  }

  // Renderizar Pills de Filtros por Categoría
  if (categoryPillsContainer) {
    categoryPillsContainer.innerHTML = CATEGORIAS.map(cat => `
      <button 
        type="button" 
        class="pill-btn ${cat.id === 'all' ? 'is-active' : ''}" 
        data-cat-pill="${cat.id}">
        ${cat.icon} ${cat.nombre}
      </button>
    `).join('');

    categoryPillsContainer.querySelectorAll('[data-cat-pill]').forEach(btn => {
      btn.addEventListener('click', () => {
        seleccionarCategoria(btn.dataset.catPill);
      });
    });
  }

  function seleccionarCategoria(catId) {
    estadoFiltros.categoria = catId;
    if (categoryPillsContainer) {
      categoryPillsContainer.querySelectorAll('[data-cat-pill]').forEach(b => {
        b.classList.toggle('is-active', b.dataset.catPill === catId);
      });
    }
    renderizarProductos();
  }

  // Renderizar Tarjetas de Productos en el Catálogo
  function renderizarProductos() {
    if (!productsGrid) return;

    const productosFiltrados = filtrarCatalogo(CATALOGO_INICIAL, estadoFiltros);
    const catalogPretitle = document.getElementById('catalog-pretitle');
    const catalogTitle = document.getElementById('catalog-title');
    const catalogDesc = document.getElementById('catalog-desc');

    const tieneBusqueda = Boolean(estadoFiltros.busqueda && estadoFiltros.busqueda.trim());

    if (tieneBusqueda) {
      const termino = estadoFiltros.busqueda.trim();
      if (catalogPretitle) catalogPretitle.textContent = 'Resultados de Búsqueda';
      if (catalogTitle) catalogTitle.textContent = `Resultados para: "${termino}"`;
      if (catalogDesc) {
        catalogDesc.textContent = productosFiltrados.length > 0 
          ? `Se encontraron ${productosFiltrados.length} producto(s) coincidentes en el catálogo.`
          : `No se encontraron artículos con el término "${termino}".`;
      }
    } else {
      if (catalogPretitle) catalogPretitle.textContent = 'Catálogo Completo';
      if (catalogTitle) catalogTitle.textContent = 'Artículos de Prevención y Emergencia';
      if (catalogDesc) {
        catalogDesc.textContent = 'Revisa las características, disponibilidad y precios de nuestras 30 soluciones activas.';
      }
    }

    if (productCountEl) {
      productCountEl.textContent = `${productosFiltrados.length} de ${CATALOGO_INICIAL.length} productos`;
    }

    if (productosFiltrados.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-catalog">
          <h3 class="empty-catalog__title">No se encontraron productos ${tieneBusqueda ? `para "${estadoFiltros.busqueda.trim()}"` : ''}</h3>
          <p class="empty-catalog__text">Intenta con otro término (ejemplo: "linterna", "impermeable", "botiquín") o restablece los filtros para ver todos los artículos.</p>
          <button type="button" class="btn btn--primary btn--sm" id="empty-reset-btn">Ver catálogo completo</button>
        </div>
      `;
      const btnReset = document.getElementById('empty-reset-btn');
      if (btnReset) {
        btnReset.addEventListener('click', restablecerFiltros);
      }
      return;
    }

    productsGrid.innerHTML = productosFiltrados.map(prod => `
      <article class="product-card" id="card-${prod.id}">
        <div class="product-card__thumb">
          <img 
            src="${prod.image}" 
            alt="Fotografía de ${prod.name}" 
            class="product-card__img"
            loading="lazy" 
            width="400" 
            height="300"
          />
          <span class="product-card__category-tag">${prod.category}</span>
          <span class="product-card__stock-tag ${prod.stock > 0 ? 'stock-tag--available' : 'stock-tag--out'}">
            ${prod.stock > 0 ? `Stock: ${prod.stock}` : 'Agotado'}
          </span>
        </div>
        <div class="product-card__body">
          <h3 class="product-card__title">${prod.name}</h3>
          <p class="product-card__desc">${prod.description}</p>
          <div class="product-card__footer">
            <div class="product-card__price-row">
              <span class="product-card__price-label">Precio:</span>
              <span class="product-card__price">${formatearMoneda(prod.price)}</span>
            </div>
            <div class="product-card__btn-group">
              <button 
                type="button" 
                class="btn btn--outline btn--sm" 
                data-action="ver-detalle" 
                data-id="${prod.id}"
                aria-label="Ver detalles y características de ${prod.name}">
                Ver detalles
              </button>
              <button 
                type="button" 
                class="btn btn--primary btn--sm" 
                data-action="agregar-carrito" 
                data-id="${prod.id}"
                ${prod.stock <= 0 ? 'disabled' : ''}
                aria-label="Agregar ${prod.name} al carrito">
                Agregar
              </button>
            </div>
          </div>
        </div>
      </article>
    `).join('');

    // Event delegation para botones de acción dentro de las tarjetas
    productsGrid.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const producto = CATALOGO_INICIAL.find(p => p.id === id);
        if (!producto) return;

        if (action === 'agregar-carrito') {
          carrito.agregarProducto(producto, 1);
        } else if (action === 'ver-detalle') {
          abrirDetalleProducto(producto);
        }
      });
    });
  }

  // Modal de Detalle de Producto
  function abrirDetalleProducto(producto) {
    const titleEl = document.getElementById('modal-prod-title');
    const catEl = document.getElementById('modal-prod-category');
    const descEl = document.getElementById('modal-prod-desc');
    const priceEl = document.getElementById('modal-prod-price');
    const stockEl = document.getElementById('modal-prod-stock');
    const imgEl = document.getElementById('modal-prod-img');
    const featuresListEl = document.getElementById('modal-prod-features');
    const variantBox = document.getElementById('modal-prod-variants');
    const qtyInput = document.getElementById('modal-prod-qty');
    const addBtn = document.getElementById('modal-prod-add-btn');

    if (titleEl) titleEl.textContent = producto.name;
    if (catEl) catEl.textContent = producto.category;
    if (descEl) descEl.textContent = producto.description;
    if (priceEl) priceEl.textContent = formatearMoneda(producto.price);
    if (stockEl) {
      stockEl.textContent = producto.stock > 0 ? `Stock disponible: ${producto.stock} unidades` : 'Agotado';
      stockEl.className = producto.stock > 0 ? 'stock-tag--available' : 'stock-tag--out';
    }
    if (imgEl) {
      imgEl.src = producto.image;
      imgEl.alt = `Vista detallada de ${producto.name}`;
    }

    if (featuresListEl) {
      featuresListEl.innerHTML = (producto.features || []).map(f => `<li>${f}</li>`).join('');
    }

    // Variantes (ej. Botas de lluvia)
    let selectedVariant = null;
    if (variantBox) {
      if (producto.hasSizes && Array.isArray(producto.sizes)) {
        selectedVariant = producto.sizes[0];
        variantBox.style.display = 'block';
        variantBox.innerHTML = `
          <label style="font-size: 0.8rem; font-weight: 700;">Talla disponible:</label>
          <div class="variant-options">
            ${producto.sizes.map((s, idx) => `
              <button type="button" class="variant-btn ${idx === 0 ? 'is-selected' : ''}" data-size="${s}">${s}</button>
            `).join('')}
          </div>
        `;
        variantBox.querySelectorAll('.variant-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            variantBox.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('is-selected'));
            btn.classList.add('is-selected');
            selectedVariant = btn.dataset.size;
          });
        });
      } else {
        variantBox.style.display = 'none';
        variantBox.innerHTML = '';
      }
    }

    if (qtyInput) {
      qtyInput.value = '1';
      qtyInput.max = producto.stock;
    }

    if (addBtn) {
      addBtn.disabled = producto.stock <= 0;
      const newBtn = addBtn.cloneNode(true);
      addBtn.parentNode.replaceChild(newBtn, addBtn);
      newBtn.addEventListener('click', () => {
        const qty = Math.max(1, Math.min(Number(qtyInput ? qtyInput.value : 1), producto.stock));
        carrito.agregarProducto(producto, qty, selectedVariant);
        detailModal.close();
      });
    }

    detailModal.open();
  }

  // Actualización del Carrito en el DOM
  function actualizarVistaCarrito(cart) {
    const badge = document.getElementById('cart-badge');
    const itemsList = document.getElementById('cart-items-list');
    const emptyBox = document.getElementById('cart-empty-state');
    const contentBox = document.getElementById('cart-content-wrapper');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('cart-proceed-checkout');
    const clearBtn = document.getElementById('cart-clear-btn');

    const totalCount = cart.contarTotalArticulos();
    const items = cart.obtenerItems();

    if (badge) {
      badge.textContent = String(totalCount);
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
      badge.setAttribute('aria-label', `${totalCount} artículos en el carrito`);
    }

    if (items.length === 0) {
      if (emptyBox) emptyBox.style.display = 'block';
      if (contentBox) contentBox.style.display = 'none';
      if (checkoutBtn) checkoutBtn.setAttribute('disabled', 'true');
      return;
    }

    if (emptyBox) emptyBox.style.display = 'none';
    if (contentBox) contentBox.style.display = 'block';
    if (checkoutBtn) checkoutBtn.removeAttribute('disabled');

    if (itemsList) {
      itemsList.innerHTML = items.map(item => `
        <li class="cart-row">
          <img src="${item.image}" alt="${item.name}" class="cart-row__img" />
          <div class="cart-row__info">
            <span class="cart-row__name">${item.name} ${item.variant ? `(Talla: ${item.variant})` : ''}</span>
            <span class="cart-row__price">P.U: ${formatearMoneda(item.price)}</span>
            <div class="cart-row__controls">
              <button type="button" class="qty-btn" data-cart-action="dec" data-key="${item.key}" aria-label="Disminuir cantidad de ${item.name}">-</button>
              <span class="cart-row__qty-num">${item.quantity}</span>
              <button type="button" class="qty-btn" data-cart-action="inc" data-key="${item.key}" aria-label="Aumentar cantidad de ${item.name}">+</button>
            </div>
          </div>
          <div class="cart-row__actions">
            <span class="cart-row__line-total">${formatearMoneda(item.price * item.quantity)}</span>
            <button type="button" class="cart-delete-btn" data-cart-action="del" data-key="${item.key}">Eliminar</button>
          </div>
        </li>
      `).join('');

      itemsList.querySelectorAll('[data-cart-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.key;
          const action = btn.dataset.cartAction;
          if (action === 'inc') cart.actualizarCantidad(key, 1);
          if (action === 'dec') cart.actualizarCantidad(key, -1);
          if (action === 'del') cart.eliminarItem(key);
        });
      });
    }

    if (subtotalEl) subtotalEl.textContent = formatearMoneda(cart.calcularSubtotalSoles());
    if (totalEl) totalEl.textContent = formatearMoneda(cart.calcularTotalSoles());

    if (clearBtn) {
      clearBtn.onclick = () => cart.vaciar();
    }
  }

  // Disparador del carrito en la cabecera
  const openCartBtn = document.getElementById('open-cart-btn');
  if (openCartBtn) {
    openCartBtn.addEventListener('click', () => cartModal.open());
  }

  // Continuar compra desde el carrito
  const proceedCheckoutBtn = document.getElementById('cart-proceed-checkout');
  if (proceedCheckoutBtn) {
    proceedCheckoutBtn.addEventListener('click', () => {
      cartModal.close();
      checkoutManager.iniciarCheckout();
    });
  }

  // Buscador de la Cabecera (Sección 5.5 del PDR y Requisitos de Búsqueda)
  const ejecutarBusqueda = (hacerScroll = true) => {
    const termino = searchInput ? searchInput.value.trim() : '';
    estadoFiltros.busqueda = termino;

    // Al buscar globalmente desde la cabecera, se busca en todo el catálogo
    // para no bloquear resultados en categorías previamente seleccionadas
    if (termino) {
      estadoFiltros.categoria = 'all';
      if (categoryPillsContainer) {
        categoryPillsContainer.querySelectorAll('[data-cat-pill]').forEach(b => {
          b.classList.toggle('is-active', b.dataset.catPill === 'all');
        });
      }
    }

    if (clearSearchBtn) {
      clearSearchBtn.style.display = termino ? 'block' : 'none';
    }

    renderizarProductos();

    // Desplazamiento suave hasta la sección de resultados para que el usuario los vea inmediatamente
    if (hacerScroll) {
      const catalogoSection = document.getElementById('catalogo');
      if (catalogoSection) {
        catalogoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      ejecutarBusqueda(true);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      estadoFiltros.busqueda = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = estadoFiltros.busqueda ? 'block' : 'none';
      }
      renderizarProductos();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      estadoFiltros.busqueda = '';
      clearSearchBtn.style.display = 'none';
      renderizarProductos();
      if (searchInput) searchInput.focus();
    });
  }

  // Ordenamiento
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      estadoFiltros.orden = e.target.value;
      renderizarProductos();
    });
  }

  // Filtros de Precio
  if (minPriceInput) {
    minPriceInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      estadoFiltros.minPrecio = isNaN(val) ? 0 : val;
      renderizarProductos();
    });
  }

  if (maxPriceInput) {
    maxPriceInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      estadoFiltros.maxPrecio = isNaN(val) ? Infinity : val;
      renderizarProductos();
    });
  }

  function restablecerFiltros() {
    estadoFiltros.categoria = 'all';
    estadoFiltros.busqueda = '';
    estadoFiltros.minPrecio = 0;
    estadoFiltros.maxPrecio = Infinity;
    estadoFiltros.orden = 'relevancia';

    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    if (minPriceInput) minPriceInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';
    if (sortSelect) sortSelect.value = 'relevancia';

    if (categoryPillsContainer) {
      categoryPillsContainer.querySelectorAll('[data-cat-pill]').forEach(b => {
        b.classList.toggle('is-active', b.dataset.catPill === 'all');
      });
    }

    renderizarProductos();
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', restablecerFiltros);
  }

  // Formulario de Contacto (Sección 11 del PDR - Formspree)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const fName = document.getElementById('contact-name');
    const fEmail = document.getElementById('contact-email');
    const fPhone = document.getElementById('contact-phone');
    const fSubject = document.getElementById('contact-subject');
    const fMessage = document.getElementById('contact-message');
    const fStatus = document.getElementById('contact-status-message');
    const fSubmit = document.getElementById('contact-submit-btn');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const v1 = validarCampo(fName, document.getElementById('contact-name-error'));
      const v2 = validarCampo(fEmail, document.getElementById('contact-email-error'));
      const v3 = validarCampo(fMessage, document.getElementById('contact-message-error'));

      if (!v1 || !v2 || !v3) {
        mostrarToast('Por favor complete los campos obligatorios del formulario.', 'warning');
        return;
      }

      const datos = {
        name: fName.value.trim(),
        email: fEmail.value.trim(),
        phone: fPhone ? fPhone.value.trim() : '',
        subject: fSubject ? fSubject.value.trim() : 'Consulta general VANDER STORE',
        message: fMessage.value.trim(),
        _subject: `Nueva consulta web: ${fSubject ? fSubject.value.trim() : 'VANDER STORE'}`
      };

      if (fSubmit) {
        fSubmit.disabled = true;
        fSubmit.textContent = 'Procesando envío...';
      }

      const resultado = await enviarContactoFormspree(datos);

      if (fSubmit) {
        fSubmit.disabled = false;
        fSubmit.textContent = 'Enviar Mensaje';
      }

      if (fStatus) {
        fStatus.style.display = 'block';
        if (resultado.exito) {
          fStatus.className = 'form-status-alert form-status-alert--success';
          fStatus.textContent = resultado.mensaje;
          contactForm.reset();
        } else if (resultado.pendienteConfiguracion) {
          fStatus.className = 'form-status-alert form-status-alert--info';
          fStatus.innerHTML = `<strong>Aviso de Configuración:</strong> ${resultado.mensaje}`;
        } else {
          fStatus.className = 'form-status-alert form-status-alert--error';
          fStatus.textContent = resultado.mensaje;
        }
      }
    });
  }

  // Render inicial
  renderizarProductos();
  actualizarVistaCarrito(carrito);
});
