let asientosElegidos = [];

function elegirAsiento(elemento, nombre) {

    if (elemento.classList.contains("seleccionado")) {
        elemento.classList.remove("seleccionado");
        elemento.classList.add("disponible");

        asientosElegidos = asientosElegidos.filter(function (asiento) {
            return asiento !== nombre;
        });

    } else {
        elemento.classList.remove("disponible");
        elemento.classList.add("seleccionado");

        asientosElegidos.push(nombre);
    }

    document.getElementById("nombre-asiento").textContent = asientosElegidos.join(", ");
    localStorage.setItem("asientoElegido", asientosElegidos.join(", "));
}

const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));

if (vuelo) {
    document.getElementById("ruta").textContent = vuelo.origen + " → " + vuelo.destino;
    document.getElementById("hora-salida").textContent = vuelo.salida;
    document.getElementById("ciudad-origen").textContent = vuelo.origen;
    document.getElementById("hora-llegada").textContent = vuelo.llegada;
    document.getElementById("ciudad-destino").textContent = vuelo.destino;
    document.getElementById("duracion").textContent = vuelo.duracion;
    document.getElementById("precio-total").textContent = "$ " + vuelo.precio + " USD";
}

function validar(evento) {
    if (asientosElegidos.length === 0) {
        evento.preventDefault();
        alert("Seleccioná al menos un asiento antes de continuar.");
    }
}