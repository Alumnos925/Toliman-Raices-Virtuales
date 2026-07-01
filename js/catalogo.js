function abrirCatalogo(tipo){

const modal = document.getElementById("modalCatalogo");
const contenido = document.getElementById("contenidoCatalogo");

modal.style.display = "block";

/* BORDADOS */

if(tipo === "bordados"){

contenido.innerHTML = `

<h2>Bordados Tradicionales</h2>

<p>
Los bordados otomí-chichimecas representan la identidad cultural de Tolimán.
Cada diseño es elaborado a mano con técnicas tradicionales.
</p>

<div class="galeria-catalogo">

<img src="img/bordado1.jpg">
<img src="img/bordado2.jpg">
<img src="img/bordado3.jpg">

</div>

`;

}

/* MADERA */

if(tipo === "madera"){

contenido.innerHTML = `

<h2>Artesanías de Madera</h2>

<p>
Las piezas de madera son talladas artesanalmente y representan
la cultura y tradición de Tolimán.
</p>

<div class="galeria-catalogo">

<img src="img/madera1.jpg">
<img src="img/madera2.jpg">
<img src="img/madera3.jpg">

</div>

`;

}

/* CESTERIA */

if(tipo === "cesteria"){

contenido.innerHTML = `

<h2>Cestería Tradicional</h2>

<p>
La cestería se elabora con palma e ixtle utilizando técnicas ancestrales.
</p>

<div class="galeria-catalogo">

<img src="img/cesteria1.jpg">
<img src="img/cesteria2.jpg">
<img src="img/cesteria3.jpg">

</div>

`;

}

/* CERAMICA */

if(tipo === "ceramica"){

contenido.innerHTML = `

<h2>Cerámica Artesanal</h2>

<p>
La cerámica representa una de las expresiones artísticas más importantes
de la región.
</p>

<div class="galeria-catalogo">

<img src="img/ceramica1.jpg">
<img src="img/ceramica2.jpg">
<img src="img/ceramica3.jpg">

</div>

`;

}

}

/* CERRAR MODAL */

function cerrarCatalogo(){
document.getElementById("modalCatalogo").style.display = "none";
}

/* CERRAR AL DAR CLICK FUERA */

window.onclick = function(e){

const modal = document.getElementById("modalCatalogo");

if(e.target == modal){
modal.style.display = "none";
}

}