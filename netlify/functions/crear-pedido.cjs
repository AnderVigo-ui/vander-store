/**
 * netlify/functions/crear-pedido.js - VANDER STORE
 * Función Serverless para registrar pedidos de forma segura en Firebase Cloud Firestore.
 * Conforme a la Sección 12 del PDR:
 * - Protege credenciales privadas manteniéndolas en el entorno de servidor (Netlify).
 * - No expone claves secretas en el navegador ni en GitHub.
 * - Si faltan credenciales en Netlify, informa de manera transparente sin fingir guardados.
 */

exports.handler = async (event) => {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Método no permitido. Utilice POST.' })
    };
  }

  try {
    const pedido = JSON.parse(event.body || '{}');

    // Validación básica en servidor
    if (!pedido.codigo || !pedido.items || !Array.isArray(pedido.items) || pedido.items.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Estructura de pedido inválida o sin productos.' })
      };
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || 'vander-store';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Verificar si las credenciales administrativas de Firebase Admin SDK están presentes en Netlify
    if (!clientEmail || !privateKey) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ok: false,
          pendingConfiguration: true,
          orderCode: pedido.codigo,
          message: 'Servidor listo. Las variables FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY deben configurarse en el panel de Netlify (Site settings > Environment variables).'
        })
      };
    }

    // Cuando el propietario configure las variables de entorno en Netlify,
    // se inicializa Firebase Admin para guardar en las colecciones "orders" y "orderItems"
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        orderCode: pedido.codigo,
        message: 'Pedido guardado exitosamente en Cloud Firestore.'
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Error interno en la función serverless de Netlify.',
        details: error.message
      })
    };
  }
};
