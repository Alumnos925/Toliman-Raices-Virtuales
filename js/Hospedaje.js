/* =========================
   CARRUSEL DE IMÁGENES INICIO
========================= */

let slides = document.querySelectorAll('.slide');
let index = 0;

function cambiarImagen(){

    if(slides.length === 0) return;

    slides[index].classList.remove('active');

    index++;

    if(index >= slides.length){
        index = 0;
    }

    slides[index].classList.add('active');
}

setInterval(cambiarImagen, 4000);


/* =========================
   MODAL DEL MAPA
========================= */

function abrirMapa(){
    let modal = document.getElementById("modalMapa");
    if(modal) modal.style.display = "block";
}

function cerrarMapa(){
    let modal = document.getElementById("modalMapa");
    if(modal) modal.style.display = "none";
}

window.onclick = function(e){
    let modal = document.getElementById("modalMapa");

    if(modal && e.target == modal){
        modal.style.display = "none";
    }
};


/* =========================
   HOSPEDAJE DINÁMICO
========================= */

function mostrarHospedaje(tipo) {

    const contenedor = document.getElementById("contenedorHospedajes");

    if(!contenedor) return;

    let contenido = "";

    if (tipo === "camping") {
        contenido = `<h2>Campings en Tolimán</h2>`;
    }

    if (tipo === "hotel") {
        contenido = `<h2>Hoteles en Tolimán</h2>`;
    }

    if (tipo === "cabana") {
        contenido = `<h2>Cabañas en Tolimán</h2>`;
    }

    contenedor.innerHTML = contenido;
}