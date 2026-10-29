/**
 * cart.js - Gestión del estado del carrito comercial con persistencia LocalStorage
 */

import { showToast } from './toast.js';

const STORAGE_KEY = 'commercial_cart_items_v1';

export class ShoppingCart {
  constructor(modalInstance) {
    this.modal = modalInstance;
    this.items = this.loadFromStorage();
    this.badgeElement = document.getElementById('cart-badge');
    this.listElement = document.getElementById('cart-items-list');
    this.subtotalElement = document.getElementById('cart-subtotal');
    this.taxElement = document.getElementById('cart-tax');
    this.totalElement = document.getElementById('cart-total');
    this.emptyMessageElement = document.getElementById('cart-empty-message');
    this.cartContentWrapper = document.getElementById('cart-content-wrapper');
    this.checkoutBtn = document.getElementById('cart-checkout-btn');

    this.init();
  }

  init() {
    this.render();

    // Listener para checkout
    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        if (this.items.length === 0) return;
        this.clear();
        this.modal.close();
        showToast('¡Orden generada con éxito! Nos comunicaremos para coordinar la entrega.', 'success', 4500);
      });
    }

    // Botón para abrir el carrito
    const openBtn = document.getElementById('open-cart-btn');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        this.modal.open();
      });
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn('No se pudo guardar el carrito en almacenamiento local', e);
    }
  }

  addItem(product) {
    const existingIndex = this.items.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    this.saveToStorage();
    this.render();
    showToast(`"${product.name}" añadido al carrito`, 'success');
  }

  updateQuantity(productId, delta) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.saveToStorage();
    this.render();
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.saveToStorage();
    this.render();
    showToast('Producto eliminado del carrito', 'info');
  }

  clear() {
    this.items = [];
    this.saveToStorage();
    this.render();
  }

  getTotalCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  render() {
    const count = this.getTotalCount();
    const subtotal = this.getSubtotal();
    const tax = subtotal * 0.16; // 16% IVA comercial
    const total = subtotal + tax;

    // Actualizar insignia numérica en el header
    if (this.badgeElement) {
      this.badgeElement.textContent = String(count);
      this.badgeElement.style.display = count > 0 ? 'flex' : 'none';
      this.badgeElement.setAttribute('aria-label', `${count} artículos en carrito`);
    }

    // Toggle entre lista vacía y lista de items
    if (this.items.length === 0) {
      if (this.emptyMessageElement) this.emptyMessageElement.style.display = 'block';
      if (this.cartContentWrapper) this.cartContentWrapper.style.display = 'none';
      if (this.checkoutBtn) this.checkoutBtn.setAttribute('disabled', 'true');
      return;
    }

    if (this.emptyMessageElement) this.emptyMessageElement.style.display = 'none';
    if (this.cartContentWrapper) this.cartContentWrapper.style.display = 'block';
    if (this.checkoutBtn) this.checkoutBtn.removeAttribute('disabled');

    // Renderizado seguro de items
    if (this.listElement) {
      this.listElement.innerHTML = this.items.map(item => `
        <li class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item__media" />
          <div class="cart-item__details">
            <span class="cart-item__title">${item.name}</span>
            <span class="cart-item__price">$${item.price.toFixed(2)} USD c/u</span>
            <div class="cart-item__qty-controls">
              <button 
                type="button" 
                class="cart-qty-btn" 
                data-action="decrement" 
                data-id="${item.id}" 
                aria-label="Disminuir cantidad de ${item.name}">-</button>
              <span style="font-size: 0.875rem; min-width: 1.25rem; text-align: center;">${item.quantity}</span>
              <button 
                type="button" 
                class="cart-qty-btn" 
                data-action="increment" 
                data-id="${item.id}" 
                aria-label="Aumentar cantidad de ${item.name}">+</button>
            </div>
          </div>
          <button 
            type="button" 
            class="btn btn--outline btn--sm" 
            data-action="remove" 
            data-id="${item.id}" 
            aria-label="Eliminar ${item.name} del carrito">
            Quitar
          </button>
        </li>
      `).join('');

      // Listeners para acciones en items del carrito
      this.listElement.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const action = btn.dataset.action;

          if (action === 'increment') this.updateQuantity(id, 1);
          if (action === 'decrement') this.updateQuantity(id, -1);
          if (action === 'remove') this.removeItem(id);
        });
      });
    }

    // Actualizar resumen de precios
    if (this.subtotalElement) this.subtotalElement.textContent = `$${subtotal.toFixed(2)} USD`;
    if (this.taxElement) this.taxElement.textContent = `$${tax.toFixed(2)} USD`;
    if (this.totalElement) this.totalElement.textContent = `$${total.toFixed(2)} USD`;
  }
}
