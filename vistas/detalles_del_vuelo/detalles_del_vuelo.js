let asientosElegidos = [];
const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));
const vueltaSelector = document.getElementById("opcionalVuelta");


if (localStorage.getItem("requiereVuelta") === "true") {
    vueltaSelector.style.display = "none";

} else {
    vueltaSelector.style.display = "block";
    corroborarSiEsVuelta(localStorage.getItem('vueloCompra'));
}

window.addEventListener("load", function () {
    const elementoAsientos = document.getElementById("asientos");
    const otrosAsientos = document.getElementById("otros-asientos");
    const mitad = vuelo.asientos.length / 2;

    vuelo.asientos.forEach(function (asiento, indice) {
        const icono = document.createElement("i");
        icono.className = `fa-solid fa-couch ${asiento.estado}`;

        icono.addEventListener("click", function () {
            elegirAsiento(icono, asiento.id);
        });

        if (indice < mitad) {
            elementoAsientos.appendChild(icono);
        } else {
            otrosAsientos.appendChild(icono);
        }
    });

    const contenedor = document.getElementById("contenedor-pasajeros");
    const select = document.getElementById("cantidad-pasajeros-select");
    const pasajerosGuardados = localStorage.getItem("pasajeros");
    const textoPasajeros = document.getElementById("cantidad-pasajeros-texto");

    if (pasajerosGuardados) {
        select.value = pasajerosGuardados;
        textoPasajeros.textContent = "Pasajeros: " + pasajerosGuardados;
    } else {
        localStorage.setItem("pasajeros", select.value);
        textoPasajeros.textContent = "Pasajeros: " + select.value;
    }

    select.addEventListener("change", function () {
        localStorage.setItem("pasajeros", this.value);
        textoPasajeros.textContent = "Pasajeros: " + this.value;
        actualizarPrecio();
    });

    document.getElementById("ciudad-origen").textContent = vuelo.origen;
    document.getElementById("hora-salida").textContent = vuelo.hora_vuelo;
    document.getElementById("ciudad-destino").textContent = vuelo.destino;
    document.getElementById("hora-llegada").textContent = vuelo.llegada_estimada;
    document.getElementById("duracion").textContent =
        `${vuelo.duracion_estimada} · ${vuelo.escalas === 0 ? "Sin escalas" : vuelo.escalas + " escala(s)"}`;

    document.getElementById("fecha-del-vuelo").textContent += vuelo.fecha_vuelo;

    actualizarPrecio();
});

function corroborarSiEsVuelta(vueloCompra){
    if(vueloCompra){
        vueltaSelector.style.display = "none";
    }
}

function elegirAsiento(elemento, idAsiento) {
    if (elemento.classList.contains("seleccionado")) {
        elemento.classList.remove("seleccionado");
        elemento.classList.add("disponible");

        asientosElegidos = asientosElegidos.filter(function (cadaAsiento) {
            return cadaAsiento.id !== idAsiento;
        });
    } else {
        if (elemento.classList.contains("ocupado")) {
            return;
        }

        elemento.classList.remove("disponible");
        elemento.classList.add("seleccionado");

        asientosElegidos.push({
            id: idAsiento
        });
    }

    document.getElementById("nombre-asiento").textContent =
        asientosElegidos.map(asiento => asiento.id).join(", ");

    localStorage.setItem("asientoElegido", JSON.stringify(asientosElegidos));
}

function validar(evento) {
    const cantidadPasajeros = parseInt(localStorage.getItem("pasajeros"));

    if (asientosElegidos.length === 0) {
        evento.preventDefault();
        alert("Seleccioná al menos un asiento antes de continuar.");
        return false;
    }

    if (asientosElegidos.length !== cantidadPasajeros) {
        evento.preventDefault();
        alert(
            "Tenés que elegir exactamente " +
            cantidadPasajeros +
            " asiento(s), uno por pasajero."
        );
        return false;
    }

    return true;
}

const finalizado = document.getElementById("continuar");

finalizado.addEventListener("click", function (evento) {
    if (!validar(evento)) {
        return;
    }

    const destino = verificarSiQuiereVuelta();
    window.location.href = destino;
});

function actualizarPrecio() {
    const cantidadPasajeros = parseInt(localStorage.getItem("pasajeros"));
    let total = vuelo.precio_total_usd;

    if (cantidadPasajeros > 1) {
        total = total + (total * 0.8 * (cantidadPasajeros - 1));
    }

    vuelo.precioFinal = total;

    localStorage.setItem(
        "vueloSeleccionado",
        JSON.stringify(vuelo)
    );

    document.getElementById("precio-total").textContent =
        "$ " + total.toFixed(2) + " USD";
}

function verificarSiQuiereVuelta() {
    const vueltaCheckbox = document.getElementById("vuelta");
    const vuelta = vueltaCheckbox.checked;

    const siQuiere = localStorage.getItem("requiereVuelta");

    let vueloCompra =
        JSON.parse(localStorage.getItem("vueloCompra")) || [];

    let vueloExiste = vueloCompra.find(v => v.id === vuelo.id);

    if (!vueloExiste) {
        vueloCompra.push(vuelo);
    }

    localStorage.setItem(
        "vueloCompra",
        JSON.stringify(vueloCompra)
    );

    if (siQuiere === "true" || vuelta === true) {
        return "../viaje_vuelta/vuelta.html";
    }

    return "../check_out/check_out.html";
}