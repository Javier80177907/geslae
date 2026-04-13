

<!-- ══════════════════ HERO ══════════════════ -->
<div class="hero">
  <h1>Apoyos Escalera</h1>
  <div class="subtitle">Sistema Operativo de Campo · Conectar</div>
  <div class="badges">
    <span class="badge green">⬤ Firebase Realtime DB</span>
    <span class="badge blue">⬤ Leaflet.js + OSM</span>
    <span class="badge yellow">⬤ Vanilla JS</span>
    <span class="badge orange">⬤ 3 Roles de acceso</span>
  </div>
  <a class="link" href="https://javier80177907.github.io/apoyosweb/" target="_blank">🌐 Ver demo en vivo</a>
</div>

<!-- ══════════════════ CONTENT ══════════════════ -->
<div class="container">

  <!-- SCREENSHOTS -->
  <h2><span class="icon">📸</span> Capturas del Sistema</h2>
  <div class="screenshots">
    <div class="screenshot-card">
      <img src="https://github.com/Javier80177907/geslae/blob/cf13d2c74d69572605f4501abc4b2c332fac0dc4/escalera.jpg?raw=true" alt="Pantalla de ingreso" onerror="this.style.minHeight='160px';this.style.background='#21262d'"/>
      <div class="cap">🔐 Pantalla de Ingreso — Login con selección de rol</div>
    </div>
    <div class="screenshot-card">
      <img src="https://github.com/Javier80177907/geslae/blob/f0d37d757cf0269b45f94cc27b3e6bc4dbf313b0/admin.jpg?raw=true" alt="Vista administrador" onerror="this.style.minHeight='160px';this.style.background='#21262d'"/>
      <div class="cap">🛡️ Vista del Administrador — Control total + estadísticas</div>
    </div>
    <div class="screenshot-card">
      <img src="https://github.com/Javier80177907/geslae/blob/760169c03d5bb9a7288cae8ab800da1aeb6961b2/conductor.jpg?raw=true" alt="Vista conductor" onerror="this.style.minHeight='160px';this.style.background='#21262d'"/>
      <div class="cap">🚗 Vista del Conductor — Mapa en tiempo real + estados</div>
    </div>
    <div class="screenshot-card">
      <img src="https://github.com/Javier80177907/geslae/blob/6f28542b2e152459c6fecac10f27dfc2498cbebf/tecnico.jpg?raw=true" alt="Vista técnico" onerror="this.style.minHeight='160px';this.style.background='#21262d'"/>
      <div class="cap">📡 Vista del Técnico — Formulario + mapa geocodificado</div>
    </div>
  </div>

  <!-- DESCRIPCIÓN -->
  <h2><span class="icon">📖</span> Descripción</h2>
  <p>
    <strong>Apoyos Escalera</strong> es una aplicación web operativa diseñada para coordinar en tiempo real las solicitudes de apoyo de técnicos en campo. Permite registrar ubicaciones precisas con geocodificación, hacer seguimiento del estado de cada apoyo y visualizar todo en un mapa interactivo. Construida sobre <strong>Firebase Realtime Database</strong>, garantiza sincronización instantánea entre todos los roles del sistema.
  </p>

  <!-- FUNCIONALIDADES -->
  <h2><span class="icon">✨</span> Funcionalidades</h2>
  <div class="feature-grid">
    <div class="fcard">
      <div class="ftitle">🔐 Autenticación por Roles</div>
      <ul>
        <li>Login con tres perfiles: Admin, Conductor y Técnico</li>
        <li>Sesión protegida con sessionStorage</li>
        <li>Redirección automática por rol</li>
        <li>Credenciales de prueba incluidas</li>
      </ul>
    </div>
    <div class="fcard">
      <div class="ftitle">📡 Técnico — Solicitar Apoyo</div>
      <ul>
        <li>Formulario: nombre, dirección, celular</li>
        <li>Geocodificación en tiempo real vía Nominatim</li>
        <li>Pin arrastrable para precisión exacta</li>
        <li>Geocodificación inversa al soltar el pin</li>
        <li>Historial con temporizador en vivo</li>
      </ul>
    </div>
    <div class="fcard">
      <div class="ftitle">🚗 Conductor — Gestión de Apoyos</div>
      <ul>
        <li>Listado en tiempo real de apoyos activos</li>
        <li>Cambio de estado: Pendiente → Proceso → Finalizado</li>
        <li>Mapa con marcadores por estado (amarillo / azul / verde)</li>
        <li>Alerta visual al superar 40 minutos</li>
        <li>Click en tarjeta/marcador enfoca el mapa</li>
      </ul>
    </div>
    <div class="fcard">
      <div class="ftitle">🛡️ Administrador — Control Total</div>
      <ul>
        <li>Todas las funciones del Conductor</li>
        <li>Panel para crear solicitudes directamente</li>
        <li>Estadísticas: total, pendientes, proceso, finalizados</li>
        <li>Mapa dual (listado + creación)</li>
        <li>Eliminar / reabrir cualquier apoyo</li>
      </ul>
    </div>
    <div class="fcard">
      <div class="ftitle">🗺️ Mapa en Tiempo Real</div>
      <ul>
        <li>Basado en Leaflet.js + OpenStreetMap</li>
        <li>Marcadores por estado y urgencia</li>
        <li>Popups con info completa del apoyo</li>
        <li>flyTo() animado al seleccionar</li>
      </ul>
    </div>
  </div>

  <!-- MODELO ER -->
  <h2><span class="icon">🗄️</span> Base de Datos — Modelo Entidad Relación</h2>
  <p>El modelo incorpora tres roles de usuario: Técnico, Conductor y Administrador, cada uno con atributos y responsabilidades específicas. El nodo principal <code>/solicitudes</code> almacena cada apoyo con estado, coordenadas y metadatos.</p>
  <div class="er-wrap">
    <img src="https://github.com/user-attachments/assets/8a7dab20-26c8-46a7-bd4e-c7343e534354" alt="Modelo Entidad Relación — Apoyos Escalera" onerror="this.style.minHeight='220px';this.style.background='#21262d'"/>
    <div class="er-cap">Modelo Entidad-Relación — Firebase Realtime Database · Apoyos Escalera / Conectar 2026</div>
  </div>


  <!-- ══════════════ SEPARADOR ══════════════ -->
  <hr class="divider"/>

  <!-- ════════════════════════════════════════
       ESPECIFICACIONES TÉCNICAS
  ════════════════════════════════════════ -->

  <div class="specs-header">
    <h1>Especificaciones Técnicas para Implementación</h1>
    <div class="sub">Apoyos Escalera · Plataforma Conectar · Uso Técnico Interno</div>
    <table class="meta-table">
      <tr><td>Versión del Documento</td><td>1.0</td></tr>
      <tr><td>Fecha de Emisión</td><td>Abril 2026</td></tr>
      <tr><td>Clasificación</td><td>Uso Técnico Interno</td></tr>
      <tr><td>Audiencia Objetivo</td><td>Ingenieros de Software / Administradores de Sistemas</td></tr>
      <tr><td>Stack Principal</td><td>Firebase · Leaflet.js · Vanilla JS</td></tr>
      <tr><td>Roles Modelados</td><td>Técnico, Conductor, Administrador</td></tr>
    </table>
  </div>

  <!-- 1. RESUMEN -->
  <h2 class="spec-h2">1. Resumen del Sistema</h2>
  <p>Apoyos Escalera / Conectar es una aplicación web de coordinación en tiempo real diseñada para operaciones de campo en instalaciones de fibra óptica. Permite a técnicos, conductores y administradores visualizar ubicaciones, gestionar eventos y comunicarse a través de un mapa interactivo compartido.</p>

  <h3 class="spec-h3">1.1 Arquitectura General</h3>
  <p>El sistema sigue una arquitectura cliente-servidor sin backend propio. Firebase actúa como BaaS (Backend as a Service), eliminando la necesidad de servidores dedicados para lógica de negocio o base de datos.</p>
  <table class="spec-table">
    <thead><tr><th>Capa</th><th>Tecnología</th><th>Responsabilidad</th></tr></thead>
    <tbody>
      <tr><td>Frontend</td><td>HTML5 + CSS3 + Vanilla JS</td><td>Interfaz de usuario, lógica de presentación</td></tr>
      <tr><td>Mapa</td><td>Leaflet.js + OpenStreetMap</td><td>Visualización geoespacial en tiempo real</td></tr>
      <tr><td>Base de Datos</td><td>Firebase Realtime Database</td><td>Persistencia y sincronización en tiempo real</td></tr>
      <tr><td>Autenticación</td><td>Firebase Authentication</td><td>Gestión de sesiones y roles de usuario</td></tr>
      <tr><td>Hosting</td><td>Firebase Hosting / Servidor estático</td><td>Distribución de archivos estáticos</td></tr>
    </tbody>
  </table>

  <!-- 2. ENTORNO -->
  <h2 class="spec-h2">2. Requisitos del Entorno de Desarrollo</h2>

  <h3 class="spec-h3">2.1 Sistema Operativo Compatible</h3>
  <table class="spec-table">
    <thead><tr><th>Sistema Operativo</th><th>Versión Mínima</th><th>Estado</th></tr></thead>
    <tbody>
      <tr><td>Ubuntu / Debian Linux</td><td>20.04 LTS / 11 Bullseye</td><td><span class="ok">✅ Recomendado</span></td></tr>
      <tr><td>Windows</td><td>10 (Build 19041+)</td><td><span class="ok">✅ Compatible</span></td></tr>
      <tr><td>macOS</td><td>11 Big Sur+</td><td><span class="ok">✅ Compatible</span></td></tr>
      <tr><td>Windows Server</td><td>2019+</td><td>Solo producción</td></tr>
    </tbody>
  </table>

  <h3 class="spec-h3">2.2 Node.js y npm</h3>
  <p>Node.js es requerido exclusivamente para herramientas CLI como Firebase CLI. El frontend no requiere Node.js en producción.</p>
  <table class="spec-table">
    <thead><tr><th>Paquete</th><th>Versión Mínima</th><th>Versión Recomendada</th></tr></thead>
    <tbody>
      <tr><td>Node.js</td><td>18.x LTS</td><td>20.x LTS</td></tr>
      <tr><td>npm</td><td>9.x</td><td>10.x</td></tr>
      <tr><td>Firebase CLI</td><td>12.x</td><td>13.x (latest)</td></tr>
    </tbody>
  </table>
  <pre># Instalar Node.js v20 LTS en Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar versiones
node --version   # Debe mostrar v20.x.x
npm --version    # Debe mostrar 10.x.x

# Instalar Firebase CLI globalmente
npm install -g firebase-tools@13
firebase --version</pre>

  <h3 class="spec-h3">2.3 Navegadores Compatibles</h3>
  <table class="spec-table">
    <thead><tr><th>Navegador</th><th>Versión Mínima</th><th>Soporte GPS/Geo</th><th>Recomendado</th></tr></thead>
    <tbody>
      <tr><td>Google Chrome</td><td>110+</td><td><span class="ok">✅ Nativo</span></td><td><span class="star">⭐ Sí</span></td></tr>
      <tr><td>Mozilla Firefox</td><td>110+</td><td><span class="ok">✅ Nativo</span></td><td><span class="ok">✅ Sí</span></td></tr>
      <tr><td>Microsoft Edge</td><td>110+</td><td><span class="ok">✅ Nativo</span></td><td><span class="ok">✅ Sí</span></td></tr>
      <tr><td>Safari (iOS/macOS)</td><td>16+</td><td><span class="warn">⚠️ Requiere HTTPS</span></td><td><span class="warn">⚠️ Condicional</span></td></tr>
      <tr><td>Chrome Mobile (Android)</td><td>110+</td><td><span class="ok">✅ Nativo</span></td><td><span class="star">⭐ Sí</span></td></tr>
      <tr><td>Internet Explorer</td><td>—</td><td><span class="bad">❌ No soportado</span></td><td><span class="bad">❌ No</span></td></tr>
    </tbody>
  </table>
  <div class="callout">⚠️ IMPORTANTE: La API de Geolocation requiere HTTPS en producción. En desarrollo local, <code>localhost</code> es la única excepción permitida por los navegadores modernos.</div>

  <!-- 3. DEPENDENCIAS -->
  <h2 class="spec-h2">3. Dependencias del Frontend</h2>
  <p>El proyecto utiliza únicamente Vanilla JS sin frameworks. Todas las dependencias externas se cargan vía CDN.</p>

  <h3 class="spec-h3">3.1 Librerías Principales (CDN)</h3>
  <table class="spec-table">
    <thead><tr><th>Librería</th><th>Versión</th><th>Propósito</th><th>CDN</th></tr></thead>
    <tbody>
      <tr><td>Leaflet.js</td><td>1.9.4</td><td>Mapas interactivos</td><td>unpkg.com/leaflet@1.9.4/dist/</td></tr>
      <tr><td>Firebase App</td><td>10.x (compat)</td><td>Core SDK de Firebase</td><td>gstatic.com/firebasejs/10.x.x/</td></tr>
      <tr><td>Firebase Auth</td><td>10.x (compat)</td><td>Autenticación de usuarios</td><td>gstatic.com/firebasejs/10.x.x/</td></tr>
      <tr><td>Firebase Database</td><td>10.x (compat)</td><td>Realtime Database SDK</td><td>gstatic.com/firebasejs/10.x.x/</td></tr>
      <tr><td>OpenStreetMap Tiles</td><td>N/A</td><td>Tiles del mapa base</td><td>tile.openstreetmap.org</td></tr>
    </tbody>
  </table>

  <h3 class="spec-h3">3.2 Snippet de Importación CDN</h3>
  <pre>&lt;!-- Leaflet.js CSS --&gt;
&lt;link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/&gt;

&lt;!-- Leaflet.js JS --&gt;
&lt;script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"&gt;&lt;/script&gt;

&lt;!-- Firebase SDK (compat mode) --&gt;
&lt;script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"&gt;&lt;/script&gt;
&lt;script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"&gt;&lt;/script&gt;
&lt;script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js"&gt;&lt;/script&gt;</pre>

  <!-- 4. FIREBASE -->
  <h2 class="spec-h2">4. Configuración de Firebase</h2>

  <h3 class="spec-h3">4.1 Servicios Firebase Requeridos</h3>
  <table class="spec-table">
    <thead><tr><th>Servicio</th><th>Plan Mínimo</th><th>Uso en el Sistema</th></tr></thead>
    <tbody>
      <tr><td>Realtime Database</td><td>Spark (Gratuito)</td><td>Sincronización de ubicaciones y eventos en tiempo real</td></tr>
      <tr><td>Authentication</td><td>Spark (Gratuito)</td><td>Login de usuarios, gestión de sesiones y roles</td></tr>
      <tr><td>Hosting</td><td>Spark (Gratuito)</td><td>Despliegue del frontend estático (opcional)</td></tr>
    </tbody>
  </table>

  <h3 class="spec-h3">4.2 Objeto de Configuración (firebaseConfig)</h3>
  <pre>const firebaseConfig = {
  apiKey:            "AIzaSy...",          // Llave API del proyecto
  authDomain:        "mi-proyecto.firebaseapp.com",
  databaseURL:       "https://mi-proyecto-default-rtdb.firebaseio.com",
  projectId:         "mi-proyecto",
  storageBucket:     "mi-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef123456"
};</pre>

  <h3 class="spec-h3">4.3 Reglas de Seguridad (Realtime Database)</h3>
  <pre>{
  "rules": {
    ".read":  "auth != null",
    ".write": "auth != null",
    "usuarios": {
      "$uid": {
        ".write": "$uid === auth.uid || root.child('admins').child(auth.uid).exists()"
      }
    }
  }
}</pre>

  <!-- 5. ESTRUCTURA -->
  <h2 class="spec-h2">5. Estructura del Proyecto</h2>

  <h3 class="spec-h3">5.1 Árbol de Archivos</h3>
  <pre>apoyos-escalera/
├── index.html          # Punto de entrada principal
├── css/
│   └── styles.css      # Estilos globales
├── js/
│   ├── app.js          # Lógica principal de la aplicación
│   ├── auth.js         # Gestión de autenticación Firebase
│   ├── map.js          # Inicialización y control del mapa Leaflet
│   ├── database.js     # Operaciones CRUD con Firebase RTDB
│   └── roles.js        # Lógica de roles y permisos
├── assets/
│   ├── icons/          # Iconos de marcadores de mapa
│   └── img/            # Imágenes generales
├── firebase.json       # Configuración de Firebase Hosting
└── .firebaserc         # Alias del proyecto Firebase</pre>

  <h3 class="spec-h3">5.2 Esquema de Base de Datos (Realtime Database)</h3>
  <pre>{
  "usuarios": {
    "$uid": {
      "nombre":          "string",
      "rol":             "tecnico | conductor | administrador",
      "lat":             "number",
      "lng":             "number",
      "activo":          "boolean",
      "ultimaConexion":  "timestamp"
    }
  },
  "eventos": {
    "$eventoId": {
      "tipo":        "string",
      "descripcion": "string",
      "lat":         "number",
      "lng":         "number",
      "creadoPor":   "uid",
      "timestamp":   "timestamp",
      "estado":      "activo | resuelto"
    }
  }
}</pre>

  <!-- 6. DESPLIEGUE -->
  <h2 class="spec-h2">6. Instalación y Despliegue</h2>

  <h3 class="spec-h3">6.1 Desarrollo Local</h3>
  <p><strong>Opción A — Servidor HTTP simple con Python:</strong></p>
  <pre># Clonar el repositorio
git clone https://github.com/tu-usuario/apoyos-escalera.git
cd apoyos-escalera

# Iniciar servidor local (Python 3)
python3 -m http.server 8080

# Abrir en el navegador
http://localhost:8080</pre>

  <p><strong>Opción B — Live Server con Node.js:</strong></p>
  <pre>npm install -g live-server
live-server --port=8080 --host=localhost</pre>

  <h3 class="spec-h3">6.2 Despliegue en Firebase Hosting</h3>
  <pre># Autenticarse en Firebase
firebase login

# Inicializar proyecto
firebase init hosting
#  > Seleccionar proyecto existente
#  > Directorio público: . (carpeta raíz)
#  > Single-page app: No

# Desplegar
firebase deploy --only hosting
# URL resultado: https://mi-proyecto.web.app</pre>

  <h3 class="spec-h3">6.3 Despliegue en Servidor Propio (VPS/Nginx)</h3>
  <pre># Instalar Nginx
sudo apt install nginx -y

# Copiar archivos al directorio web
sudo cp -r apoyos-escalera/* /var/www/html/

# Habilitar HTTPS con Certbot (REQUERIDO para Geolocation API)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tudominio.com</pre>

  <!-- 7. ROLES -->
  <h2 class="spec-h2">7. Roles y Permisos del Sistema</h2>
  <table class="spec-table perm-table">
    <thead>
      <tr><th>Acción</th><th>Técnico</th><th>Conductor</th><th>Administrador</th><th>Sin Sesión</th></tr>
    </thead>
    <tbody>
      <tr><td>Ver mapa</td><td class="ok">✅</td><td class="ok">✅</td><td class="ok">✅</td><td class="bad">❌</td></tr>
      <tr><td>Ver ubicación de otros</td><td class="ok">✅</td><td class="ok">✅</td><td class="ok">✅</td><td class="bad">❌</td></tr>
      <tr><td>Compartir su ubicación</td><td class="ok">✅</td><td class="ok">✅</td><td class="ok">✅</td><td class="bad">❌</td></tr>
      <tr><td>Crear eventos</td><td class="ok">✅</td><td class="bad">❌</td><td class="ok">✅</td><td class="bad">❌</td></tr>
      <tr><td>Resolver eventos</td><td class="ok">✅</td><td class="bad">❌</td><td class="ok">✅</td><td class="bad">❌</td></tr>
      <tr><td>Gestionar usuarios</td><td class="bad">❌</td><td class="bad">❌</td><td class="ok">✅</td><td class="bad">❌</td></tr>
      <tr><td>Ver panel admin</td><td class="bad">❌</td><td class="bad">❌</td><td class="ok">✅</td><td class="bad">❌</td></tr>
    </tbody>
  </table>

  <!-- 8. SEGURIDAD -->
  <h2 class="spec-h2">8. Variables de Entorno y Seguridad</h2>

  <h3 class="spec-h3">8.1 Manejo de Credenciales</h3>
  <div class="callout">⚠️ El objeto <code>firebaseConfig</code> se incluye en el código cliente. Esto es comportamiento esperado por Firebase; la seguridad real se gestiona mediante Firebase Security Rules, NO ocultando las claves.</div>
  <ul class="spec-ul">
    <li>Nunca incluir credenciales de administrador del SDK Admin en el frontend</li>
    <li>Restringir el uso de la API Key en Google Cloud Console a dominios específicos</li>
    <li>Configurar Firebase Security Rules estrictamente antes de ir a producción</li>
    <li>Activar App Check de Firebase para prevenir abuso de la API</li>
  </ul>

  <h3 class="spec-h3">8.2 HTTPS Obligatorio</h3>
  <table class="spec-table">
    <thead><tr><th>Entorno</th><th>URL</th><th>Geolocation API</th></tr></thead>
    <tbody>
      <tr><td>Desarrollo local</td><td>http://localhost:8080</td><td><span class="ok">✅ Permitido</span></td></tr>
      <tr><td>Firebase Hosting</td><td>https://proyecto.web.app</td><td><span class="ok">✅ Permitido</span></td></tr>
      <tr><td>VPS con Certbot</td><td>https://tudominio.com</td><td><span class="ok">✅ Permitido</span></td></tr>
      <tr><td>HTTP en servidor propio</td><td>http://tudominio.com</td><td><span class="bad">❌ Bloqueado</span></td></tr>
    </tbody>
  </table>

  <!-- 9. VERIFICACIÓN -->
  <h2 class="spec-h2">9. Verificación Post-Instalación</h2>
  <h3 class="spec-h3">9.1 Checklist de Validación</h3>
  <ul class="checklist">
    <li><span class="num">1</span><span class="prueba">Abrir index.html en navegador</span><span class="expected">Carga sin errores en consola</span></li>
    <li><span class="num">2</span><span class="prueba">El mapa se renderiza</span><span class="expected">Tiles de OpenStreetMap visibles</span></li>
    <li><span class="num">3</span><span class="prueba">Iniciar sesión con usuario de prueba</span><span class="expected">Redirige al panel según rol</span></li>
    <li><span class="num">4</span><span class="prueba">Activar compartir ubicación</span><span class="expected">Marcador propio aparece en el mapa</span></li>
    <li><span class="num">5</span><span class="prueba">Abrir en segundo dispositivo / pestaña</span><span class="expected">Ambos marcadores visibles simultáneamente</span></li>
    <li><span class="num">6</span><span class="prueba">Crear un evento</span><span class="expected">Aparece en el mapa en tiempo real</span></li>
    <li><span class="num">7</span><span class="prueba">Cerrar sesión</span><span class="expected">Redirige al login, marcador desaparece</span></li>
  </ul>

  <h3 class="spec-h3">9.2 Comandos de Diagnóstico</h3>
  <pre># Verificar versión de Node.js
node --version

# Verificar Firebase CLI
firebase --version

# Ver proyectos Firebase vinculados
firebase projects:list

# Ver logs de despliegue
firebase hosting:channel:list</pre>

  <!-- 10. SOPORTE -->
  <h2 class="spec-h2">10. Soporte Técnico y Referencias</h2>

  <h3 class="spec-h3">10.1 Documentación Oficial</h3>
  <ul class="spec-ul">
    <li>Firebase Documentation: <a href="https://firebase.google.com/docs" style="color:var(--accent)">firebase.google.com/docs</a></li>
    <li>Leaflet.js API Reference: <a href="https://leafletjs.com/reference.html" style="color:var(--accent)">leafletjs.com/reference.html</a></li>
    <li>Firebase Realtime Database: <a href="https://firebase.google.com/docs/database" style="color:var(--accent)">firebase.google.com/docs/database</a></li>
    <li>Firebase Authentication: <a href="https://firebase.google.com/docs/auth" style="color:var(--accent)">firebase.google.com/docs/auth</a></li>
    <li>Firebase Security Rules: <a href="https://firebase.google.com/docs/rules" style="color:var(--accent)">firebase.google.com/docs/rules</a></li>
  </ul>

  <h3 class="spec-h3">10.2 Versiones Congeladas del Proyecto</h3>
  <table class="spec-table">
    <thead><tr><th>Dependencia</th><th>Versión Estable Probada</th><th>Notas</th></tr></thead>
    <tbody>
      <tr><td>Node.js</td><td>20.11.0 LTS</td><td>Versión LTS activa en 2024–2026</td></tr>
      <tr><td>Firebase CLI</td><td>13.6.0</td><td>Compatible con SDK v10</td></tr>
      <tr><td>Leaflet.js</td><td>1.9.4</td><td>Última versión estable v1.x</td></tr>
      <tr><td>Firebase SDK (web)</td><td>10.12.0</td><td>Modo compat recomendado</td></tr>
    </tbody>
  </table>

  <!-- DOCS CALLOUT -->
  <div class="docs-callout">
    <p>📁 Para más información, dirigirse a la carpeta <strong>/documentos</strong> donde encontrarás la documentación detallada del sistema.</p>
  </div>

  <div class="spec-footer">
    Documento generado para uso interno técnico — Apoyos Escalera / Conectar © 2026
  </div>

</div><!-- /container -->
</body>
</html>
