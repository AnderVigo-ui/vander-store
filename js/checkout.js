/**
 * checkout.js - VANDER STORE
 * Proceso de compra guiado en 6 pasos según la Sección 8 del PDR.
 * No genera confirmaciones falsas y gestiona la apertura de WhatsApp y copiado alternativo.
 */

import { formatearMoneda } from './catalogo.js';
import { validarCampo } from './validaciones.js';
import { generarMensajeWhatsApp, generarEnlaceWhatsApp, registrarPedidoFirestore } from './api.js';

export class CheckoutManager {
  constructor(carrito, modalInstance, onNotify) {
    this.carrito = carrito;
    this.modal = modalInstance;
    this.onNotify = onNotify;

    this.currentStep = 1;
    this.isSubmitting = false;
    this.lastOrder = null;

    this.datosCliente = {
      nombre: '',
      telefono: '',
      direccion: '',
      distrito: 'Trujillo',
      referencia: '',
      indicaciones: ''
    };

    this.modalidadEntrega = 'Envío a domicilio (Costo por coordinar con el vendedor)';
    this.metodoPago = 'Yape (974436335 - Ander Vigo)';

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.container = document.getElementById('checkout-modal');
    this.panes = document.querySelectorAll('.checkout-pane');
    this.stepIndicators = document.querySelectorAll('.checkout-step-indicator');

    // Botones de navegación
    this.btnNext = document.getElementById('checkout-next-btn');
    this.btnPrev = document.getElementById('checkout-prev-btn');
    this.btnConfirm = document.getElementById('checkout-confirm-btn');

    // Campos de datos del cliente
    this.inputNombre = document.getElementById('co-name');
    this.inputTelefono = document.getElementById('co-phone');
    this.inputDireccion = document.getElementById('co-address');
    this.inputDistrito = document.getElementById('co-district');
    this.inputReferencia = document.getElementById('co-ref');
    this.inputIndicaciones = document.getElementById('co-notes');
  }

  bindEvents() {
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => this.irSiguientePaso());
    }

    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => this.irPasoAnterior());
    }

    if (this.btnConfirm) {
      this.btnConfirm.addEventListener('click', () => this.confirmarPedido());
    }

    // Modalidad de entrega
    const radiosEntrega = document.querySelectorAll('input[name="delivery_mode"]');
    radiosEntrega.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.modalidadEntrega = e.target.value;
      });
    });

    // Métodos de pago
    const radiosPago = document.querySelectorAll('input[name="payment_option"]');
    radiosPago.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.metodoPago = e.target.value;
      });
    });

    // Botón para copiar mensaje si WhatsApp no abre
    const copyBtn = document.getElementById('copy-whatsapp-msg-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!this.lastOrder) return;
        const msg = generarMensajeWhatsApp(this.lastOrder);
        navigator.clipboard.writeText(msg).then(() => {
          this.notificar('¡Mensaje copiado al portapapeles! Puedes pegarlo en WhatsApp.', 'success');
        }).catch(() => {
          this.notificar('No se pudo copiar automáticamente. Por favor selecciónalo manualmente.', 'warning');
        });
      });
    }
  }

  iniciarCheckout() {
    const items = this.carrito.obtenerItems();
    if (items.length === 0) {
      this.notificar('El carrito está vacío. Agregue productos antes de continuar la compra.', 'warning');
      return;
    }

    this.currentStep = 2; // Paso 2: Datos del cliente (el paso 1 fue la revisión del carrito)
    this.actualizarVistaPasos();
    this.modal.open();
  }

  actualizarVistaPasos() {
    this.panes.forEach(pane => {
      const step = Number(pane.dataset.step);
      pane.classList.toggle('is-active', step === this.currentStep);
    });

    this.stepIndicators.forEach(ind => {
      const step = Number(ind.dataset.step);
      ind.classList.remove('is-current', 'is-done');
      if (step === this.currentStep) {
        ind.classList.add('is-current');
      } else if (step < this.currentStep) {
        ind.classList.add('is-done');
      }
    });

    // Ajustar botones inferiores
    if (this.btnPrev) {
      this.btnPrev.style.display = this.currentStep > 2 && this.currentStep < 6 ? 'inline-flex' : 'none';
    }

    if (this.btnNext) {
      this.btnNext.style.display = this.currentStep < 5 ? 'inline-flex' : 'none';
    }

    if (this.btnConfirm) {
      this.btnConfirm.style.display = this.currentStep === 5 ? 'inline-flex' : 'none';
    }

    // Renderizar resumen si llegamos al Paso 5
    if (this.currentStep === 5) {
      this.renderResumenPaso5();
    }
  }

  validarPasoActual() {
    if (this.currentStep === 2) {
      const errNombre = document.getElementById('co-name-error');
      const errTel = document.getElementById('co-phone-error');
      const errDir = document.getElementById('co-address-error');

      const vNom = validarCampo(this.inputNombre, errNombre, 'El nombre completo es obligatorio.');
      const vTel = validarCampo(this.inputTelefono, errTel, 'Ingrese un teléfono celular válido.');
      const vDir = validarCampo(this.inputDireccion, errDir, 'La dirección o punto de entrega es obligatoria.');

      if (!vNom || !vTel || !vDir) {
        return false;
      }

      this.datosCliente = {
        nombre: this.inputNombre.value.trim(),
        telefono: this.inputTelefono.value.trim(),
        direccion: this.inputDireccion.value.trim(),
        distrito: this.inputDistrito.value.trim() || 'Trujillo',
        referencia: this.inputReferencia.value.trim(),
        indicaciones: this.inputIndicaciones.value.trim()
      };
      return true;
    }

    return true;
  }

  irSiguientePaso() {
    if (!this.validarPasoActual()) return;

    if (this.currentStep < 5) {
      this.currentStep += 1;
      this.actualizarVistaPasos();
    }
  }

  irPasoAnterior() {
    if (this.currentStep > 2) {
      this.currentStep -= 1;
      this.actualizarVistaPasos();
    }
  }

  renderResumenPaso5() {
    const summaryContainer = document.getElementById('checkout-step5-summary');
    if (!summaryContainer) return;

    const items = this.carrito.obtenerItems();
    const subtotal = this.carrito.calcularSubtotalSoles();
    const total = this.carrito.calcularTotalSoles();

    const itemsHtml = items.map(i => `
      <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 0.85rem; border-bottom: 1px dashed var(--color-border);">
        <span>${i.name} × ${i.quantity}</span>
        <span style="font-weight: 700;">${formatearMoneda(i.price * i.quantity)}</span>
      </div>
    `).join('');

    summaryContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div>
          <strong style="color: var(--color-primary); font-size: 0.9rem;">Destinatario y entrega:</strong>
          <p style="font-size: 0.85rem; color: var(--color-text-muted);">${this.datosCliente.nombre} | Cel: ${this.datosCliente.telefono}</p>
          <p style="font-size: 0.85rem; color: var(--color-text-muted);">${this.datosCliente.direccion}, ${this.datosCliente.distrito}</p>
          ${this.datosCliente.referencia ? `<p style="font-size: 0.8rem; color: var(--color-text-muted);">Ref: ${this.datosCliente.referencia}</p>` : ''}
        </div>

        <div>
          <strong style="color: var(--color-primary); font-size: 0.9rem;">Modalidad y Pago:</strong>
          <p style="font-size: 0.85rem; color: var(--color-text-muted);">${this.modalidadEntrega}</p>
          <p style="font-size: 0.85rem; color: var(--color-text-muted);">Método seleccionado: <strong>${this.metodoPago}</strong></p>
        </div>

        <div>
          <strong style="color: var(--color-primary); font-size: 0.9rem;">Productos (${this.carrito.contarTotalArticulos()} unidades):</strong>
          <div style="margin-top: 4px;">${itemsHtml}</div>
        </div>

        <div class="cart-calc-box">
          <div class="cart-calc-row">
            <span>Subtotal de productos:</span>
            <strong>${formatearMoneda(subtotal)}</strong>
          </div>
          <div class="cart-calc-row">
            <span>Costo de envío:</span>
            <span class="shipping-notice">Por coordinar con el vendedor</span>
          </div>
          <div class="cart-calc-row cart-calc-row--highlight">
            <span>Total a coordinar:</span>
            <span>${formatearMoneda(total)}</span>
          </div>
        </div>
      </div>
    `;
  }

  async confirmarPedido() {
    if (this.isSubmitting) return;

    const items = this.carrito.obtenerItems();
    if (items.length === 0) {
      this.notificar('El carrito no contiene productos.', 'error');
      return;
    }

    this.isSubmitting = true;
    if (this.btnConfirm) {
      this.btnConfirm.setAttribute('disabled', 'true');
      this.btnConfirm.textContent = 'Registrando pedido...';
    }

    // Generar código de pedido único: VND-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codigoPedido = `VND-2026-${randomSuffix}`;

    const pedido = {
      codigo: codigoPedido,
      cliente: { ...this.datosCliente },
      modalidadEntrega: this.modalidadEntrega,
      metodoPago: this.metodoPago,
      items: JSON.parse(JSON.stringify(items)),
      subtotal: this.carrito.calcularSubtotalSoles(),
      costoEnvio: 'Por coordinar con el vendedor',
      total: this.carrito.calcularTotalSoles(),
      estadoPago: 'Pendiente de confirmación',
      estadoPedido: 'Pendiente de coordinación',
      creadoEn: new Date().toISOString()
    };

    // Intentar registrar en Firestore (Sección 12 del PDR)
    const resultadoDb = await registrarPedidoFirestore(pedido);

    this.lastOrder = pedido;
    this.currentStep = 6;
    this.actualizarVistaPasos();

    // Renderizar datos del Paso 6 (Confirmación)
    const orderCodeEl = document.getElementById('confirmed-order-code');
    const waLinkEl = document.getElementById('whatsapp-order-link');
    const dbStatusEl = document.getElementById('order-db-status');

    if (orderCodeEl) orderCodeEl.textContent = codigoPedido;

    if (waLinkEl) {
      waLinkEl.href = generarEnlaceWhatsApp(pedido);
    }

    if (dbStatusEl) {
      if (resultadoDb.exito) {
        dbStatusEl.className = 'form-status-alert form-status-alert--success';
        dbStatusEl.style.display = 'block';
        dbStatusEl.textContent = '✓ Pedido sincronizado con la base de datos de Cloud Firestore.';
      } else {
        dbStatusEl.className = 'form-status-alert form-status-alert--info';
        dbStatusEl.style.display = 'block';
        dbStatusEl.textContent = `ℹ️ ${resultadoDb.mensaje}`;
      }
    }

    // El PDR exige: "El mensaje queda preparado, pero el cliente debe pulsar Enviar dentro de WhatsApp. No borres los datos del pedido al regresar al navegador."
    // Por tanto, limpiamos el carrito activo para nuevas compras, pero conservamos this.lastOrder.
    this.carrito.items = [];
    this.carrito.guardarStorage();

    this.isSubmitting = false;
    if (this.btnConfirm) {
      this.btnConfirm.removeAttribute('disabled');
      this.btnConfirm.textContent = 'Confirmar y generar pedido';
    }
  }

  notificar(msg, tipo = 'info') {
    if (typeof this.onNotify === 'function') {
      this.onNotify(msg, tipo);
    }
  }
}
