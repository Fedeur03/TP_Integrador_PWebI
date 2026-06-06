const form = document.getElementById("formBusqueda");
const mensajeError = document.getElementById("mensajeError");

form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
    const fechaIda = document.getElementById("fechaIda").value;
    const fechaVuelta = document.getElementById("fechaVuelta").value;
    const pasajeros = document.getElementById("pasajeros").value;
    const clase = document.getElementById("clase").value;

    mensajeError.textContent = "";

    if (origen.toLowerCase() === destino.toLowerCase()) {
        mensajeError.textContent = "El origen y destino no pueden ser iguales";
        return;
    }

    const hoy = new Date();
    const fechaIdaIngresada = new Date(fechaIda);

    if (fechaIdaIngresada < hoy) {
        mensajeError.textContent = "La fecha de ida no puede ser anterior a la fecha actual";
        return;
    }

    if (fechaVuelta < fechaIda) {
        mensajeError.textContent = "La fecha de vuelta debe ser posterior a la ida";
        return;
    }

    const busqueda = {
        origen: origen,
        destino: destino,
        fecha_ida: fechaIda,
        fecha_vuelta: fechaVuelta,
        cantidad_pasajeros: pasajeros,
        clase: clase
    };

    localStorage.setItem("busquedaVuelo", JSON.stringify(busqueda));

    window.location.href =
        "/vistas/resultados_no_logueado/resultados_no_logueado.html";
});