let asientosElegidos = [];

const esVuelta = localStorage.getItem("esVuelta") === "true";

if (!esVuelta) {
    localStorage.removeItem("vueloCompra");
    localStorage.removeItem("clase");
    localStorage.removeItem("pasajeros");
}

let vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));
const vueloCompraHistorial = JSON.parse(localStorage.getItem("vueloCompra")) || [];

if (vuelo) {
    const vueloGuardado = vueloCompraHistorial.find(cadaVuelo => cadaVuelo.id === vuelo.id);
    if (vueloGuardado) {
        vuelo.asientos = vueloGuardado.asientos;
    }
}

const vueltaSelector = document.getElementById("opcionalVuelta");

if (localStorage.getItem("requiereVuelta") === "true" || esVuelta) {
    vueltaSelector.style.display = "none";
} else {
    vueltaSelector.style.display = "block";
}

function obtenerFila(idAsiento) {
    return parseInt(idAsiento.charAt(0));
}

function puedeElegirAsiento(idAsiento) {
    const clase = localStorage.getItem("clase");
    const fila = obtenerFila(idAsiento);

    if (clase === "primera") {
        return fila === 1 || fila === 2;
    }

    if (clase === "ejecutiva") {
        return fila === 3 || fila === 4;
    }

    if (clase === "economica") {
        return fila === 5 || fila === 6 || fila === 7;
    }

    return false;
}

function mensajeClaseActual() {
    const clase = localStorage.getItem("clase");

    if (clase === "economica") {
        return "Clase Económica: filas 5, 6 y 7";
    }

    if (clase === "ejecutiva") {
        return "Clase Ejecutiva: filas 3 y 4";
    }

    if (clase === "primera") {
        return "Primera Clase: filas 1 y 2";
    }

    return "";
}

function actualizarOpacidadAsientos() {
    const todosLosIconos = document.querySelectorAll("#asientos i, #otros-asientos i");

    todosLosIconos.forEach(icono => {
        const idAsiento = icono.dataset.idAsiento;
        const puede = puedeElegirAsiento(idAsiento);

        if (!puede) {
            icono.style.opacity = "0.3";
            icono.style.cursor = "not-allowed";
            if (icono.classList.contains("seleccionado")) {
                icono.classList.remove("seleccionado");
                icono.classList.add("disponible");
            }
        } else {
            icono.style.opacity = "1";
            icono.style.cursor = icono.classList.contains("ocupado") ? "not-allowed" : "pointer";
        }
    });

    asientosElegidos = asientosElegidos.filter(a => puedeElegirAsiento(a.id));

    document.getElementById("nombre-asiento").textContent = asientosElegidos.length > 0 ? asientosElegidos.map(a => a.id).join(", ") : "Ninguno";
    localStorage.setItem("asientoElegido", JSON.stringify(asientosElegidos));
    actualizarPrecio();
}

window.addEventListener("load", function () {

    const btnDetalle = document.getElementById("ver-detalle-precio");
    const detallePrecio = document.getElementById("detalle-precio");

    if (btnDetalle && detallePrecio) {
        btnDetalle.addEventListener("click", function () {
            const visible = detallePrecio.style.display === "block";
            detallePrecio.style.display = visible ? "none" : "block";
            btnDetalle.textContent = visible ? "▼ Ver detalle del precio" : "▲ Ocultar detalle";
        });
    }

    const elementoAsientos = document.getElementById("asientos");
    const otrosAsientos = document.getElementById("otros-asientos");

    if (vuelo && vuelo.asientos) {
        vuelo.asientos.forEach(function (asiento) {
            const icono = document.createElement("i");
            icono.className = `fa-solid fa-couch ${asiento.estado}`;
            icono.dataset.idAsiento = asiento.id;

            if (!puedeElegirAsiento(asiento.id)) {
                icono.style.opacity = "0.3";
                icono.style.cursor = "not-allowed";
            }

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

        document.getElementById("clase-texto").textContent = "Clase: " + claseTexto;

        const info = document.getElementById("info-clase-asientos");
        if (info) info.textContent = mensajeClaseActual();

        actualizarOpacidadAsientos();

    } else if (pasajerosGuardados && !claseGuardada) {

        document.getElementById("cantidad-pasajeros-texto").textContent = "Pasajeros: " + pasajerosGuardados;
        document.getElementById("cantidad-pasajeros-select").style.display = "none";
        document.getElementById("cantidad-pasajeros-select").previousElementSibling.style.display = "none";

        localStorage.setItem("clase", document.getElementById("clase-select").value);

        const info = document.getElementById("info-clase-asientos");
        if (info) info.textContent = mensajeClaseActual();

        actualizarOpacidadAsientos();

        document.getElementById("clase-select").addEventListener("change", function () {
            localStorage.setItem("clase", this.value);

            let claseTexto = "Económica";
            if (this.value === "ejecutiva") {
                claseTexto = "Ejecutiva";
            }

            if (this.value === "primera") {
                claseTexto = "Primera Clase";
            }

            document.getElementById("clase-texto").textContent = "Clase: " + claseTexto;

            const info = document.getElementById("info-clase-asientos");
            if (info) info.textContent = mensajeClaseActual();

            actualizarOpacidadAsientos();
            actualizarPrecio();
        });

    } else {

        localStorage.setItem("pasajeros", document.getElementById("cantidad-pasajeros-select").value);
        localStorage.setItem("clase", document.getElementById("clase-select").value);

        document.getElementById("cantidad-pasajeros-texto").textContent = "Pasajeros: " + document.getElementById("cantidad-pasajeros-select").value;
        document.getElementById("clase-texto").textContent = "Clase: Económica";

        const info = document.getElementById("info-clase-asientos");
        if (info) info.textContent = mensajeClaseActual();

        actualizarOpacidadAsientos();

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
            
            document.getElementById("clase-texto").textContent = "Clase: " + claseTexto;

            const info = document.getElementById("info-clase-asientos");
            if (info) info.textContent = mensajeClaseActual();

            actualizarOpacidadAsientos();
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

function elegirAsiento(elemento, idAsiento) {
    if (!puedeElegirAsiento(idAsiento)) {
        alert("Ese asiento no corresponde a tu clase.");
        return;
    }

    if (elemento.classList.contains("ocupado")) return;

    if (elemento.classList.contains("seleccionado")) {
        elemento.classList.remove("seleccionado");
        elemento.classList.add("disponible");
        asientosElegidos = asientosElegidos.filter(a => a.id !== idAsiento);
    } else {
        elemento.classList.remove("disponible");
        elemento.classList.add("seleccionado");
        asientosElegidos.push({ id: idAsiento });
    }

    document.getElementById("nombre-asiento").textContent = asientosElegidos.length > 0 ? asientosElegidos.map(a => a.id).join(", ") : "Ninguno";
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

document.getElementById("continuar").addEventListener("click", function () {
    if (!validar()) {
        return;
    }

    window.location.href = verificarSiQuiereVuelta();
});

function actualizarPrecio() {
    if (!vuelo) {
        return;
    }

    const cantidadPasajeros = parseInt(localStorage.getItem("pasajeros"));
    const clase = localStorage.getItem("clase");

    let extraClase = 25;

    if (clase === "ejecutiva") {
        extraClase = 50;
    }

    if (clase === "primera") {
        extraClase = 125;
    }

    let precioPorAsiento = 20;

    if (clase === "ejecutiva") {
        precioPorAsiento = 50;
    }

    if (clase === "primera") {
        precioPorAsiento = 100;
    }

    const precioBase = vuelo.precio_total_usd * cantidadPasajeros;
    const precioClase = extraClase * cantidadPasajeros;
    const precioAsientos = asientosElegidos.length * precioPorAsiento;
    const total = precioBase + precioClase + precioAsientos;

    vuelo.precioFinal = total;
    localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));

    document.getElementById("precio-total").textContent = "$ " + total.toFixed(2) + " USD";

    const detBase = document.getElementById("detalle-base");
    const detClase = document.getElementById("detalle-clase");
    const detAsientos = document.getElementById("detalle-asientos");

    if (detBase) {
        detBase.textContent = `$ ${vuelo.precio_total_usd.toFixed(2)} × ${cantidadPasajeros} pasajero(s) = $ ${precioBase.toFixed(2)}`;
    }

    if (detClase) {
        detClase.textContent = `$ ${extraClase.toFixed(2)} × ${cantidadPasajeros} pasajero(s) = $ ${precioClase.toFixed(2)}`;
    }

    if (detAsientos) {
        detAsientos.textContent = asientosElegidos.length > 0 ? `$ ${precioPorAsiento.toFixed(2)} × ${asientosElegidos.length} asiento(s) = $ ${precioAsientos.toFixed(2)}` : "$ 0.00";
    }
}

function verificarSiQuiereVuelta() {
    if (!vuelo) {
        return "../check_out/check_out.html";
    }

    const vueltaCheckbox = document.getElementById("vuelta");
    const vuelta = vueltaCheckbox ? vueltaCheckbox.checked : false;
    const siQuiere = localStorage.getItem("requiereVuelta");

    let vueloCompra = JSON.parse(localStorage.getItem("vueloCompra")) || [];

    vuelo.asientos.forEach(asiento => {
        if (asientosElegidos.some(e => e.id === asiento.id)) {
            asiento.estado = "ocupado";
        }
    });

    vuelo.asientosElegidos = JSON.parse(JSON.stringify(asientosElegidos));

    const existe = vueloCompra.find(v => v.id === vuelo.id);

    if (!existe) {
        vueloCompra.push(vuelo);
    } else {
        vueloCompra = vueloCompra.map(v => v.id === vuelo.id ? vuelo : v);
    }

    localStorage.setItem("vueloCompra", JSON.stringify(vueloCompra));
    localStorage.setItem("vueloSeleccionado", JSON.stringify(vuelo));

    if ((siQuiere === "true" && !esVuelta) || vuelta) {
        localStorage.removeItem("clase");
        return "../viaje_vuelta/vuelta.html";
    }

    localStorage.removeItem("esVuelta");
    return "../check_out/check_out.html";
}