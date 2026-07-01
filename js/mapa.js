function abrirMapa(url){
    const modal = document.getElementById("modalMapa");
    const frame = document.getElementById("mapaFrame");

    if(modal && frame){
        modal.style.display = "block";
        frame.src = url;
    }
}

function cerrarMapa(){
    const modal = document.getElementById("modalMapa");
    const frame = document.getElementById("mapaFrame");

    if(modal && frame){
        modal.style.display = "none";
        frame.src = "";
    }
}

// cerrar al hacer clic fuera
window.addEventListener("click", function(e){
    const modal = document.getElementById("modalMapa");

    if(modal && e.target === modal){
        modal.style.display = "none";
    }
});