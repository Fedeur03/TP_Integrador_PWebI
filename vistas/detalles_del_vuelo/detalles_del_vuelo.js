let asientosElegidos = [];
let vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));
const vueloCompraHistorial = JSON.parse(localStorage.getItem("vueloCompra")) || [];

if (vuelo) {
    const vueloGuardado = vueloCompraHistorial.find(cadaVuelo => cadaVuelo.id === vuelo.id);
    if (vueloGuardado) {
        vuelo.asientos = vueloGuardado.asientos;
    }
}

const vueltaSelector = document.getElementById("opcionalVuelta");

if (localStorage.getItem("requiereVuelta") === "true" || localStorage.getItem("esVuelta") === "true") {
    vueltaSelector.style.display = "none";
} else {
    vueltaSelector.style.display = "block";
}

window.addEventListener("load", function () {

    const elementoAsientos = document.getElementById("asientos");
    const otrosAsientos = document.getElementById("otros-asientos");

    if (vuelo && vuelo.asientos) {
        vuelo.asientos.forEach(function (asiento) {

            const icono = document.createElement("i");
            icono.className = `fa-solid fa-couch ${asiento.estado}`;

            icono.addEventListener("click", function () {
                elegirAsiento(icono, asiento.id);
            });

            const letra = asiento.id.slice(-1);

            const columnasIzq = ["A", "B", "C", "D"];

            if (columnasIzq.includes(letra)) {
                elementoAsientos.appendChild(icono);
            } else {
                otrosAsientos.appendChild(icono);
            }
        });
    }

    const pasajerosGuardados = localStorage.getItem("pasajeros");
    const claseGuardada = localStorage.getItem("clase");

    if (pasajerosGuardados && claseGuardada) {

        document.getElementById("contenedor-pasajeros").style.display = "none";

        document.getElementById("cantidad-pasajeros-texto").textContent = "Pasajeros: " + pasajerosGuardados;

        let claseTexto = "Económica";

        if (claseGuardada === "ejecutiva") {
            claseTexto = "Ejecutiva";
        }

        if (claseGuardada === "primera") {
            claseTexto = "Primera Clase";
        }

        document.getElementById("clase-texto").textContent =
            "Clase: " + claseTexto;

    } else {

        localStorage.setItem("pasajeros", document.getElementById("cantidad-pasajeros-select").value);
        localStorage.setItem("clase", document.getElementById("clase-select").value);

        document.getElementById("cantidad-pasajeros-texto").textContent = "Pasajeros: " + document.getElementById("cantidad-pasajeros-select").value;
        document.getElementById("clase-texto").textContent = "Clase: Económica";

        document.getElementById("cantidad-pasajeros-select").addEventListener("change", function () {
            localStorage.setItem("pasajeros", this.value);
            document.getElementById("cantidad-pasajeros-texto").textContent = "Pasajeros: " + this.value;
            actualizarPrecio();
        });

        document.getElementById("clase-select").addEventListener("change", function () {

            localStorage.setItem("clase", this.value);

            let claseTexto = "Económica";

            if (this.value === "ejecutiva") {
                claseTexto = "Ejecutiva";
            }

            if (this.value === "primera") {
                claseTexto = "Primera Clase";
            }

            document.getElementById("clase-texto").textContent =
                "Clase: " + claseTexto;

            actualizarPrecio();
        });
    }

    if (vuelo) {
        document.getElementById("ciudad-origen").textContent = vuelo.origen;
        document.getElementById("hora-salida").textContent = vuelo.hora_vuelo;
        document.getElementById("ciudad-destino").textContent = vuelo.destino;
        document.getElementById("hora-llegada").textContent = vuelo.llegada_estimada;
        document.getElementById("fecha-del-vuelo").textContent = "Fecha del vuelo: " + vuelo.fecha_vuelo;
        document.getElementById("duracion").textContent = `${vuelo.duracion_estimada} · ${vuelo.escalas === 0 ? "Sin escalas" : vuelo.escalas + " escala(s)"}`;
    }

    actualizarPrecio();
});

function corroborarSiEsVuelta(vueloCompra) {
    if (vueloCompra) {
        vueltaSelector.style.display = "none";
    }
}

function elegirAsiento(elemento, idAsiento) {

    if (elemento.classList.contains("ocupado")) {
        return;
    }

    if (elemento.classList.contains("seleccionado")) {

        elemento.classList.remove("seleccionado");
        elemento.classList.add("disponible");

        asientosElegidos = asientosElegidos.filter(function (cadaAsiento) {
            return cadaAsiento.id !== idAsiento;
        });

    } else {

        elemento.classList.remove("disponible");
        elemento.classList.add("seleccionado");

        let nuevoAsiento = {
            id: idAsiento
        };

        asientosElegidos.push(nuevoAsiento);
    }

    document.getElementById("nombre-asiento").textContent = asientosElegidos.map(asiento => asiento.id).join(", ");

    localStorage.setItem("asientoElegido", JSON.stringify(asientosElegidos));

    actualizarPrecio();
}

function validar() {

    const cantidadPasajeros = parseInt(localStorage.getItem("pasajeros"));

    if (asientosElegidos.length === 0) {

        alert("Seleccioná al menos un asiento antes de continuar.");
        return false;
    }

    if (asientosElegidos.length !== cantidadPasajeros) {

        alert("Tenés que elegir exactamente " + cantidadPasajeros + " asiento(s), uno por pasajero.");

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

function calcularPrecioAsientos() {

    const clase = localStorage.getItem("clase");

    let precioPorAsiento = 20;

    if (clase === "ejecutiva") {
        precioPorAsiento = 50;
    }

    if (clase === "primera") {
        precioPorAsiento = 100;
    }

    return precioPorAsiento * asientosElegidos.length;
}

function actualizarPrecio() {

    if (!vuelo) {
        return;
    }

    const cantidadPasajeros = parseInt(localStorage.getItem("pasajeros"));

    const clase = localStorage.getItem("clase");

    let extraClase = 25;

    if (clase === "ejecutiva") {
        extraClase = 75;
    }

    if (clase === "primera") {
        extraClase = 150;
    }

    const precioBase = vuelo.precio_total_usd * cantidadPasajeros;

    const precioClase = extraClase * cantidadPasajeros;

    const precioAsientos = calcularPrecioAsientos();

    const total = precioBase + precioClase + precioAsientos;

    vuelo.precioFinal = total;

    localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));

    document.getElementById("precio-total").textContent = "$ " + total.toFixed(2) + " USD";

    document.getElementById("detalle-base").textContent = "$ " + precioBase.toFixed(2) + " USD";

    document.getElementById("detalle-clase").textContent = "$ " + precioClase.toFixed(2) + " USD";

    document.getElementById("detalle-asientos").textContent = "$ " + precioAsientos.toFixed(2) + " USD";
}

const botonDetalle = document.getElementById("ver-detalle-precio");
const detallePrecio = document.getElementById("detalle-precio");

botonDetalle.addEventListener("click", function () {

    if (detallePrecio.style.display === "none") {
        detallePrecio.style.display = "block";
        botonDetalle.textContent = "▲ Ocultar detalle";

    } else {
        detallePrecio.style.display = "none";
        botonDetalle.textContent = "▼ Ver detalle";
    }

});

function verificarSiQuiereVuelta() {

    if (!vuelo) return "../check_out/check_out.html";

    const vueltaCheckbox = document.getElementById("vuelta");
    let vuelta = false;

    if (vueltaCheckbox) {
        vuelta = vueltaCheckbox.checked;
    }

    const siQuiere = localStorage.getItem("requiereVuelta");

    let vueloCompra = JSON.parse(localStorage.getItem("vueloCompra")) || [];

    vuelo.asientos.forEach(function (asiento) {
        let fueElegido = asientosElegidos.some(elegido => elegido.id === asiento.id);
        if (fueElegido) {
            asiento.estado = "ocupado";
        }
    });

    vuelo.asientosElegidos = JSON.parse(JSON.stringify(asientosElegidos));

    let vueloExiste = vueloCompra.find(cadaVuelo => cadaVuelo.id === vuelo.id);

    if (!vueloExiste) {
        vueloCompra.push(vuelo);
    } else {
        vueloCompra = vueloCompra.map(cadaVuelo => cadaVuelo.id === vuelo.id ? vuelo : cadaVuelo);
    }

    localStorage.setItem("vueloCompra", JSON.stringify(vueloCompra));
    localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));

    if (siQuiere === "true" && localStorage.getItem("esVuelta") !== "true" || vuelta === true) {
        return "../viaje_vuelta/vuelta.html";
    }

    localStorage.removeItem("esVuelta");
    return "../check_out/check_out.html";
}