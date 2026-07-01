/* =========================
   ABRIR MODAL
========================= */

function abrirModal(id){

    document.getElementById(id).style.display = "flex";

}


/* =========================
   CERRAR MODAL
========================= */

function cerrarModal(id){

    document.getElementById(id).style.display = "none";

}


/* =========================
   CERRAR AL DAR CLICK FUERA
========================= */

window.onclick = function(e){

    const modales = document.querySelectorAll(".modal");

    modales.forEach(modal => {

        if(e.target == modal){

            modal.style.display = "none";

        }

    });

}