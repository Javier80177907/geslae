/*****************************************************
 *  APOYOS ESCALERA · admin.js
 *****************************************************/

// Verificar sesión
const sesion = obtenerSesion();
if (!sesion || sesion.role !== "admin") {
  window.location.href = "index.html";
}

document.getElementById("topbar-user").innerText = sesion.email;

// Estado
let mapaLista   = null;
let mapaCrear   = null;
let marcadores  = {};
let selectedKey = null;
let apoyosData  = {};
let timerHandle = null;
let geoLat      = null;
let geoLng      = null;
let geoDisplay  = null;
let geoDebounce = null;
let geoMarker   = null;

/* ══════════════════════════════════════════════
   TABS desactiva botones y los activa para q el mapa no quede cortado
══════════════════════════════════════════════ */
function activarTab(btn, tabId) {
  document.querySelectorAll(".tab-btn").forEach(b   => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(tabId).classList.add("active");
  setTimeout(() => {
    if (tabId === "tab-apoyos" && mapaLista) mapaLista.invalidateSize();
    if (tabId === "tab-crear"  && mapaCrear) mapaCrear.invalidateSize();
  }, 60);
}

/* ══════════════════════════════════════════════
   INICIALIZAR cargar datos de firebade y mostrar mapas
══════════════════════════════════════════════ */
window.addEventListener("load", function () {
  // Mapa lista
  mapaLista = L.map("mapa-lista").setView([4.60971, -74.08175], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(mapaLista);

  // Mapa crear
  mapaCrear = L.map("mapa-crear").setView([4.60971, -74.08175], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(mapaCrear);

  escucharSolicitudes();
  timerHandle = setInterval(tickTimers, 1000);
});

/* ══════════════════════════════════════════════
   FIREBASE mantiene sincronizado el listado de apoyos en tiempo real con firebase
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
    renderHistorial();
  });
}

/* ══════════════════════════════════════════════
   RENDER LISTA (tab apoyos) arma lista y construye una tarjeta con cada apoyo
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
    acciones += `<button class="btn-estado btn-proceso"   onclick="cambiarEstado(event,'${key}','proceso')">EN PROCESO</button>`;
  if (s.estado === "proceso")
    acciones += `<button class="btn-estado btn-finalizar" onclick="cambiarEstado(event,'${key}','finalizado')">FINALIZADO</button>`;
  if (s.estado === "finalizado")
    acciones += `<button class="btn-estado btn-proceso"   onclick="cambiarEstado(event,'${key}','proceso')">REABRIR</button>`;
  acciones += `<button class="btn-estado btn-eliminar" onclick="eliminarApoyo(event,'${key}')">ELIMINAR</button>`;

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
   SELECCIONAR APOYO sincroniza la tarjeta con el mapa, 
   resaltando y centrando el apoyo elegido.
══════════════════════════════════════════════ */
function seleccionarApoyo(key) {
  if (selectedKey) {
    document.getElementById(`card-${selectedKey}`)?.classList.remove("selected");
    if (marcadores[selectedKey]) marcadores[selectedKey].setZIndexOffset(0);
  }
  selectedKey = key;
  document.getElementById(`card-${key}`)?.classList.add("selected");

  const s = apoyosData[key];
  if (mapaLista && s) {
    mapaLista.flyTo([s.latitud, s.longitud], 17, { animate: true, duration: 0.8 });
    const marker = marcadores[key];
    if (marker) { marker.openPopup(); marker.setZIndexOffset(1000); }
  }
}

/* ══════════════════════════════════════════════
   MARCADORES actualiza mapa con seleccion de marcadores y actualiza tarjeta
══════════════════════════════════════════════ */
function renderMarcadores() {
  Object.values(marcadores).forEach(m => mapaLista.removeLayer(m));
  marcadores = {};

  Object.entries(apoyosData).forEach(([key, s]) => {
    if (!s.latitud || !s.longitud) return;
    const mins    = minutosTranscurridos(s.fecha);
    const urgente = s.estado !== "finalizado" && mins >= 40;
    const marker  = L.marker([s.latitud, s.longitud], { icon: iconoPorEstado(s.estado, urgente) })
      .addTo(mapaLista)
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
   HISTORIAL (columna derecha tab crear)
══════════════════════════════════════════════ */
function renderHistorial() {
  const list  = document.getElementById("historial-list");
  const badge = document.getElementById("historial-count");
  if (!list) return;
  list.innerHTML = "";

  const items = Object.entries(apoyosData)
    .map(([key, data]) => ({ key, data }))
    .sort((a, b) => new Date(b.data.fecha) - new Date(a.data.fecha));

  const badgeMap   = { pendiente:"badge-pendiente", proceso:"badge-proceso", finalizado:"badge-finalizado" };
  const badgeLabel = { pendiente:"PENDIENTE", proceso:"EN PROCESO", finalizado:"FINALIZADO" };

  if (items.length === 0) {
    list.innerHTML = '<li class="historial-empty">Sin apoyos registrados aún</li>';
    if (badge) badge.innerText = "0";
    return;
  }

  items.forEach(({ key, data: s }) => {
    const mins = minutosTranscurridos(s.fecha);
    const li   = document.createElement("li");
    li.className = `h-card estado-${s.estado || "pendiente"}`;
    li.id = `hcard-${key}`;
    li.innerHTML = `
      <div class="h-card-top">
        <div class="h-card-name">👷 ${esc(s.tecnico)}</div>
        <span class="h-card-badge ${badgeMap[s.estado] || "badge-pendiente"}">${badgeLabel[s.estado] || s.estado}</span>
      </div>
      <div class="h-card-row multiline"><span class="row-icon">📍</span><span class="row-text">${esc(s.direccion || "—")}</span></div>
      <div class="h-card-row"><span class="row-icon">📞</span><span class="row-text">${esc(s.celular || "—")}</span></div>
      <div class="h-card-row"><span class="row-icon">🌐</span><span class="row-text">${s.latitud ? s.latitud.toFixed(5)+", "+s.longitud.toFixed(5) : "—"}</span></div>
      <hr class="h-card-divider">
      <div class="h-card-footer">
        <span class="h-card-time">${formatFecha(s.fecha)}</span>
        <span class="h-card-timer" id="htimer-${key}">${formatTimer(mins)}</span>
      </div>`;
    list.appendChild(li);
  });

  if (badge) badge.innerText = items.length;
}

/* ══════════════════════════════════════════════
   CAMBIAR ESTADO / ELIMINAR
══════════════════════════════════════════════ */
function cambiarEstado(e, key, nuevoEstado) {
  e.stopPropagation();
  db.ref(`solicitudes/${key}`).update({ estado: nuevoEstado });
}

function eliminarApoyo(e, key) {
  e.stopPropagation();
  if (!confirm("¿Eliminar este apoyo?")) return;
  db.ref(`solicitudes/${key}`).remove();
  if (selectedKey === key) selectedKey = null;
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
    // Timer en lista
    const el = document.getElementById(`timer-${key}`);
    if (el) {
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
    }
    // Timer en historial
    const hel = document.getElementById(`htimer-${key}`);
    if (hel) {
      const mins = minutosTranscurridos(s.fecha);
      hel.innerText = formatTimer(mins);
      hel.className = "h-card-timer";
      if (s.estado !== "finalizado") {
        if (mins >= 45) hel.classList.add("alert");
        else if (mins >= 35) hel.classList.add("warn");
      }
    }
  });
}

/* ══════════════════════════════════════════════
   GEOCODIFICACIÓN (tab crear admin)
══════════════════════════════════════════════ */
function onDireccionInput() {
  const q = document.getElementById("f-direccion").value.trim();
  geoLat = geoLng = geoDisplay = null;
  setGeoStatus("idle");
  hideSuggestions();
  if (q.length < 5) return;
  clearTimeout(geoDebounce);
  geoDebounce = setTimeout(() => buscarDireccion(q), 600);
}

function buscarDireccion(q) {
  setGeoStatus("searching");
  showSpinner(true);
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ", Colombia")}&format=json&limit=5&addressdetails=1`;
  fetch(url, { headers: { "Accept-Language": "es" } })
    .then(r => r.json())
    .then(results => {
      showSpinner(false);
      if (!results || results.length === 0) { setGeoStatus("error", "No se encontró la dirección"); return; }
      setGeoStatus("idle");
      mostrarSugerencias(results);
    })
    .catch(() => { showSpinner(false); setGeoStatus("error", "Error al buscar dirección"); });
}

function mostrarSugerencias(results) {
  const ul = document.getElementById("geo-suggestions");
  ul.innerHTML = "";
  results.forEach(r => {
    const li    = document.createElement("li");
    li.className = "geo-suggestion-item";
    const parts  = r.display_name.split(",");
    li.innerHTML = `${esc(parts.slice(0,2).join(",").trim())}<small>${esc(parts.slice(2,5).join(",").trim())}</small>`;
    li.onclick   = () => confirmarDireccion(r);
    ul.appendChild(li);
  });
  ul.classList.add("open");
}

function confirmarDireccion(result) {
  geoLat = parseFloat(result.lat);
  geoLng = parseFloat(result.lon);
  geoDisplay = result.display_name;
  const parts = result.display_name.split(",");
  document.getElementById("f-direccion").value = parts.slice(0,3).join(",").trim();
  hideSuggestions();
  setGeoStatus("ok", `📍 ${parts.slice(0,2).join(",").trim()}`);
  actualizarCoordsBar(geoLat, geoLng);
  mapaCrear.flyTo([geoLat, geoLng], 17, { animate: true, duration: 0.7 });
  colocarPinArrastrable(geoLat, geoLng);
}

function colocarPinArrastrable(lat, lng) {
  if (geoMarker) { geoMarker.setLatLng([lat, lng]); return; }
  geoMarker = L.marker([lat, lng], { icon: iconPin("#ff6d00"), draggable: true, autoPan: true }).addTo(mapaCrear);
  geoMarker.bindPopup('<b style="color:#ff6d00">📍 Pin ajustable</b><br><small>Arrastra para precisar</small>').openPopup();
  document.getElementById("map-drag-hint").style.visibility = "visible";
  document.getElementById("coords-bar").style.visibility   = "visible";
  geoMarker.on("dragstart", () => geoMarker.closePopup());
  geoMarker.on("drag",    e => { const ll = e.target.getLatLng(); geoLat = ll.lat; geoLng = ll.lng; actualizarCoordsBar(geoLat, geoLng); });
  geoMarker.on("dragend", e => { const ll = e.target.getLatLng(); geoLat = ll.lat; geoLng = ll.lng; actualizarCoordsBar(geoLat, geoLng); reverseGeocode(geoLat, geoLng); });
}

function reverseGeocode(lat, lng) {
  setGeoStatus("searching", "Actualizando dirección...");
  fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, { headers: { "Accept-Language": "es" } })
    .then(r => r.json())
    .then(result => {
      if (result && result.display_name) {
        geoDisplay = result.display_name;
        const parts = result.display_name.split(",");
        document.getElementById("f-direccion").value = parts.slice(0,3).join(",").trim();
        setGeoStatus("ok", `📍 ${parts.slice(0,2).join(",").trim()}`);
      }
    })
    .catch(() => setGeoStatus("ok", "📍 Posición ajustada manualmente"));
}

function actualizarCoordsBar(lat, lng) {
  const el = document.getElementById("coords-val");
  if (el) el.innerText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function hideSuggestions() {
  const ul = document.getElementById("geo-suggestions");
  ul.innerHTML = ""; ul.classList.remove("open");
}

function setGeoStatus(state, text) {
  const dot  = document.getElementById("geo-status-dot");
  const span = document.getElementById("geo-status-text");
  dot.className = "geo-status-dot";
  if (state === "ok")             { dot.classList.add("ok");        span.innerText = text || "Dirección confirmada ✅"; }
  else if (state === "searching") { dot.classList.add("searching"); span.innerText = "Buscando dirección..."; }
  else if (state === "error")     { dot.classList.add("error");     span.innerText = text || "No encontrado"; }
  else { span.innerText = "Escribe una dirección para ubicarla en el mapa"; }
}

function showSpinner(on) {
  const sp = document.getElementById("geo-spinner");
  if (sp) sp.classList.toggle("active", on);
}

document.addEventListener("click", e => { if (!e.target.closest(".geo-field")) hideSuggestions(); });

let _lastEnvio = 0;
function crearApoyo() {
  const tecnico   = document.getElementById("f-tecnico").value.trim();
  const direccion = document.getElementById("f-direccion").value.trim();
  const celular   = document.getElementById("f-celular").value.trim();
  const statusEl  = document.getElementById("crear-status");
  const setErr    = msg => { statusEl.style.color = "var(--red)"; statusEl.innerText = msg; };

  if (!tecnico)                          return setErr("⚠️ Ingresa el nombre del técnico");
  if (!direccion)                        return setErr("⚠️ Ingresa la dirección");
  if (!celular)                          return setErr("⚠️ Ingresa el número de celular");
  if (geoLat === null || geoLng === null) return setErr("📍 Selecciona una dirección de la lista");

  const now = Date.now();
  if (now - _lastEnvio < 3000) return;
  _lastEnvio = now;

  db.ref("solicitudes").push({
    tecnico, direccion, celular,
    latitud: geoLat, longitud: geoLng,
    fecha:   new Date().toISOString(),
    estado:  "pendiente",
    creadoPor: sesion.email
  });

  statusEl.style.color = "var(--green)";
  statusEl.innerText   = "✅ Apoyo enviado correctamente";
  document.getElementById("f-tecnico").value   = "";
  document.getElementById("f-direccion").value = "";
  document.getElementById("f-celular").value   = "";
  geoLat = geoLng = geoDisplay = null;
  setGeoStatus("idle");
  if (geoMarker && mapaCrear) { mapaCrear.removeLayer(geoMarker); geoMarker = null; }
  document.getElementById("map-drag-hint").style.visibility = "hidden";
  document.getElementById("coords-bar").style.visibility   = "hidden";
  document.getElementById("coords-val").innerText = "—";
  setTimeout(() => { statusEl.innerText = ""; }, 5000);
}
