const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
const contenedorVuelos = document.getElementById("tarjetas");

if (!usuario || !usuario.vuelos || usuario.vuelos.length === 0) {
    contenedorVuelos.innerHTML = "<h3>No tienes reservas activas</h3>";
} else {
    contenedorVuelos.innerHTML = "";

    usuario.vuelos.forEach(function (vuelo) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";

        tarjeta.innerHTML = `
            <div class="cabecera">
                <h3>${vuelo.origen} → ${vuelo.destino}</h3>
                <strong>$ ${vuelo.precioFinal.toFixed(2)} USD</strong>
                <i class="fa-solid fa-chevron-down boton-desplegar"></i>
            </div>
            <p>Código de reserva: <strong>${vuelo.codigo_reserva}</strong></p>
            <div class="contenido">
                <div class="desplegable cerrado">
                <div class="contenido-adicional">
                    <p>Origen: <strong>${vuelo.origen}</strong></p>
                    <p>Destino: <strong>${vuelo.destino}</strong></p>
                    <p>Fecha: <strong>${vuelo.fecha_vuelo}</strong></p>
                    <p>Hora estimada: <strong>${vuelo.hora_vuelo}</strong></p>
                    <p>${vuelo.escalas === 0 ? "Sin escalas" : `Escalas: <strong>${vuelo.escalas}</strong>`}</p>
                </div>
            </div>
            <div class="inferior-tarjeta">
                <a href="../gestionar_reserva/gestionar.html" class="boton boton-gestionar">
                    Gestionar reserva
                </a>
            </div>
        `;

        const flecha = tarjeta.querySelector(".boton-desplegar");
        const contenidoDesplegable = tarjeta.querySelector(".desplegable");

        flecha.addEventListener("click", function () {
            contenidoDesplegable.classList.toggle("cerrado");
            flecha.classList.toggle("fa-chevron-up");
            flecha.classList.toggle("fa-chevron-down");
        });

        const botonGestionar = tarjeta.querySelector(".boton-gestionar");
        botonGestionar.addEventListener("click", function () {
            guardarReserva(vuelo.codigo_reserva);
        });

        contenedorVuelos.appendChild(tarjeta);
    });
}

function guardarReserva(codigoReserva) {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioLogueado"));
    const vueloSeleccionado = usuarioActual.vuelos.find(function (v) {
        return v.codigo_reserva === codigoReserva;
    });
    localStorage.setItem("reservaSeleccionada", JSON.stringify(vueloSeleccionado));
}