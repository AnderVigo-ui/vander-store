
const admin = require("firebase-admin");

const headers = {
  "Content-Type": "application/json"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        ...headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        ok: false,
        error: "Método no permitido. Utiliza POST."
      })
    };
  }

  try {
    const pedido = JSON.parse(event.body || "{}");

    if (
      !pedido.codigo ||
      !Array.isArray(pedido.items) ||
      pedido.items.length === 0
    ) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          ok: false,
          error: "Pedido inválido o sin productos."
        })
      };
    }

    const orderCode = String(pedido.codigo).trim();

    if (!/^[A-Za-z0-9_-]{1,100}$/.test(orderCode)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          ok: false,
          error: "Código de pedido inválido."
        })
      };
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({
          ok: false,
          pendingConfiguration: true,
          error: "Faltan las credenciales de Firebase en Netlify."
        })
      };
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n")
        })
      });
    }

    const db = admin.firestore();

  return {
  statusCode: 200,
  headers,
  body: JSON.stringify({
    ok: true,
    orderCode,
    message: "Pedido guardado correctamente en Firestore."
  })
};
    });

   return {
  statusCode: 200,
  headers,
  body: JSON.stringify({
    ok: true,
    orderCode,
    alreadyRegistered: yaExiste,
    message: yaExiste
      ? "Este pedido ya estaba registrado. No se modificó."
      : "Pedido guardado correctamente en Firestore."
  })
};

  } catch (error) {
    console.error(
      "Error guardando el pedido en Firestore:",
      error.message
    );

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        ok: false,
        error: "No se pudo guardar el pedido en Firestore."
      })
    };
  }
};
