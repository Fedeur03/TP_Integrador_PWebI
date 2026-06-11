let asientosElegidos = [];

const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));

window.addEventListener("load", function () {

    const elementoAsientos = document.getElementById("asientos");
    const otrosAsientos = document.getElementById("otros-asientos");

    const mitad = vuelo.asientos.length / 2;

    vuelo.asientos.forEach(function (asiento, indice) {

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

    const contenedor = document.getElementById("contenedor-pasajeros");
    const select = document.getElementById("cantidad-pasajeros-select");

    const pasajerosGuardados = localStorage.getItem("pasajeros");
    const textoPasajeros = document.getElementById("cantidad-pasajeros-texto");

    if (pasajerosGuardados) {

        contenedor.style.display = "none";

        textoPasajeros.textContent = "Pasajeros: " + pasajerosGuardados;

    } else {

        localStorage.setItem("pasajeros", select.value);

        textoPasajeros.textContent = "Pasajeros: " + select.value;

        select.addEventListener("change", function () {

            localStorage.setItem("pasajeros", this.value);

            textoPasajeros.textContent = "Pasajeros: " + this.value;

            actualizarPrecio();
        });
    }

    document.getElementById("ciudad-origen").textContent = vuelo.origen;
    document.getElementById("hora-salida").textContent = vuelo.hora_vuelo;

    document.getElementById("ciudad-destino").textContent = vuelo.destino;
    document.getElementById("hora-llegada").textContent = vuelo.llegada_estimada;

    document.getElementById("duracion").textContent = `${vuelo.duracion_estimada} · ${vuelo.escalas === 0 ? "Sin escalas" : vuelo.escalas + " escala(s)"}`;

    actualizarPrecio();
});

function elegirAsiento(elemento, asiento) {

    if (elemento.classList.contains("seleccionado")) {

        elemento.classList.remove("seleccionado");
        elemento.classList.add("disponible");

        asientosElegidos = asientosElegidos.filter(function (cadaAsiento) {
            return cadaAsiento !== asiento;
        });

    } else {

        if (elemento.classList.contains("ocupado")) {
            return;
        }

        elemento.classList.remove("disponible");
        elemento.classList.add("seleccionado");

        asientosElegidos.push(asiento);
    }

    document.getElementById("nombre-asiento").textContent = asientosElegidos.join(", ");

    localStorage.setItem("asientoElegido", asientosElegidos.join(", "));
}

function validar(event) {

    const cantidadPasajeros =
        parseInt(localStorage.getItem("pasajeros"));

    if (asientosElegidos.length === 0) {
        event.preventDefault();
        alert("Seleccioná al menos un asiento antes de continuar.");
        return;
    }

    if (asientosElegidos.length !== cantidadPasajeros) {
        event.preventDefault();
        alert("Tenés que elegir exactamente " + cantidadPasajeros + " asiento(s), uno por pasajero.");
    }
}

function actualizarPrecio() {

    const cantidadPasajeros = parseInt(localStorage.getItem("pasajeros"));

    let total = vuelo.precio_total_usd;

    if (cantidadPasajeros > 1) {
        total = total + (total * 0.8 * (cantidadPasajeros - 1));
    }

    vuelo.precioFinal = vuelo.precioFinal = total;

    localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));

    document.getElementById("precio-total").textContent =  "$ " + total.toFixed(2) + " USD";
}