Apoyos Escalera

Sistema Operativo de Campo · Conectar
Plataforma web en tiempo real para la gestión y coordinación de apoyos técnicos en campo.


📸 Capturas del Sistema
<br>
Pantalla de Ingreso

<br>
Vista del Administrador
<!-- Reemplaza esta línea con tu imagen: ![Admin](./screenshots/admin.png) -->
[ Inserta aquí imagen del panel admin — screenshots/admin.png ]
<br>
Vista del Conductor
<img src="https://github.com/Javier80177907/geslae/blob/760169c03d5bb9a7288cae8ab800da1aeb6961b2/conductor.jpg" alt="rol conductor">
<br>
Vista del Técnico
<!-- Reemplaza esta línea con tu imagen: ![Técnico](./screenshots/tecnico.png) -->
[ Inserta aquí imagen del panel técnico — screenshots/tecnico.png ]

📖 Descripción
Apoyos Escalera es una aplicación web operativa diseñada para coordinar en tiempo real las solicitudes de apoyo de técnicos en campo. Permite registrar ubicaciones precisas con geocodificación, hacer seguimiento del estado de cada apoyo y visualizar todo en un mapa interactivo. Construida sobre Firebase Realtime Database, garantiza sincronización instantánea entre todos los roles del sistema.

✨ Funcionalidades
🔐 Autenticación por Roles

Sistema de login con tres perfiles diferenciados: Administrador, Conductor y Técnico
Sesión protegida mediante sessionStorage; redirección automática según el rol
Credenciales de prueba incluidas para demostración rápida

📡 Técnico — Solicitar Apoyo

Formulario para registrar nombre, dirección y número de celular
Geocodificación en tiempo real vía Nominatim (OpenStreetMap): sugerencias automáticas al escribir
Pin arrastrable en el mapa para ajustar la posición exacta con precisión
Geocodificación inversa al soltar el pin (actualiza automáticamente la dirección)
Historial completo de apoyos con estado y temporizador en vivo

🚗 Conductor — Gestión de Apoyos

Listado en tiempo real de todos los apoyos activos
Cambio de estado: Pendiente → En Proceso → Finalizado
Mapa interactivo con marcadores por estado (amarillo / azul / verde)
Tarjetas con temporizador en vivo y alerta visual cuando supera los 40 minutos
Click en tarjeta o marcador para enfocar el mapa en esa ubicación

🛡️ Administrador — Control Total

Todas las funcionalidades del Conductor
Panel adicional para crear solicitudes directamente desde el admin
Estadísticas en tiempo real: Total, Pendientes, En Proceso, Finalizados
Mapa dual: uno en el listado general y otro en la creación de apoyos

🗺️ Mapa en Tiempo Real

Basado en Leaflet + OpenStreetMap
Marcadores con colores según estado y urgencia
Animación flyTo al seleccionar un apoyo
Popups con información completa del técnico
