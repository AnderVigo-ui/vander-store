/**
 * form-validation.js - Validación accesible de formularios con la API nativa de restricciones HTML5
 */

import { showToast } from './toast.js';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = form.querySelectorAll('input, select, textarea');

  // Validación individual por campo
  const validateField = (field) => {
    const errorContainer = document.getElementById(`${field.id}-error`);
    let isValid = true;
    let errorMessage = '';

    if (field.validity.valueMissing) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio.';
    } else if (field.validity.typeMismatch && field.type === 'email') {
      isValid = false;
      errorMessage = 'Por favor introduzca un correo electrónico válido (ejemplo@dominio.com).';
    } else if (field.validity.tooShort) {
      isValid = false;
      errorMessage = `Debe contener al menos ${field.minLength} caracteres.`;
    }

    if (!isValid) {
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      if (errorContainer) {
        errorContainer.textContent = errorMessage;
      }
    } else {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      if (errorContainer) {
        errorContainer.textContent = '';
      }
    }

    return isValid;
  };

  // Eventos de interacción en vivo
  fields.forEach(field => {
    field.addEventListener('blur', () => {
      validateField(field);
    });

    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) {
        validateField(field);
      }
    });
  });

  // Envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    let firstInvalidField = null;

    fields.forEach(field => {
      const valid = validateField(field);
      if (!valid) {
        allValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });

    if (!allValid) {
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      showToast('Por favor revise los campos señalados antes de enviar.', 'info');
      return;
    }

    // Estado de envío accesible
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Enviar Mensaje';

    if (submitBtn) {
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.textContent = 'Enviando solicitud...';
    }

    // Simulación de respuesta de backend comercial
    setTimeout(() => {
      form.reset();
      if (submitBtn) {
        submitBtn.removeAttribute('disabled');
        submitBtn.textContent = originalText;
      }

      const statusBox = document.getElementById('form-status-message');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = `
          <div style="background-color: var(--color-success-bg); color: var(--color-success); padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(21, 128, 61, 0.2); margin-top: 1rem;">
            <strong>✓ ¡Solicitud enviada exitosamente!</strong> Un asesor comercial responderá en un plazo máximo de 24 horas hábiles.
          </div>
        `;
        setTimeout(() => {
          statusBox.style.display = 'none';
        }, 8000);
      }

      showToast('¡Mensaje enviado con éxito!', 'success', 5000);
    }, 1000);
  });
}
