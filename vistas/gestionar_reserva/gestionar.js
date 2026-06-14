const vueloReserva = JSON.parse(localStorage.getItem("reservaSeleccionada"));

const contenedorReservaGestionada = document.getElementById("reserva");

const asientosElegidosEnString = JSON.parse(localStorage.getItem("asientoElegido"));

const stringAsientos = asientosElegidosEnString.map(asiento => asiento.id).join(", ");

if(!vueloReserva || vueloReserva.length == 0) {
    contenedorReservaGestionada.innerHTML += `<h2>No hay reservas para gestionar</h2>`;

}else{
contenedorReservaGestionada.innerHTML += `<span class="titulo rojo">Gestionar reserva</span>
        <span class="sub-titulo rojo">Partida ${vueloReserva.origen} con destino a ${vueloReserva.destino}.</span>
        <span class="sub-titulo rojo">Asiento(s): ${stringAsientos}.</span>
        <span class="sub-titulo rojo">Código de reserva: <strong>${vueloReserva.codigo_reserva}</strong>
            <button data-codigo="${vueloReserva.codigo_reserva}" id="cancelar-reserva">Cancelar reserva</button>
        </span>

        <section class="detalles-vuelo">
            <div class="grilla">
                <span class="detalles rojo"><i class="fa-solid fa-calendar"></i>
                    <div class="texto"><span>Fecha del vuelo</span><span class="info">${vueloReserva.fecha_vuelo}</span></div>
                </span>
                <span class="detalles rojo"><i class="fa-solid fa-clock"></i>
                    <div class="texto"><span>Hora del vuelo</span><span class="info">${vueloReserva.hora_vuelo}</span></div>
                </span>
                <span class="detalles rojo"><i class="fa-solid fa-plane-up"></i>
                    <div class="texto"><span>Escalas</span><span class="info">${vueloReserva.escalas === 0 ? "Sin escalas" : vueloReserva.escalas}</span></div>
                </span>
                <span class="detalles rojo"><i class="fa-solid fa-clock"></i>
                    <div class="texto"><span>Duracion estimada</span><span class="info">${vueloReserva.duracion_estimada}</span></div>
                </span>
                <span class="detalles rojo"><i class="fa-solid fa-plane-arrival"></i>
                    <div class="texto"><span>Llegada estimada</span><span class="info">${vueloReserva.llegada_estimada}</span></div>
                </span>
                <span class="detalles rojo"><i class="fa-solid fa-tower-observation"></i>
                    <div class="texto"><span>Terminal</span><span class="info">${vueloReserva.terminal}</span></div>
                </span>
                <span class="detalles rojo"><i class="fa-solid fa-door-open"></i>
                    <div class="texto"><span>Puerta</span><span class="info">${vueloReserva.puerta}</span></div>
                </span>
                <span class="detalles rojo"><i class="fa-solid fa-plane-circle-exclamation"></i>
                    <div class="texto"><span>Aerolínea</span><span class="info">${vueloReserva.aerolinea}</span></div>
                </span>
                <span class="detalles rojo"><i class="fa-solid fa-money-bills"></i>
                    <div class="texto"><span>Precio Total</span><span class="info">$ ${vueloReserva.precioFinal} USD</span></div>
                </span>

            </div>

            <div class="linea-divisoria"></div>
            <aside>
                <span class="detalles rojo">
                    <div class="texto"><span>Estado de la reserva</span><span class="info">${vueloReserva.estado_reserva}</span>
                    </div>
                </span>
                <div class="detalles texto rojo">
                    <span>QR de la reserva:</span>
                    <span class="info"><img src="/media/QR.png" alt="QR de la Reserva"></span>
                </div>
            </aside>

        </section>`
}