# VANDER STORE — Tienda Virtual de Prevención y Emergencia

> **Eslogan:** Tu seguridad a un clic.  
> **Propietario:** Ander Vigo  
> **Ubicación:** Trujillo, Perú  
> **WhatsApp y Teléfono:** +51 974 436 335 (Yape: 974436335)  
> **Correo:** anvigoarmas19@gmail.com  
> **Tecnologías:** HTML5 Semántico, CSS3 y JavaScript ES6+ nativo (sin frameworks ni dependencias front-end).

---

## 📋 Descripción del Proyecto

**VANDER STORE** es una tienda virtual real, moderna, elegante y funcional desarrollada para facilitar el acceso a productos de prevención, preparación y emergencia ante lluvias intensas, inundaciones, cortes de energía y situaciones asociadas al Fenómeno El Niño en Trujillo y el norte del Perú.

La aplicación respeta los requisitos técnicos del proyecto escolar:
- Arquitectura pura en **HTML5, CSS3 y JavaScript ES6+ nativo**, sin plantillas prefabricadas ni librerías de UI externas.
- Organización limpia en **archivos independientes y rutas relativas**, lista para abrir y editar en **Visual Studio Code**, almacenar en **GitHub** y desplegar en **Netlify**.
- Catálogo oficial completo de **30 productos reales** con precios en Soles peruanos (`S/.`) organizados en 6 categorías.
- Carrito interactivo con cálculos fiables en céntimos enteros y persistencia en `localStorage`.
- Proceso de checkout guiado en 6 pasos.
- Integración oficial con **WhatsApp** que genera el mensaje estructurado con productos, cantidades, precios, subtotal y total.
- Formulario de contacto preparado para **Formspree**.
- Función Serverless de Netlify preparada para **Firebase Cloud Firestore** sin exponer claves secretas.

---

## 📁 Estructura del Repositorio

```text
vander-store/
├── index.html                    # Estructura semántica principal (en la raíz)
├── css/
│   └── style.css                 # Estilos CSS3 con tokens corporativos y responsive design
├── js/
│   ├── main.js                   # Orquestador y controlador principal del DOM
│   ├── catalogo.js               # Catálogo estructurado de 30 productos y motor de filtros
│   ├── carrito.js                # Lógica del carrito, stock y persistencia
│   ├── checkout.js               # Proceso de compra guiado en 6 pasos
│   ├── validaciones.js           # Validaciones nativas y reglas de seguridad
│   └── api.js                    # Integraciones con WhatsApp, Formspree y Firestore
├── netlify/
│   └── functions/
│       └── crear-pedido.js       # Función Serverless para registro seguro en Firebase Admin
├── .env.example                  # Plantilla de variables de entorno para Netlify
└── README.md                     # Guía de instalación, configuración y publicación
```

---

## 🎨 Paleta de Colores Corporativa Oficial

| Color | Hex | Uso en la Aplicación |
| :--- | :--- | :--- |
| **Azul marino** | `#14263D` | Color principal de la marca, cabecera y fondos oscuros |
| **Azul comercial** | `#2463A6` | Botones de acción principal, enlaces y llamadas a la acción |
| **Verde azulado** | `#148A8A` | Acentos, confirmaciones de stock y estados de éxito |
| **Blanco** | `#FFFFFF` | Fondo principal y superficies limpias |
| **Gris claro** | `#F3F5F7` | Fondos alternativos de sección y cuadros informativos |
| **Gris oscuro** | `#273444` | Tipografía principal y títulos secundarios |
| **Ámbar** | `#D7A84B` | Notificaciones, insignias de advertencia y avisos de entrega |

---

## 🛍️ Catálogo Inicial de 30 Productos

1. **Iluminación y energía:**
   - Linterna LED portátil (S/ 25.90)
   - Linterna recargable USB (S/ 39.90)
   - Lámpara LED de emergencia (S/ 34.90)
   - Power bank de 10 000 mAh (S/ 59.90)
   - Radio portátil de emergencia (S/ 69.90)
   - Pilas alcalinas, paquete (S/ 12.90)
2. **Protección contra lluvias:**
   - Poncho impermeable (S/ 15.90)
   - Impermeable reutilizable con capucha (S/ 39.90)
   - Botas de lluvia con tallas 38-42 (S/ 49.90)
   - Paraguas reforzado (S/ 29.90)
   - Mochila impermeable (S/ 69.90)
   - Cubierta impermeable para mochila (S/ 19.90)
3. **Primeros auxilios:**
   - Botiquín básico familiar (S/ 49.90)
   - Botiquín familiar completo (S/ 89.90)
   - Manta térmica de emergencia (S/ 12.90)
   - Vendas y gasas, paquete (S/ 14.90)
   - Esparadrapo médico (S/ 6.90)
4. **Agua e higiene:**
   - Bidón para agua de 10 litros (S/ 29.90)
   - Bidón para agua de 20 litros (S/ 44.90)
   - Gel antibacterial de 500 ml (S/ 16.90)
   - Mascarillas descartables, paquete (S/ 9.90)
   - Bolsas resistentes para residuos, paquete (S/ 12.90)
5. **Herramientas de emergencia:**
   - Silbato de emergencia (S/ 7.90)
   - Cuerda multiuso de 10 metros (S/ 19.90)
   - Guantes de trabajo (S/ 14.90)
   - Cinta de señalización (S/ 12.90)
   - Herramienta manual multiuso (S/ 24.90)
6. **Kits de emergencia:**
   - Kit individual de emergencia (S/ 49.90)
   - Kit familiar para lluvias (S/ 99.90)
   - Kit familiar de emergencia completo (S/ 179.90)

---

## 🚀 Guía de Pasos: Edición, GitHub y Publicación en Netlify

### Paso 1: Abrir y Probar en Visual Studio Code
1. Abre la carpeta del proyecto en **Visual Studio Code**.
2. Puedes utilizar la extensión **Live Server** (clic derecho en `index.html` > *Open with Live Server*).
3. La aplicación se ejecutará en `http://127.0.0.1:5500` con recarga automática sin requerir Node.js en el cliente.

### Paso 2: Subir a GitHub
1. Abre una terminal en la raíz del proyecto e inicializa el repositorio:
   ```bash
   git init
   git add .
   git commit -m "feat: VANDER STORE versión inicial con HTML5, CSS3 y JS nativo"
   ```
2. Crea un nuevo repositorio en tu cuenta de GitHub (ejemplo: `vander-store`).
3. Vincula y sube tus cambios:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/vander-store.git
   git branch -M main
   git push -u origin main
   ```

### Paso 3: Configurar Formspree para el Formulario de Contacto
1. Entra a [formspree.io](https://formspree.io/) y crea una cuenta gratuita con el correo `anvigoarmas19@gmail.com`.
2. Crea un nuevo formulario con nombre "VANDER STORE Contacto".
3. Copia el endpoint asignado (ejemplo: `https://formspree.io/f/xpzgkyqo`).
4. Abre `js/api.js` en VS Code y pega tu endpoint en la propiedad `formspreeEndpoint`:
   ```javascript
   export const CONFIGURACION_TIENDA = {
     // ...
     formspreeEndpoint: 'https://formspree.io/f/TU_CODIGO_AQUI',
     // ...
   };
   ```

### Paso 4: Desplegar en Netlify
1. Inicia sesión en [netlify.com](https://www.netlify.com/).
2. Haz clic en **Add new site** > **Import an existing project** y selecciona tu repositorio de **GitHub**.
3. **Build settings**:
   - *Base directory:* (dejar en blanco)
   - *Build command:* (dejar en blanco, es un sitio web nativo)
   - *Publish directory:* `.` (la raíz donde está `index.html`)
4. Haz clic en **Deploy site**.
5. ¡Tu tienda estará disponible públicamente con certificado SSL gratuito!

### Paso 5: Configurar Firebase Cloud Firestore en Netlify (Opcional)
Para habilitar el guardado automático de pedidos en Firestore:
1. En Firebase Console (proyecto `vander-store`), dirígete a *Configuración del proyecto* > *Cuentas de servicio* > *Generar nueva clave privada*.
2. En Netlify, ve a **Site configuration** > **Environment variables** y añade:
   - `FIREBASE_PROJECT_ID`: `vander-store`
   - `FIREBASE_CLIENT_EMAIL`: (el correo de tu cuenta de servicio de Firebase)
   - `FIREBASE_PRIVATE_KEY`: (la clave privada generada)
3. La función serverless `netlify/functions/crear-pedido.js` se conectará automáticamente.

---

## 🛡️ Métodos de Pago y Coordinación

- **Yape:** Al número **974436335** a nombre del titular **Ander Vigo**.
- **Plin:** Coordinación por WhatsApp.
- **Transferencia bancaria / Otros bancos:** Número de cuenta y CCI facilitados por el vendedor.
- **Pago contra entrega:** Sujeto a confirmación de cobertura en Trujillo.
