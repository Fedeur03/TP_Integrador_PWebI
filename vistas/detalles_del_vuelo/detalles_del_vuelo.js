window.addEventListener('load', function () {
    const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));

    const elementoAsientos = document.getElementById('asientos');
    const otrosAsientos = document.getElementById('otros-asientos');

    const mitad = vuelo.asientos.length / 2;

    vuelo.asientos.forEach(function(asiento, indice) {

        const icono = `
            <i class="fa-solid fa-couch ${asiento.estado}"
               onclick="elegirAsiento(this, '${asiento.id}')">
            </i>
        `;

        if (indice < mitad) {
            elementoAsientos.innerHTML += icono;
        } else {
            otrosAsientos.innerHTML += icono;
        }
    });
});

function elegirAsiento(elemento, asiento) {

    if (elemento.classList.contains("seleccionado")) {
        elemento.classList.remove("seleccionado");
        elemento.classList.add("disponible");

        asientosElegidos = asientosElegidos.filter(function (cadaAsiento) {
            return cadaAsiento !== asiento;
        });

    } else {
        elemento.classList.remove("disponible");
        if (elemento.classList.contains("ocupado")) {
            return;
        }
        elemento.classList.add("seleccionado");

        asientosElegidos.push(asiento);
    }

    document.getElementById("nombre-asiento").textContent = asientosElegidos.join(", ");
    localStorage.setItem("asientoElegido", asientosElegidos.join(", "));
}

let asientosElegidos = [];
const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));

if (vuelo) {
    document.getElementById("ruta").textContent = vuelo.origen + " → " + vuelo.destino;
    document.getElementById("hora-salida").textContent = vuelo.salida;
    document.getElementById("ciudad-origen").textContent = vuelo.origen;
    document.getElementById("hora-llegada").textContent = vuelo.llegada;
    document.getElementById("ciudad-destino").textContent = vuelo.destino;
    document.getElementById("duracion").textContent = vuelo.duracion;
    document.getElementById("precio-total").textContent = "$ " + vuelo.precio_total_usd + " USD";
}

function validar(event) {
    if (asientosElegidos.length === 0) {
        event.preventDefault();
        alert("Seleccioná al menos un asiento antes de continuar.");
    }
}