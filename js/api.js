/**
 * api.js - VANDER STORE
 * Módulo de integración para Formspree, WhatsApp y Firebase Cloud Firestore.
 * Respeta rigurosamente las Secciones 9, 10, 11 y 12 del PDR.
 * No genera confirmaciones falsas de operaciones no conectadas.
 */

import { formatearMoneda } from './catalogo.js';

export const CONFIGURACION_TIENDA = {
  nombre: 'VANDER STORE',
  eslogan: 'Tu seguridad a un clic.',
  propietario: 'Ander Vigo',
  emailContacto: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_STORE_OWNER_EMAIL) || 'anvigoarmas19@gmail.com',
  telefonoWhatsApp: '+51 974 436 335',
  numeroWhatsAppIntl: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_STORE_WHATSAPP) || '51974436335',
  numeroYape: '974436335',
  ubicacion: 'Trujillo, Perú',
  
  // Endpoint de Formspree: se mantiene vacío por defecto hasta que el propietario lo proporcione
  formspreeEndpoint: '',

  // Configuración web de Firebase proporcionada en el PDR para el proyecto 'vander-store'
  firebaseConfig: {
    apiKey: "AIzaSyAKDZSsSyzZsyC3WcfgcRt74_SO2V5MAPQ",
    authDomain: "vander-store.firebaseapp.com",
    projectId: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.FIREBASE_PROJECT_ID) || "vander-store",
    storageBucket: "vander-store.firebasestorage.app",
    messagingSenderId: "519949122604",
    appId: "1:519949122604:web:0e8ca64461b7abb949a589",
    measurementId: "G-0VB3ZWKHPC"
  }
};

/**
 * 9.1. Genera el texto del mensaje con la estructura exacta exigida por el PDR.
 */
export function generarMensajeWhatsApp(pedido) {
  const lineasProductos = pedido.items.map(item => {
    return `- ${item.name} × ${item.quantity}\n  Precio unitario: ${formatearMoneda(item.price)}\n  Importe: ${formatearMoneda(item.price * item.quantity)}`;
  }).join('\n\n');

  const texto = 
`Hola, VANDER STORE. Quiero coordinar mi pedido.

Código de pedido: ${pedido.codigo}

Nombre: ${pedido.cliente.nombre}

Teléfono: ${pedido.cliente.telefono}

Entrega: ${pedido.cliente.direccion ? `${pedido.cliente.direccion} (${pedido.cliente.distrito || 'Trujillo'})` : pedido.modalidadEntrega}

Productos:
${lineasProductos}

Subtotal: ${formatearMoneda(pedido.subtotal)}

Envío: Por coordinar con el vendedor

Total: ${formatearMoneda(pedido.total)} (Envío por coordinar)

Método de pago: ${pedido.metodoPago}

Estado del pago: Pendiente de confirmación.

Por favor, confirmen la disponibilidad, el pago y las condiciones de entrega.

Gracias.`;

  return texto;
}

/**
 * Genera el enlace oficial a la API de WhatsApp codificado correctamente.
 */
export function generarEnlaceWhatsApp(pedido) {
  const mensaje = generarMensajeWhatsApp(pedido);
  return `https://wa.me/${CONFIGURACION_TIENDA.numeroWhatsAppIntl}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * 11. Envío de consultas con Formspree.
 * Si el endpoint aún no ha sido provisto, informa transparentemente sin generar errores ni envíos falsos.
 */
export async function enviarContactoFormspree(datosFormulario) {
  const envEndpoint = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FORMSPREE_ENDPOINT) ? import.meta.env.VITE_FORMSPREE_ENDPOINT : '';
  const endpoint = CONFIGURACION_TIENDA.formspreeEndpoint || envEndpoint;

  if (!endpoint || endpoint.trim() === '' || endpoint.includes('YOUR_FORM_ID') || !endpoint.startsWith('https://formspree.io/')) {
    return {
      exito: false,
      pendienteConfiguracion: true,
      mensaje: `El endpoint de Formspree aún no ha sido configurado. Esta función se activará en cuanto el propietario (${CONFIGURACION_TIENDA.emailContacto}) proporcione su endpoint real de formspree.io. Mientras tanto, puedes contactarnos directamente al correo o por WhatsApp.`
    };
  }

  try {
    const respuesta = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosFormulario)
    });

    if (respuesta.ok) {
      return {
        exito: true,
        mensaje: 'Su mensaje ha sido enviado correctamente a VANDER STORE mediante Formspree.'
      };
    } else {
      const errorData = await respuesta.json().catch(() => ({}));
      return {
        exito: false,
        mensaje: errorData.error || 'Ocurrió un error al procesar el envío en Formspree. Por favor verifique el endpoint.'
      };
    }
  } catch (err) {
    return {
      exito: false,
      mensaje: 'Error de conexión de red al intentar contactar a Formspree.'
    };
  }
}

/**
 * 12. Registro de pedidos en Firebase Cloud Firestore.
 * Intenta registrar mediante la función Netlify Serverless (/.netlify/functions/crear-pedido)
 * o documenta transparentemente el estado sin fingir operaciones completadas.
 */
export async function registrarPedidoFirestore(pedido) {
  try {
    const respuesta = await fetch('/.netlify/functions/crear-pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });

    if (respuesta.ok) {
      const data = await respuesta.json();
      if (data.ok) {
        return {
          exito: true,
          codigo: data.orderCode || pedido.codigo,
          origen: 'firestore_netlify_function',
          mensaje: 'Pedido registrado satisfactoriamente en Cloud Firestore.'
        };
      } else if (data.pendingConfiguration) {
        return {
          exito: false,
          pendienteConfiguracion: true,
          codigo: pedido.codigo,
          mensaje: data.message || 'La base de datos Cloud Firestore está pendiente de credenciales en Netlify.'
        };
      }
    }
  } catch (err) {
    // Modo de vista previa local o entorno sin backend Netlify desplegado aún
  }

  // De acuerdo a las Secciones 12.2, 12.6 y 19 del PDR:
  // "Si la integración todavía necesita configuración, documenta los pasos pendientes y no simules que está conectada."
  return {
    exito: false,
    pendienteConfiguracion: true,
    codigo: pedido.codigo,
    mensaje: 'La base de datos Cloud Firestore está pendiente de conexión en el servidor de Netlify. Tu pedido se ha generado correctamente con el código ' + pedido.codigo + ' y puedes coordinar su entrega de inmediato por WhatsApp.'
  };
}
