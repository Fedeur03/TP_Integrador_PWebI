const vuelos = JSON.parse(localStorage.getItem("vueloCompra")) || [];

const contenedor = document.getElementById("contenedor-reservas");

let html = "";

vuelos.forEach(function (vuelo, indice) {
    html += `
    <div class="tarjeta">
        <div class="cabecera">
            <h3>
                ${indice === 0 ? "IDA" : "VUELTA"}
                ·
                ${vuelo.origen} → ${vuelo.destino}
            </h3>
            <strong>
                Total: $ ${vuelo.precioFinal.toFixed(2)} USD
            </strong>
        </div>
        <div class="contenido">
            <div class="abierta">
                <p>
                    <i class="fa-solid fa-calendar icon"></i>
                    Fecha:
                    <strong>${vuelo.fecha_vuelo}</strong>
                </p>
                <p>
                    <i class="fa-solid fa-clock icon"></i>
                    Hora estimada:
                    <strong>${vuelo.hora_vuelo} - ${vuelo.llegada_estimada}</strong>
                </p>
                <p>
                    <i class="fa-solid fa-plane-circle-check icon"></i>
                    ${vuelo.escalas === 0 ? "Sin escalas" : "Escalas: " + vuelo.escalas}
                </p>
            </div>
        </div>
        <div class="contenido-secundario">
            <p>
                Tu código de reserva es:
                <strong>${vuelo.codigo_reserva}</strong>
            </p>
        </div>
    </div>
    `;
});

contenedor.innerHTML = html;