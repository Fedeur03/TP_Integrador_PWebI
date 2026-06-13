function guardarReserva(codigoReserva) {

    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    const vuelo = usuario.vuelos.find(function(vuelo) {
        return vuelo.codigo_reserva === codigoReserva;
    });

    localStorage.setItem("reservaSeleccionada", JSON.stringify(vuelo));
}

const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
const contenedorVuelos = document.getElementById("tarjetas");

if (!usuario.vuelos || usuario.vuelos.length === 0) {
    contenedorVuelos.innerHTML = "<h3>No tienes reservas activas</h3>";

} else {

    contenedorVuelos.innerHTML = "";

    usuario.vuelos.forEach(function(vuelo) {

        contenedorVuelos.innerHTML += `
            <div class="tarjeta">
                <div class="cabecera">
                    <h3>${vuelo.origen} → ${vuelo.destino}</h3>
                    <strong>$ ${vuelo.precioFinal} USD</strong>
                </div>

                <div class="contenido">
                    <div class="abierta">
                        <p>Código de reserva: <strong>${vuelo.codigo_reserva}</strong></p>
                        <p>Fecha: <strong>${vuelo.fecha_vuelo}</strong></p>
                        <p>Hora estimada: <strong>${vuelo.hora_vuelo}</strong></p>
                        <p>${vuelo.escalas === 0 ? "Sin escalas" : `Escalas: <strong>${vuelo.escalas}</strong>`}</p>
                    </div>

                    <img src="../../media/QR.png" alt="QR">
                </div>

                <a href="../gestionar_reserva/gestionar.html" class="boton" onclick="guardarReserva('${vuelo.codigo_reserva}')">
                    Gestionar reserva
                </a>
            </div>
        `;
    });
}