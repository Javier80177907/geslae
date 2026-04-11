/*****************************************************
 *  APOYOS ESCALERA · tecnico.js
 *****************************************************/

// Verificar sesión
const sesion = obtenerSesion();
if (!sesion || sesion.role !== "tecnico") {
  window.location.href = "index.html";
}

document.getElementById("topbar-user").innerText = sesion.email;

// Estado
let geoLat      = null;
let geoLng      = null;
let geoDisplay  = null;
let geoDebounce = null;
let geoMarker   = null;
let mapa        = null;
let timerHandle = null;

// Iniciar mapa
window.addEventListener("load", function () {
  mapa = L.map("mapa-crear").setView([4.60971, -74.08175], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(mapa);

  escucharHistorial();
  timerHandle = setInterval(tickTimers, 1000);
});

/* ══════════════════════════════════════════════
   GEOCODIFICACIÓN
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
  geoLat    = parseFloat(result.lat);
  geoLng    = parseFloat(result.lon);
  geoDisplay = result.display_name;
  const parts = result.display_name.split(",");
  document.getElementById("f-direccion").value = parts.slice(0,3).join(",").trim();
  hideSuggestions();
  setGeoStatus("ok", `📍 ${parts.slice(0,2).join(",").trim()}`);
  actualizarCoordsBar(geoLat, geoLng);
  mapa.flyTo([geoLat, geoLng], 17, { animate: true, duration: 0.7 });
  colocarPinArrastrable(geoLat, geoLng);
}

function colocarPinArrastrable(lat, lng) {
  if (geoMarker) { geoMarker.setLatLng([lat, lng]); return; }
  geoMarker = L.marker([lat, lng], { icon: iconPin("#ff6d00"), draggable: true, autoPan: true }).addTo(mapa);
  geoMarker.bindPopup('<b style="color:#ff6d00">📍 Pin ajustable</b><br><small>Arrastra para precisar</small>').openPopup();

  const hint = document.getElementById("map-drag-hint");
  const bar  = document.getElementById("coords-bar");
  if (hint) hint.style.visibility = "visible";
  if (bar)  bar.style.visibility  = "visible";

  geoMarker.on("dragstart", () => geoMarker.closePopup());
  geoMarker.on("drag", e => {
    const ll = e.target.getLatLng();
    geoLat = ll.lat; geoLng = ll.lng;
    actualizarCoordsBar(geoLat, geoLng);
  });
  geoMarker.on("dragend", e => {
    const ll = e.target.getLatLng();
    geoLat = ll.lat; geoLng = ll.lng;
    actualizarCoordsBar(geoLat, geoLng);
    reverseGeocode(geoLat, geoLng);
  });
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
  if (state === "ok")        { dot.classList.add("ok");        span.innerText = text || "Dirección confirmada ✅"; }
  else if (state === "searching") { dot.classList.add("searching"); span.innerText = "Buscando dirección..."; }
  else if (state === "error")     { dot.classList.add("error");     span.innerText = text || "No encontrado"; }
  else { span.innerText = "Escribe una dirección para ubicarla en el mapa"; }
}

function showSpinner(on) {
  const sp = document.getElementById("geo-spinner");
  if (sp) sp.classList.toggle("active", on);
}

document.addEventListener("click", e => { if (!e.target.closest(".geo-field")) hideSuggestions(); });

/* ══════════════════════════════════════════════
   CREAR APOYO
══════════════════════════════════════════════ */
let _lastEnvio = 0;

function crearApoyo() {
  const tecnico   = document.getElementById("f-tecnico").value.trim();
  const direccion = document.getElementById("f-direccion").value.trim();
  const celular   = document.getElementById("f-celular").value.trim();
  const statusEl  = document.getElementById("crear-status");

  const setErr = msg => { statusEl.style.color = "var(--red)"; statusEl.innerText = msg; };

  if (!tecnico)                        return setErr("⚠️ Ingresa el nombre del técnico");
  if (!direccion)                      return setErr("⚠️ Ingresa la dirección");
  if (!celular)                        return setErr("⚠️ Ingresa el número de celular");
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
  if (geoMarker && mapa) { mapa.removeLayer(geoMarker); geoMarker = null; }
  const hint = document.getElementById("map-drag-hint");
  const bar  = document.getElementById("coords-bar");
  const cv   = document.getElementById("coords-val");
  if (hint) hint.style.visibility = "hidden";
  if (bar)  bar.style.visibility  = "hidden";
  if (cv)   cv.innerText = "—";

  setTimeout(() => { statusEl.innerText = ""; }, 5000);
}

/* ══════════════════════════════════════════════
   HISTORIAL EN TIEMPO REAL
══════════════════════════════════════════════ */
function escucharHistorial() {
  db.ref("solicitudes").on("value", snapshot => {
    const list  = document.getElementById("historial-list");
    const badge = document.getElementById("historial-count");
    list.innerHTML = "";

    if (!snapshot.exists()) {
      list.innerHTML = '<li class="historial-empty">Sin apoyos registrados aún</li>';
      badge.innerText = "0";
      return;
    }

    const items = [];
    snapshot.forEach(child => items.push({ key: child.key, data: child.val() }));
    items.sort((a, b) => new Date(b.data.fecha) - new Date(a.data.fecha));

    const badgeMap   = { pendiente:"badge-pendiente", proceso:"badge-proceso", finalizado:"badge-finalizado" };
    const badgeLabel = { pendiente:"PENDIENTE", proceso:"EN PROCESO", finalizado:"FINALIZADO" };

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

    badge.innerText = items.length;
  });
}

/* ══════════════════════════════════════════════
   TIMERS
══════════════════════════════════════════════ */
function tickTimers() {
  document.querySelectorAll("[id^='htimer-']").forEach(el => {
    const key  = el.id.replace("htimer-", "");
    const card = document.getElementById(`hcard-${key}`);
    if (!card) return;
    // Obtener fecha del card buscando en el DOM
    const timeEl = card.querySelector(".h-card-time");
    if (!timeEl) return;
    // Re-leemos desde Firebase en el listener; aquí solo actualizamos el display
  });
}
