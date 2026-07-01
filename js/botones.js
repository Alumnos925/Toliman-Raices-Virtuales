/* =====================================================
   SISTEMA DE NOTIFICACIONES DE EVENTOS Y FESTIVIDADES
   ===================================================== */

window.onload = async function () {

    // Contenedor HTML donde se mostrará la notificación
    const noti = document.getElementById("notificacion");

    try {

        // Cargar archivo JSON con las festividades
        const respuesta = await fetch("eventos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar eventos.json");
        }

        // Convertir JSON a objeto JavaScript
        const calendario = await respuesta.json();

        // Obtener fecha actual
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const añoActual = hoy.getFullYear();

        // Arreglo donde se guardarán los eventos próximos
        const eventosProximos = [];

        calendario.forEach(evento => {

            const partes = evento.fecha.split("-");

            if (partes.length !== 2) return;

            const mes = parseInt(partes[0], 10);
            const dia = parseInt(partes[1], 10);

            const fechaEvento = new Date(añoActual, mes - 1, dia);
            fechaEvento.setHours(0, 0, 0, 0);

            const diferencia = Math.round(
                (fechaEvento - hoy) / (1000 * 60 * 60 * 24)
            );

            // Buscar eventos entre hoy y los próximos 10 días
            if (diferencia >= 0 && diferencia <= 10) {

                eventosProximos.push({
                    nombre: evento.nombre,
                    descripcion: evento.descripcion,
                    diasRestantes: diferencia
                });

            }

        });

        // Ordenar por cercanía de fecha
        eventosProximos.sort(
            (a, b) => a.diasRestantes - b.diasRestantes
        );

        /* ==========================================================================
           CREACIÓN DEL CONTENIDO DE LA NOTIFICACIÓN CON ANCLAS AUTOMÁTICAS
           ========================================================================== */

        if (eventosProximos.length > 0) {

            let contenido = "";

            contenido += "<strong>🔔 Próximos eventos en Tolimán</strong><br><br>";

            eventosProximos.forEach(evento => {

                // Generar ID limpio para el enlace (Slug) basado en el nombre del evento
                const idLimpio = evento.nombre
                    .toLowerCase()
                    .normalize("NFD")               // Separa letras de acentos
                    .replace(/[\u0300-\u036f]/g, "") // Remueve acentos por completo
                    .replace(/[^a-z0-9\s-]/g, "")     // Elimina caracteres especiales
                    .trim()                          // Borra espacios al inicio/final
                    .replace(/\s+/g, "-");           // Cambia espacios por guiones

                if (evento.diasRestantes === 0) {

                    contenido += `
                        <a href="cultura.html#${idLimpio}" class="enlace-evento-noti">
                            <div class="evento-card">
                                <h4>🎉 Hoy: ${evento.nombre}</h4>
                                <p>${evento.descripcion}</p>
                            </div>
                        </a>
                    `;

                } else {

                    contenido += `
                        <a href="cultura.html#${idLimpio}" class="enlace-evento-noti">
                            <div class="evento-card">
                                <h4>📅 Faltan ${evento.diasRestantes} días</h4>
                                <p><strong>${evento.nombre}</strong></p>
                                <p>${evento.descripcion}</p>
                            </div>
                        </a>
                    `;
                }

            });

            noti.innerHTML = contenido;

        } else {

            // Mensaje por defecto cuando no hay eventos próximos
            noti.innerHTML = `
                🌎 Bienvenido a Tolimán<br>
                <small>Conoce nuestra cultura y tradiciones</small>
            `;
        }

        // Mostrar notificación
        noti.classList.add("mostrar");

        // Ocultar después de 5 segundos (según tu instrucción original en el código)
        setTimeout(() => {
            noti.classList.remove("mostrar");
        }, 5000);

    } catch (error) {

        console.error(error);

        // Mensaje de error
        noti.innerHTML = "⚠ Error al cargar las festividades";
        noti.classList.add("mostrar");

    }

};

/* =====================================================
   FIN DEL SISTEMA DE NOTIFICACIONES
   ===================================================== */

// ==========================================================================
// 1. CARGA ASÍNCRONA DEL ARCHIVO JSON Y RENDERIZADO
// ==========================================================================
window.addEventListener('DOMContentLoaded', async () => {
    // 1. Obtener el parámetro 'lugar' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // 2. Intentar obtener el lugar de la URL
    let lugarParam = urlParams.get('lugar');

    // 3. Array con los 49 IDs válidos para validación
    const comunidadesValidas = [
        "auditorio", "barrio-de-don-lucas", "barrio-de-garcia", "bomintza",
        "calvario", "carrizalillo", "casa-blanca", "casas-viejas", "chalma",
        "colonia-nueva", "crucitas", "diez-meros", "el-blanco", "el-cipres",
        "el-granjeno", "el-lindero", "el-longo", "el-naranjo", "el-sausito",
        "el-tule", "gonzalez", "gudinos", "horno-de-cal", "la-canada",
        "la-estancia", "la-loma", "la-presita", "la-puerta", "la-seboya",
        "lomas-de-casa-blanca", "los-albaniles", "los-eucaliptos", "maguey-manso",
        "mesa-de-chagolla", "mesa-de-ramirez", "nogales", "panales", "puerto-blanco",
        "rancho-viejo", "rincon", "sabino", "san-antonio", "san-miguel",
        "san-pablo", "serrito-parado", "shaminal", "terrero", "tierra-volteada",
        "toliman"
    ];

    // 4. Validar si el parámetro existe en la lista; si no, asignar "calvario" por defecto
    if (!lugarParam || !comunidadesValidas.includes(lugarParam)) {
        console.warn("La comunidad especificada no es válida o está vacía. Cargando 'calvario' por defecto.");
        lugarParam = "calvario";
    } else {
        console.log(`Cargando datos para la comunidad válida: ${lugarParam}`);
    }

    const contenedorPrincipal = document.getElementById('contenedor-dinamico-comunidades');
    if (!contenedorPrincipal) return; // Protección por si no encuentra el contenedor

    try {
        // Hacemos la petición para leer tu archivo JSON externo
        const respuesta = await fetch('comunidades.json'); 
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo JSON");
        
        const infoComunidades = await respuesta.json();

        // Buscamos la comunidad solicitada en el JSON utilizando la variable ya validada
        const datosComunidad = infoComunidades.find(c => c.id === lugarParam);

        if (datosComunidad) {
            // Generamos las tarjetas dinámicamente con los datos del JSON
            let tarjetasHTML = '';
            datosComunidad.eventos.forEach(evento => {
                tarjetasHTML += `
                    <div class="tarjeta-evento" data-lugar="${datosComunidad.nombre}">
                        <div class="badge-fecha">
                            <span class="mes-txt">${evento.mes}</span>
                            <span class="dia-txt">${evento.dia}</span>
                        </div>
                        <img src="${evento.imagen}" alt="Evento" class="imagen-evento">
                        <div class="info-evento">
                            <h3>${evento.titulo}</h3>
                            <p class="ubicacion">
                                <span class="material-symbols-outlined icono-ubicacion">location_on</span>${datosComunidad.nombre}
                            </p>
                            <p class="detalles">
                                <span class="material-symbols-outlined fecha">calendar_month</span> ${evento.fechaTexto}. ${evento.detalles}
                            </p>
                        </div>
                    </div>
                `;
            });

            // Inyectamos la estructura completa en la página web
            contenedorPrincipal.innerHTML = `
                <section id="${datosComunidad.id}" class="seccion-comunidad tradiciones activa" style="display: block !important;">
                    <h2 class="titulo-linea">Calendario de Tradiciones - ${datosComunidad.nombre}</h2>

                    <nav class="filtros-contenedor">
                        <button class="btn-filtro activo" onclick="filtrarMes('todos', event)">Todos</button>
                        <button class="btn-filtro" onclick="filtrarMes('FEB', event)">Feb</button>
                        <button class="btn-filtro" onclick="filtrarMes('MAR', event)">Mar</button>
                        <button class="btn-filtro" onclick="filtrarMes('ABR', event)">Abr</button>
                        <button class="btn-filtro" onclick="filtrarMes('MAY', event)">May</button>
                        <button class="btn-filtro" onclick="filtrarMes('JUN', event)">Jun</button>
                        <button class="btn-filtro" onclick="filtrarMes('JUL', event)">Jul</button>
                        <button class="btn-filtro" onclick="filtrarMes('OCT', event)">Oct</button>
                        <button class="btn-filtro" onclick="filtrarMes('NOV', event)">Nov</button>
                        <button class="btn-filtro" onclick="filtrarMes('DIC', event)">Dic</button>
                    </nav>

                    <main class="contenedor-calendario">
                        ${tarjetasHTML}
                    </main>
                </section>
            `;
        } else {
            contenedorPrincipal.innerHTML = `<h2 class="titulo-linea" style="font-size:30px;">Comunidad no encontrada en el archivo de datos</h2>`;
        }

    } catch (error) {
        console.error("Error al procesar los datos:", error);
        contenedorPrincipal.innerHTML = `<h2 class="titulo-linea" style="font-size:24px; color: red;">Error al cargar el calendario de tradiciones</h2>`;
    }
});

// ==========================================================================
// 2. FUNCIÓN PARA FILTRAR POR MES (Global para que responda al atributo onclick)
// ==========================================================================
window.filtrarMes = function(mes, event) {
    let seccionActual = event.target.closest('section');
    let tarjetas = seccionActual.querySelectorAll('.tarjeta-evento');
    let botones = event.target.parentElement.querySelectorAll('.btn-filtro');

    botones.forEach(btn => btn.classList.remove('activo'));
    event.target.classList.add('activo');

    tarjetas.forEach(tarjeta => {
        let mesTarjeta = tarjeta.querySelector('.mes-txt').textContent.trim();

        if (mes === 'todos' || mesTarjeta === mes) {
            tarjeta.classList.remove('ocultar');
        } else {
            tarjeta.classList.add('ocultar');
        }
    });
}