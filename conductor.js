/*****************************************************
 *  APOYOS ESCALERA · conductor.js
 *****************************************************/

// Verificar sesión
const sesion = obtenerSesion();
if (!sesion || sesion.role !== "conductor") {
  window.location.href = "index.html";
}

document.getElementById("topbar-user").innerText = sesion.email;

// Estado
let mapa        = null;
let marcadores  = {};
let selectedKey = null;
let apoyosData  = {};
let timerHandle = null;

window.addEventListener("load", function () {
  mapa = L.map("mapa-lista").setView([4.60971, -74.08175], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(mapa);

  escucharSolicitudes();
  timerHandle = setInterval(tickTimers, 1000);
});

/* ══════════════════════════════════════════════
   FIREBASE LISTENER
══════════════════════════════════════════════ */
function escucharSolicitudes() {
  db.ref("solicitudes").on("value", snapshot => {
    apoyosData = {};
    if (snapshot.exists()) {
      snapshot.forEach(child => {
        apoyosData[child.key] = { ...child.val(), _key: child.key };
      });
    }
    renderLista();
    renderMarcadores();
    actualizarStats();
  });
}

/* ══════════════════════════════════════════════
   RENDER TARJETAS
══════════════════════════════════════════════ */
function renderLista() {
  const container = document.getElementById("lista-cards");
  container.innerHTML = "";

  const keys = Object.keys(apoyosData);
  if (keys.length === 0) {
    container.innerHTML = '<div class="empty-state">📭 Sin apoyos activos</div>';
    return;
  }

  const orden = { pendiente: 0, proceso: 1, finalizado: 2 };
  keys.sort((a, b) => {
    const diff = (orden[apoyosData[a].estado] || 0) - (orden[apoyosData[b].estado] || 0);
    return diff !== 0 ? diff : new Date(apoyosData[a].fecha) - new Date(apoyosData[b].fecha);
  });

  keys.forEach(key => container.appendChild(buildCard(key, apoyosData[key])));
}

function buildCard(key, s) {
  const mins    = minutosTranscurridos(s.fecha);
  const urgente = s.estado !== "finalizado" && mins >= 40;

  const card = document.createElement("div");
  card.className = `apoyo-card estado-${s.estado}${urgente ? " urgente" : ""}${selectedKey === key ? " selected" : ""}`;
  card.id = `card-${key}`;
  card.onclick = () => seleccionarApoyo(key);

  const badgeMap   = { pendiente:"badge-pendiente", proceso:"badge-proceso", finalizado:"badge-finalizado" };
  const badgeLabel = { pendiente:"PENDIENTE", proceso:"EN PROCESO", finalizado:"FINALIZADO" };

  let acciones = "";
  if (s.estado === "pendiente")
    acciones = `<button class="btn-estado btn-proceso"   onclick="cambiarEstado(event,'${key}','proceso')">EN PROCESO</button>`;
  else if (s.estado === "proceso")
    acciones = `<button class="btn-estado btn-finalizar" onclick="cambiarEstado(event,'${key}','finalizado')">FINALIZADO</button>`;

  card.innerHTML = `
    <div class="card-top">
      <div class="card-name">👷 ${esc(s.tecnico)}</div>
      <span class="card-badge ${badgeMap[s.estado] || "badge-pendiente"}">${badgeLabel[s.estado] || s.estado}</span>
    </div>
    <div class="card-dir">📍 ${esc(s.direccion || "Sin dirección")}</div>
    <div class="card-tel">📞 ${esc(s.celular || "—")}</div>
    <div class="card-coords">🌐 ${s.latitud ? s.latitud.toFixed(5)+", "+s.longitud.toFixed(5) : "—"}</div>
    <div class="card-date">🕒 ${formatFecha(s.fecha)}</div>
    <div class="card-footer">
      <div class="card-timer" id="timer-${key}">${formatTimer(mins)}</div>
      <div class="card-actions">${acciones}</div>
    </div>`;

  return card;
}

/* ══════════════════════════════════════════════
   SELECCIONAR APOYO → RESALTAR EN MAPA
══════════════════════════════════════════════ */
function seleccionarApoyo(key) {
  if (selectedKey) {
    document.getElementById(`card-${selectedKey}`)?.classList.remove("selected");
    if (marcadores[selectedKey]) marcadores[selectedKey].setZIndexOffset(0);
  }
  selectedKey = key;
  document.getElementById(`card-${key}`)?.classList.add("selected");

  const s = apoyosData[key];
  if (mapa && s) {
    mapa.flyTo([s.latitud, s.longitud], 17, { animate: true, duration: 0.8 });
    const marker = marcadores[key];
    if (marker) { marker.openPopup(); marker.setZIndexOffset(1000); }
  }
}

/* ══════════════════════════════════════════════
   MARCADORES
══════════════════════════════════════════════ */
function renderMarcadores() {
  Object.values(marcadores).forEach(m => mapa.removeLayer(m));
  marcadores = {};

  Object.entries(apoyosData).forEach(([key, s]) => {
    if (!s.latitud || !s.longitud) return;
    const mins    = minutosTranscurridos(s.fecha);
    const urgente = s.estado !== "finalizado" && mins >= 40;
    const marker  = L.marker([s.latitud, s.longitud], { icon: iconoPorEstado(s.estado, urgente) })
      .addTo(mapa)
      .bindPopup(popupContent(s));
    marker.on("click", () => seleccionarApoyo(key));
    marcadores[key] = marker;
  });
}

function popupContent(s) {
  return `
    <div style="font-family:'Barlow',sans-serif;min-width:190px;">
      <div style="font-weight:700;font-size:15px;margin-bottom:6px;">👷 ${esc(s.tecnico)}</div>
      <div style="font-size:12px;color:#6a7d9a;margin-bottom:3px;">📍 ${esc(s.direccion || "—")}</div>
      <div style="font-size:12px;color:#6a7d9a;margin-bottom:3px;">📞 ${esc(s.celular || "—")}</div>
      <div style="font-size:11px;color:#6a7d9a;margin-bottom:6px;">🌐 ${s.latitud ? s.latitud.toFixed(5)+", "+s.longitud.toFixed(5) : "—"}</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;">⏱ ${formatTimer(minutosTranscurridos(s.fecha))}</div>
    </div>`;
}

/* ══════════════════════════════════════════════
   CAMBIAR ESTADO
══════════════════════════════════════════════ */
function cambiarEstado(e, key, nuevoEstado) {
  e.stopPropagation();
  db.ref(`solicitudes/${key}`).update({ estado: nuevoEstado });
}

/* ══════════════════════════════════════════════
   STATS
══════════════════════════════════════════════ */
function actualizarStats() {
  const v = Object.values(apoyosData);
  document.getElementById("stat-total").innerText = v.length;
  document.getElementById("stat-pend").innerText  = v.filter(s => s.estado === "pendiente").length;
  document.getElementById("stat-proc").innerText  = v.filter(s => s.estado === "proceso").length;
  document.getElementById("stat-fin").innerText   = v.filter(s => s.estado === "finalizado").length;
}

/* ══════════════════════════════════════════════
   TIMERS
══════════════════════════════════════════════ */
function tickTimers() {
  Object.entries(apoyosData).forEach(([key, s]) => {
    const el = document.getElementById(`timer-${key}`);
    if (!el) return;
    const mins = minutosTranscurridos(s.fecha);
    el.innerText = formatTimer(mins);
    el.classList.remove("warn", "alert");
    if (s.estado !== "finalizado") {
      if (mins >= 45) el.classList.add("alert");
      else if (mins >= 35) el.classList.add("warn");
    }
    const urgente = s.estado !== "finalizado" && mins >= 40;
    document.getElementById(`card-${key}`)?.classList.toggle("urgente", urgente);
    if (marcadores[key]) marcadores[key].setIcon(iconoPorEstado(s.estado, urgente));
  });
}
