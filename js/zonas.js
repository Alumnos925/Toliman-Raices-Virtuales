// ==========================================
// VARIABLES GLOBALES (Mantener intactas)
// ==========================================
let indice = 0;
let imagenesActuales = [];
let zonaActual = "";
let listaActual = [];
let map, routingControl;

// VARIABLES ADICIONALES PARA LA LOGICA OPTIMIZADA DEL MAPA
let userLocation = null;
const markers = {};

// Recuperación de Likes locales
let likes = JSON.parse(localStorage.getItem("likesZonas")) || {};

// Instancia dinámica global que reemplaza el arreglo estático fijo
let zonas = [];

// ==========================================
// CONTROLADOR ASÍNCRONO: CARGA DE DATOS EXTERNOS
// ==========================================
async function cargarZonasDinamicas() {
    try {
        // Lee el archivo de datos independiente
        const response = await fetch('zonas.json');
        zonas = await response.json();
        
        // Ejecuta tus funciones nativas utilizando el JSON cargado
        mostrarZonas(zonas);
        initMap();
    } catch (error) {
        console.error("Error al leer el archivo de configuración zonas.json:", error);
    }
}

// ==========================================
// RENDERIZADO Y FILTROS DE TARJETAS (Intacto)
// ==========================================
function mostrarZonas(lista) {
    listaActual = lista;
    const contenedor = document.getElementById("contenedorZonas");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    lista.forEach((zona, idx) => {
        const totalLikes = likes[zona.nombre] || 0;
        contenedor.innerHTML += `
            <div class="card-zona" onclick="abrirModal(${idx})">
                <img src="${zona.imagenes[0]}" alt="${zona.nombre}">
                <div class="info-box">
                    <h3>${zona.nombre}</h3>
                    <p>${zona.desc}</p>
                    <p style="font-weight: bold; color: #1b4332;">❤️ <span>${totalLikes}</span></p>
                </div>
            </div>
        `;
    });
}

function filtrarZonas(categoria) {
    if (categoria === "todas") {
        mostrarZonas(zonas);
    } else {
        const filtradas = zonas.filter(zona => zona.categoria === categoria);
        mostrarZonas(filtradas);
    }
}

// ==========================================
// GESTIÓN DEL MODAL INTERACTIVO (Intacto)
// ==========================================
function abrirModal(idx) {
    const zona = listaActual[idx];
    if (!zona) return;

    document.getElementById("modal").style.display = "block";
    zonaActual = zona.nombre;
    document.getElementById("modalTitulo").innerText = zona.nombre;
    document.getElementById("modalDesc").innerText = zona.desc;
    
    imagenesActuales = zona.imagenes;
    indice = 0;
    document.getElementById("modalImg").src = imagenesActuales[indice];
    document.getElementById("mapaFrame").src = zona.mapa;
    document.getElementById("likeCount").innerText = likes[zonaActual] || 0;
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

function cambiarImagen(dir) {
    indice += dir;
    if (indice < 0) indice = imagenesActuales.length - 1;
    if (indice >= imagenesActuales.length) indice = 0;
    document.getElementById("modalImg").src = imagenesActuales[indice];
}

function darLike() {
    if (!likes[zonaActual]) likes[zonaActual] = 0;
    likes[zonaActual]++;
    localStorage.setItem("likesZonas", JSON.stringify(likes));
    document.getElementById("likeCount").innerText = likes[zonaActual];
    mostrarZonas(listaActual);
}

// ==========================================
// NUEVA FUNCIÓN OPTIMIZADA: initMap() (Intacto)
// ==========================================
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    if (map) {
        map.remove();
    }

    setTimeout(() => {
        // Inicialización del objeto Mapa centrado en Tolimán
        map = L.map('map').setView([20.8897, -99.9144], 11);
        
        // Carga de la capa base de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const poiListContainer = document.getElementById("poiList");
        if (poiListContainer) poiListContainer.innerHTML = "";

        // Dibujar marcadores con imágenes y generar la barra lateral
        zonas.forEach(zona => {
            // Contenido dinámico del popup incluyendo la primera imagen de la base de datos
            const popupContent = `
                <div style="max-width: 200px;">
                    <img src="${zona.imagenes[0]}" alt="${zona.nombre}" style="width:100%; height:auto; border-radius:8px; margin-bottom:5px; display:block;">
                    <h4 style="margin:0 0 5px 0; font-size:1.1rem; color:#1b4332;">${zona.nombre}</h4>
                    <p style="margin:0; font-size:0.85em; color:#566; line-height:1.3;">${zona.desc}</p>
                </div>
            `;

            // Guarda la referencia del marcador usando su nombre como clave
            markers[zona.nombre] = L.marker([zona.lat, zona.lng])
                .addTo(map)
                .bindPopup(popupContent);

            // Genera el elemento en la barra lateral izquierda de Puntos de Interés
            if (poiListContainer) {
                poiListContainer.innerHTML += `
                    <div class="poi-item" onclick="focusPoi('${zona.nombre}', ${zona.lat}, ${zona.lng})">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:1.3rem;">${zona.icono}</span>
                            <div>
                                <strong>${zona.nombre}</strong>
                                <small style="display:block; color:#666; text-transform:capitalize;">${zona.categoria}</small>
                            </div>
                        </div>
                        <button style="background:none; border:none; cursor:pointer; font-size:1.1rem;" onclick="event.stopPropagation(); calculateRoute(${zona.lat}, ${zona.lng}, '${zona.nombre}')">🚗</button>
                    </div>
                `;
            }
        });

        map.invalidateSize();

    }, 350); 
}

// ==========================================
// UTILIDADES DEL MAPA (ACCIONES MODIFICADAS)
// ==========================================
function focusPoi(nombre, lat, lng) {
    map.setView([lat, lng], 14, { animate: true });
    if (markers[nombre]) {
        markers[nombre].openPopup();
    }
}

// ==========================================
// CONTROL DE RUTAS CON LEAFLET ROUTING MACHINE
// ==========================================
function calculateRoute(destLat, destLng, destNombre) {
    if (!userLocation) {
        alert("Por favor, activa primero tu ubicación con el botón '📍 Mi Ubicación'.");
        return;
    }

    if (routingControl) map.removeControl(routingControl);

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(destLat, destLng)
        ],
        createMarker: function() { return null; },
        routeWhileDragging: false,
        show: false
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        
        const distancia = (summary.totalDistance / 1000).toFixed(1) + ' km';
        const tiempo = Math.round(summary.totalTime / 60) + ' min';

        const routeInfo = document.getElementById('routeInfo');
        if (routeInfo) {
            document.getElementById('routeDistance').innerText = `Distancia: ${distancia}`;
            document.getElementById('routeTime').innerText = `Tiempo estimado: ${tiempo}`;
            routeInfo.style.display = 'block';

            const googleMapsLink = document.getElementById('googleMapsLink');
            if (googleMapsLink) {
                googleMapsLink.href = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${destLat},${destLng}&travelmode=driving`;
            }
        }
    });
}

// Vinculación explícita global para interacción desde la vista HTML
window.filtrarZonas = filtrarZonas;
window.focusPoi = focusPoi;
window.calculateRoute = calculateRoute;

// ==========================================
// MANEJADORES DE EVENTOS DEL DOM
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Inicializa la lectura dinámica del JSON
    cargarZonasDinamicas();

    // Evento para obtener la localización del usuario
    const btnUbicacion = document.getElementById("btnMiUbicacion");
    if (btnUbicacion) {
        btnUbicacion.addEventListener("click", () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    userLocation = [lat, lng];

                    if (markers['user']) {
                        markers['user'].setLatLng(userLocation);
                    } else {
                        markers['user'] = L.circleMarker(userLocation, {
                            color: '#1b4332',
                            fillColor: '#2d6a4f',
                            fillOpacity: 0.6,
                            radius: 8
                        }).addTo(map).bindPopup("<b>Tu Ubicación Actual</b>");
                    }

                    map.setView(userLocation, 14, { animate: true });
                    markers['user'].openPopup();
                }, () => {
                    alert("No se pudo obtener acceso a tu geolocalización.");
                });
            }
        });
    }

    // Evento para limpiar las rutas trazadas
    const btnClearRoute = document.getElementById('clearRoute');
    if (btnClearRoute) {
        btnClearRoute.addEventListener('click', () => {
            if (routingControl) {
                map.removeControl(routingControl);
                routingControl = null;
            }
            const routeInfo = document.getElementById('routeInfo');
            if (routeInfo) routeInfo.style.display = 'none';
        });
    }
});