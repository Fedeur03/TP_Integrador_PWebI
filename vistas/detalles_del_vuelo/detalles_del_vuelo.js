let asientosElegidos = [];
const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));
const vueltaSelector = document.getElementById("opcionalVuelta");

if (localStorage.getItem("esVuelta") === "true") {
    vueltaSelector.style.display = "none";
} else {
    vueltaSelector.style.display = "block";
}

window.addEventListener("load", function () {

    const elementoAsientos = document.getElementById("asientos");
    const otrosAsientos = document.getElementById("otros-asientos");

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

    vuelo.asientos.forEach(function (asiento) {

        const icono = document.createElement("i");
        icono.className = `fa-solid fa-couch ${asiento.estado}`;

        icono.addEventListener("click", function () {
            elegirAsiento(icono, asiento.id);
        });
    });

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

    document.getElementById("ciudad-origen").textContent = vuelo.origen;
    document.getElementById("hora-salida").textContent = vuelo.hora_vuelo;
    document.getElementById("ciudad-destino").textContent = vuelo.destino;
    document.getElementById("hora-llegada").textContent = vuelo.llegada_estimada;
    document.getElementById("fecha-del-vuelo").textContent = "Fecha del vuelo: " + vuelo.fecha_vuelo;
    document.getElementById("duracion").textContent = `${vuelo.duracion_estimada} · ${vuelo.escalas === 0 ? "Sin escalas" : vuelo.escalas + " escala(s)"}`;

    actualizarPrecio();
});

function corroborarSiEsVuelta(vueloCompra) {
    if (vueloCompra) {
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

        let nuevoAsiento = {
            id: idAsiento
        };

        asientosElegidos.push(nuevoAsiento);
    }

    document.getElementById("nombre-asiento").textContent = asientosElegidos.map(asiento => asiento.id).join(", ");

    localStorage.setItem("asientoElegido", JSON.stringify(asientosElegidos));
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

function actualizarPrecio() {

    const cantidadPasajeros = parseInt(localStorage.getItem("pasajeros"));

    const clase = localStorage.getItem("clase");

    let extraClase = 0;

    if (clase === "ejecutiva") {
        extraClase = 35;
    }

    if (clase === "primera") {
        extraClase = 85;
    }

    const total = (vuelo.precio_total_usd + extraClase) * cantidadPasajeros;

    vuelo.precioFinal = total;

    localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));

    document.getElementById("precio-total").textContent = "$ " + total.toFixed(2) + " USD";
}

function verificarSiQuiereVuelta() {

    const vueltaCheckbox = document.getElementById("vuelta");
    let vuelta = false;

    if (vueltaCheckbox) {
        vuelta = vueltaCheckbox.checked;
    }

    const siQuiere = localStorage.getItem("requiereVuelta");

    let vueloCompra = JSON.parse(localStorage.getItem("vueloCompra")) || [];

    vuelo.asientosElegidos = JSON.parse(JSON.stringify(asientosElegidos));

    let vueloExiste = vueloCompra.find(cadaVuelo => cadaVuelo.id === vuelo.id);

    if (!vueloExiste) {
        vueloCompra.push(vuelo);
    }

    localStorage.setItem("vueloCompra", JSON.stringify(vueloCompra));

    if (siQuiere === "true" && localStorage.getItem("esVuelta") !== "true" || vuelta === true) {
        return "../viaje_vuelta/vuelta.html";
    }

    localStorage.removeItem("esVuelta");
    return "../check_out/check_out.html";
}