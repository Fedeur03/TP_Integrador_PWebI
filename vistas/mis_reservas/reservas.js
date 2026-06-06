const reserva = JSON.parse(localStorage.getItem("usuarioLogueado"));

const contenedorVuelos = document.getElementById('tarjetas');

if (!usuarioLogueado.vuelos || usuarioLogueado.vuelos.length === 0) {
    contenedorVuelos.innerHTML = `<h3>No tienes reservas activas</h3>`;
} else {
    contenedorVuelos.innerHTML = ''; 
    usuarioLogueado.vuelos.forEach(vuelo => {
        contenedorVuelos.innerHTML += `
            <div class="tarjeta">
                <div class="cabecera">
                    <h3>${vuelo.origen} → ${vuelo.destino}</h3>
                    <strong>$ ${vuelo.precio_total_usd} USD</strong>
                </div>
                <div class="contenido">
                    <div class="abierta">
                        <p>Código de reserva: <strong>${vuelo.codigo_reserva}</strong></p>
                        <p>Fecha: <strong>${vuelo.fecha_vuelo}</strong></p>
                        <p>Hora estimada: <strong>${vuelo.hora_vuelo}</strong></p>
                        <p>Escalas: <strong>${vuelo.escalas}</strong></p>
                    </div>
                    <img src="../../media/QR.png" alt="QR">
                </div>
                <a href="../gestionar_reserva/gestionar.html" class="boton">Gestionar reserva</a>
            </div>`;
    });
}