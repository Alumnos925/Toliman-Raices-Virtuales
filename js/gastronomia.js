// =========================
// GASTRONOMÍA
// =========================

// SCROLL
function scrollPlatillos() {
    let seccion = document.getElementById("platillos");

    if(seccion){
        seccion.scrollIntoView({
            behavior: "smooth"
        });
    }
}

// FILTRO
function filtrar(tipo){
const tarjetas = document.querySelectorAll(".card");
const historia = document.getElementById("historia");
const galeria = document.getElementById("galeria");

tarjetas.forEach(card => {

    if(tipo === "todos"){
        card.style.display = "block";
    }
    else if(card.dataset.tipo === tipo){
        card.style.display = "block";
    }
    else{
        card.style.display = "none";
    }

});

if(tipo === "todos"){

    historia.style.display = "block";
    galeria.style.display = "block";

}
else{

    historia.style.display = "none";
    galeria.style.display = "none";

}
}

//carrusel//
let posicion = 0;

window.onload = function(){

    setInterval(moverCarrusel, 3000);

};

function moverCarrusel(){

    const carousel = document.getElementById("carousel");

    if(!carousel) return;

    posicion++;

    if(posicion >= carousel.children.length){
        posicion = 0;
    }

    carousel.style.transform =
        `translateX(-${posicion * 100}%)`;
}

//mapa//

function abrirMapa(){
document.getElementById("modalMapa").style.display = "flex";
}

function cerrarMapa(){
document.getElementById("modalMapa").style.display = "none";
}
window.onclick = function(event){

    const modalMapa = document.getElementById("modalMapa");

    if(event.target === modalMapa){
        cerrarMapa();
    }
}