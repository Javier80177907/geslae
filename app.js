/*************************************
 * 🔥 CONFIGURACIÓN FIREBASE
 *************************************/
const firebaseConfig = {
  apiKey: "AIzaSyCBr2SKZzltMCKzHFUQprDtS7wuqsdRee4",
  authDomain: "apoyos-escalera.firebaseapp.com",
  databaseURL: "https://apoyos-escalera-default-rtdb.firebaseio.com",
  projectId: "apoyos-escalera",
  storageBucket: "apoyos-escalera.appspot.com",
  messagingSenderId: "604584367658",
  appId: "1:604584367658:web:4c90bc9b4a1a820fecd553"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/*************************************
 * VARIABLES
 *************************************/
let latitud = null;
let longitud = null;
let mapa = null;
let marcadores = {};
let watchID = null;

/*************************************
 * 🔐 LOGIN
 *************************************/
function login() {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === "tecnico@conectar.com" && password === "Conectar2025") {

    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";

    document.getElementById("tecnico").value = "Técnico Conectar";
    document.getElementById("estado").innerText = `👤 ${email}`;

    iniciarMapa();

    // activar seguimiento GPS en tiempo real
    iniciarSeguimientoGPS();

  } else {

    document.getElementById("loginEstado").innerText =
      "❌ Usuario o contraseña incorrectos";

  }
}

/*************************************
 * 🗺️ MAPA
 *************************************/
function iniciarMapa() {

  if (mapa) return;

  mapa = L.map("mapa").setView([4.60971, -74.08175], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(mapa);

  setTimeout(() => {
    mapa.invalidateSize();
  }, 300);

}

/*************************************
 * 📡 SEGUIMIENTO GPS EN TIEMPO REAL
 *************************************/
function iniciarSeguimientoGPS() {

  if (!navigator.geolocation) {
    alert("❌ El navegador no soporta geolocalización");
    return;
  }

  document.getElementById("ubicacion").innerText =
    "📡 Activando GPS...";

  watchID = navigator.geolocation.watchPosition(

    (pos) => {

      latitud = pos.coords.latitude;
      longitud = pos.coords.longitude;

      document.getElementById("ubicacion").innerText =
        `📍 ${latitud.toFixed(6)}, ${longitud.toFixed(6)}`;

      if (mapa) {
        mapa.setView([latitud, longitud], 16);
      }

    },

    (error) => {

      document.getElementById("ubicacion").innerText =
        "❌ No se pudo obtener ubicación";

    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 2000
    }

  );
}

/*************************************
 * 🚨 SOLICITAR APOYO
 *************************************/
function solicitarApoyo() {

  const tecnico = document.getElementById("tecnico").value.trim();

  if (!tecnico) {
    alert("⚠️ Ingrese el nombre del técnico");
    return;
  }

  if (latitud === null || longitud === null) {
    alert("📡 Esperando señal GPS...");
    return;
  }

  db.ref("solicitudes").push({
    tecnico: tecnico,
    latitud: latitud,
    longitud: longitud,
    fecha: new Date().toISOString(),
    estado: "pendiente"
  });

  document.getElementById("estado").innerText =
    "✅ Apoyo enviado correctamente";

}

/*************************************
 * 📡 COLA DE SOLICITUDES EN TIEMPO REAL
 *************************************/
const lista = document.getElementById("listaSolicitudes");

db.ref("solicitudes").on("value", (snapshot) => {

  lista.innerHTML = "";

  if (mapa) {
    Object.values(marcadores).forEach(m => mapa.removeLayer(m));
    marcadores = {};
  }

  if (!snapshot.exists()) {
    lista.innerHTML = "<li>No hay solicitudes</li>";
    return;
  }

  snapshot.forEach((child) => {

    const s = child.val();

    const li = document.createElement("li");

    li.innerHTML = `
      🪜 <b>${s.tecnico}</b><br>
      🕒 ${new Date(s.fecha).toLocaleString()}<br>
      📌 ${s.estado}
      <hr>
    `;

    lista.appendChild(li);

    if (mapa) {

      const marker = L.marker([s.latitud, s.longitud])
        .addTo(mapa)
        .bindPopup(`
          <b>${s.tecnico}</b><br>
          ${new Date(s.fecha).toLocaleString()}
        `);

      marcadores[child.key] = marker;

    }

  });

});