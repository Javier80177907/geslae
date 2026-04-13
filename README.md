<h1>Apoyos Escalera</h1>

Sistema Operativo de Campo · Conectar
Plataforma web en tiempo real para la gestión y coordinación de apoyos técnicos en campo.

<h1>https://apoyosweb.netlify.app/

<h2>📸 Capturas del Sistema</h2>

<br>
<h3>Pantalla de Ingreso</h3>
<br>
<br>
<img src="https://github.com/Javier80177907/geslae/blob/cf13d2c74d69572605f4501abc4b2c332fac0dc4/escalera.jpg" alt="rol inicio">
<br>
<br>
<h3>Vista del Administrador</h3>
<br>
<br>
<img src="https://github.com/Javier80177907/geslae/blob/f0d37d757cf0269b45f94cc27b3e6bc4dbf313b0/admin.jpg" alt="rol admin">
<br>
<br>
<h3>Vista del Conductor</h3>
<br>
<br>
<img src="https://github.com/Javier80177907/geslae/blob/760169c03d5bb9a7288cae8ab800da1aeb6961b2/conductor.jpg" alt="rol conductor">
<br>
<br>
<h3>Vista del Técnico</h3>
<br>
<br>
<img src=https://github.com/Javier80177907/geslae/blob/6f28542b2e152459c6fecac10f27dfc2498cbebf/tecnico.jpg alt="rol tecnico">
<br>
<br>
<h2>📖 Descripción</h2>
<br>
Apoyos Escalera es una aplicación web operativa diseñada para coordinar en tiempo real las solicitudes de apoyo de técnicos en campo. Permite registrar ubicaciones precisas con geocodificación, hacer seguimiento del estado de cada apoyo y visualizar todo en un mapa interactivo. Construida sobre Firebase Realtime Database, garantiza sincronización instantánea entre todos los roles del sistema.
<br>
<br>
<h2>✨ Funcionalidades</h2>
<br>
<br>
<h3>🔐 Autenticación por Roles</h3>
<br>
Sistema de login con tres perfiles diferenciados: Administrador, Conductor y Técnico
Sesión protegida mediante sessionStorage; redirección automática según el rol
Credenciales de prueba incluidas para demostración rápida
<br>
<br>
<h3>📡 Técnico — Solicitar Apoyo</h3>
<br>
Formulario para registrar nombre, dirección y número de celular
Geocodificación en tiempo real vía Nominatim (OpenStreetMap): sugerencias automáticas al escribir
Pin arrastrable en el mapa para ajustar la posición exacta con precisión
Geocodificación inversa al soltar el pin (actualiza automáticamente la dirección)
Historial completo de apoyos con estado y temporizador en vivo
<br>
<br>
<h3>🚗 Conductor — Gestión de Apoyos</h3>
<br>
Listado en tiempo real de todos los apoyos activos
Cambio de estado: Pendiente → En Proceso → Finalizado
Mapa interactivo con marcadores por estado (amarillo / azul / verde)
Tarjetas con temporizador en vivo y alerta visual cuando supera los 40 minutos
Click en tarjeta o marcador para enfocar el mapa en esa ubicación
<br>
<br>
<h3>🛡️ Administrador — Control Total</h3>
<br>
Todas las funcionalidades del Conductor
Panel adicional para crear solicitudes directamente desde el admin
Estadísticas en tiempo real: Total, Pendientes, En Proceso, Finalizados
Mapa dual: uno en el listado general y otro en la creación de apoyos
<br>
<br>
<h3>🗺️ Mapa en Tiempo Real</h3>
<br>
Basado en Leaflet + OpenStreetMap
Marcadores con colores según estado y urgencia
<br>
<br>
<h2>Base de datos-modelo entidad relacion</h2>

<br>
<br>
El presente modelo entidad-relación describe la estructura de datos del sistema Apoyos Escalera, plataforma web de coordinación de técnicos en campo dentro de Conectar. El modelo incorpora tres roles de usuario: Técnico, Conductor y Administrador, cada uno con atributos y responsabilidades específicas.
<br>
<br>

<h2> para mas informacion dirigirse a la carpeta documentos donde encontraremos la documentacion detallada</h2>
<br>
<br>
<img width="3008" height="2216" alt="modelo er" src="https://github.com/user-attachments/assets/8a7dab20-26c8-46a7-bd4e-c7343e534354" />

