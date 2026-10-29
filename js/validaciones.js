/**
 * validaciones.js - VANDER STORE
 * Reglas de validación en tiempo real y saneamiento para formularios y checkout.
 * Cumple con accesibilidad WCAG y la API nativa de restricciones HTML5.
 */

export function sanitizarTexto(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function validarEmail(email) {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  return re.test(String(email).toLowerCase());
}

export function validarTelefono(tel) {
  // Acepta números peruanos (9 dígitos típicamente, con o sin +51)
  const limpio = String(tel).replace(/[\s\-\(\)\+]/g, '');
  return limpio.length >= 9 && limpio.length <= 13;
}

export function validarCampo(inputElement, errorElement, mensajePersonalizado = null) {
  if (!inputElement) return true;

  let valido = true;
  let mensaje = '';

  const valor = inputElement.value.trim();

  if (inputElement.hasAttribute('required') && !valor) {
    valido = false;
    mensaje = mensajePersonalizado || 'Este campo es obligatorio.';
  } else if (inputElement.type === 'email' && valor && !validarEmail(valor)) {
    valido = false;
    mensaje = 'Ingrese un correo electrónico válido (ejemplo@dominio.com).';
  } else if (inputElement.type === 'tel' && valor && !validarTelefono(valor)) {
    valido = false;
    mensaje = 'Ingrese un número telefónico válido (mínimo 9 dígitos).';
  } else if (inputElement.minLength > 0 && valor.length < inputElement.minLength) {
    valido = false;
    mensaje = `Debe contener al menos ${inputElement.minLength} caracteres.`;
  }

  if (!valido) {
    inputElement.classList.add('is-invalid');
    inputElement.setAttribute('aria-invalid', 'true');
    if (errorElement) {
      errorElement.textContent = mensaje;
      errorElement.style.display = 'block';
    }
  } else {
    inputElement.classList.remove('is-invalid');
    inputElement.removeAttribute('aria-invalid');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  return valido;
}
