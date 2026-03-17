/*****************************************************
 *  APOYOS ESCALERA · firebase.js
 *  Configuración compartida — incluir en todas las páginas
 *****************************************************/
const firebaseConfig = {
  apiKey:            "AIzaSyCBr2SKZzltMCKzHFUQprDtS7wuqsdRee4",
  authDomain:        "apoyos-escalera.firebaseapp.com",
  databaseURL:       "https://apoyos-escalera-default-rtdb.firebaseio.com",
  projectId:         "apoyos-escalera",
  storageBucket:     "apoyos-escalera.appspot.com",
  messagingSenderId: "604584367658",
  appId:             "1:604584367658:web:4c90bc9b4a1a820fecd553"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

/* ── Usuarios del sistema ── */
const USERS = {
  "tecnico@conectar.com":   { pass: "Tec2025", role: "tecnico",   name: "Técnico Conectar" },
  "conductor@conectar.com": { pass: "Con2025", role: "conductor", name: "Conductor Conectar" },
  "admin@conectar.com":     { pass: "Adm2025", role: "admin",     name: "Administrador" }
};

/* ── Sesión en sessionStorage ── */
function guardarSesion(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

function obtenerSesion() {
  try { return JSON.parse(sessionStorage.getItem("user")); }
  catch { return null; }
}

function cerrarSesion() {
  sessionStorage.removeItem("user");
  window.location.href = "index.html";
}

/* ── Helpers compartidos ── */
function minutosTranscurridos(fechaISO) {
  return Math.floor((Date.now() - new Date(fechaISO).getTime()) / 60000);
}

function formatTimer(mins) {
  if (mins < 0) mins = 0;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2,"0")}m` : `⏱ ${String(m).padStart(2,"0")} min`;
}

function formatFecha(fechaISO) {
  if (!fechaISO) return "—";
  const d = new Date(fechaISO);
  return d.toLocaleDateString("es-CO", { day:"2-digit", month:"short" }) +
         " " + d.toLocaleTimeString("es-CO", { hour:"2-digit", minute:"2-digit" });
}

function esc(str) {
  if (!str) return "";
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function iconPin(color) {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.3 21.7 0 14 0z"
            fill="${color}" stroke="#0d1320" stroke-width="2"/>
      <circle cx="14" cy="14" r="6" fill="#0d1320" opacity=".7"/>
    </svg>`
  );
  return L.icon({ iconUrl:`data:image/svg+xml,${svg}`, iconSize:[28,36], iconAnchor:[14,36], popupAnchor:[0,-38] });
}

function iconoPorEstado(estado, urgente) {
  const colores = { pendiente: urgente ? "#ff3b3b" : "#f5c400", proceso:"#2979ff", finalizado:"#00e676" };
  return iconPin(colores[estado] || "#f5c400");
}
