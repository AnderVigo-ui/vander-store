/**
 * carrito.js - VANDER STORE
 * Gestión del carrito de compras con persistencia en localStorage y cálculos en céntimos enteros.
 * Cumple con los requisitos del PDR (Sección 7).
 */

import { formatearMoneda } from './catalogo.js';

const STORAGE_KEY = 'vander_store_cart_v1';

export class CarritoCompras {
  constructor({ onUpdate, onNotify } = {}) {
    this.items = this.cargarStorage();
    this.onUpdate = onUpdate;
    this.onNotify = onNotify;
  }

  cargarStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  guardarStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn('[VANDER STORE] No se pudo guardar el carrito en almacenamiento local', e);
    }
    if (typeof this.onUpdate === 'function') {
      this.onUpdate(this);
    }
  }

  obtenerItems() {
    return this.items;
  }

  contarTotalArticulos() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Cálculo en céntimos para evitar inconsistencias de coma flotante.
   */
  calcularSubtotalCentimos() {
    return this.items.reduce((sum, item) => sum + (item.cents * item.quantity), 0);
  }

  calcularSubtotalSoles() {
    return this.calcularSubtotalCentimos() / 100;
  }

  /**
   * El PDR establece: Si no se ha configurado una tarifa de envío,
   * muestra "Costo de envío: por coordinar" y aclara que el subtotal no incluye ese importe.
   */
  obtenerCostoEnvio() {
    return {
      configurado: false,
      monto: 0,
      texto: 'Por coordinar con el vendedor (No incluido)'
    };
  }

  calcularTotalSoles() {
    return this.calcularSubtotalSoles();
  }

  /**
   * Agregar producto al carrito validando stock y estado activo.
   */
  agregarProducto(producto, cantidad = 1, variante = null) {
    if (!producto || !producto.active) {
      this.notificar('Este producto no se encuentra disponible actualmente.', 'error');
      return false;
    }

    if (producto.stock <= 0) {
      this.notificar(`El producto "${producto.name}" está agotado.`, 'warning');
      return false;
    }

    const itemKey = variante ? `${producto.id}_${variante}` : producto.id;
    const itemExistente = this.items.find(i => i.key === itemKey);

    const cantidadDeseada = (itemExistente ? itemExistente.quantity : 0) + cantidad;

    if (cantidadDeseada > producto.stock) {
      this.notificar(`Stock insuficiente. Solo quedan ${producto.stock} unidades de "${producto.name}".`, 'warning');
      return false;
    }

    if (itemExistente) {
      itemExistente.quantity = cantidadDeseada;
    } else {
      this.items.push({
        key: itemKey,
        id: producto.id,
        name: producto.name,
        price: producto.price,
        cents: producto.cents,
        image: producto.image,
        category: producto.category,
        stock: producto.stock,
        variant: variante,
        quantity: cantidad
      });
    }

    this.guardarStorage();
    this.notificar(`"${producto.name}" agregado al carrito.`, 'success');
    return true;
  }

  actualizarCantidad(itemKey, delta) {
    const item = this.items.find(i => i.key === itemKey);
    if (!item) return;

    const nuevaCantidad = item.quantity + delta;

    if (nuevaCantidad <= 0) {
      this.eliminarItem(itemKey);
      return;
    }

    if (nuevaCantidad > item.stock) {
      this.notificar(`No puedes superar el stock disponible (${item.stock} unidades).`, 'warning');
      return;
    }

    item.quantity = nuevaCantidad;
    this.guardarStorage();
  }

  eliminarItem(itemKey) {
    const item = this.items.find(i => i.key === itemKey);
    this.items = this.items.filter(i => i.key !== itemKey);
    this.guardarStorage();
    if (item) {
      this.notificar(`"${item.name}" eliminado del carrito.`, 'info');
    }
  }

  vaciar() {
    if (this.items.length === 0) return;
    const confirma = window.confirm('¿Está seguro de que desea vaciar todo el contenido del carrito?');
    if (!confirma) return;

    this.items = [];
    this.guardarStorage();
    this.notificar('El carrito ha sido vaciado.', 'info');
  }

  notificar(mensaje, tipo = 'info') {
    if (typeof this.onNotify === 'function') {
      this.onNotify(mensaje, tipo);
    }
  }
}
