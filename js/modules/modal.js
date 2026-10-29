/**
 * modal.js - Gestor de ventanas modales accesibles (WCAG 2.1 AA)
 * Maneja enfoque atrapado (focus trap), cierre con ESC y restauración del foco.
 */

export class AccessibleModal {
  constructor(overlayId) {
    this.overlay = document.getElementById(overlayId);
    this.closeButtons = this.overlay ? this.overlay.querySelectorAll('[data-close-modal]') : [];
    this.lastFocusedElement = null;
    this.focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    this.init();
  }

  init() {
    if (!this.overlay) return;

    // Cierre con botones designados
    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // Cierre al hacer click en el fondo sombreado
    this.overlay.addEventListener('click', (event) => {
      if (event.target === this.overlay) {
        this.close();
      }
    });

    // Manejo de teclado (ESC y Tab)
    document.addEventListener('keydown', (event) => {
      if (!this.isOpen()) return;

      if (event.key === 'Escape') {
        this.close();
      } else if (event.key === 'Tab') {
        this.trapFocus(event);
      }
    });
  }

  isOpen() {
    return this.overlay && this.overlay.classList.contains('is-active');
  }

  open() {
    if (!this.overlay) return;

    this.lastFocusedElement = document.activeElement;
    this.overlay.classList.add('is-active');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Enfocar el primer elemento interactivo dentro del modal
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 50);
    }
  }

  close() {
    if (!this.overlay || !this.isOpen()) return;

    this.overlay.classList.remove('is-active');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Devolver el foco al elemento que abrió el modal
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }
  }

  getFocusableElements() {
    return Array.from(this.overlay.querySelectorAll(this.focusableSelectors)).filter(
      el => !el.hasAttribute('disabled') && el.offsetParent !== null
    );
  }

  trapFocus(event) {
    const focusable = this.getFocusableElements();
    if (focusable.length === 0) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }
}
