async function inicializarVuelos() {
    try {
        const response = await fetch('../../database/listadoVuelos.json');
        
        if (!response.ok) {
            throw new Error(`No se pudo cargar el JSON. Estado: ${response.status}`);
        }

        const vuelos = await response.json();
        console.log('Vuelos cargados con éxito:', vuelos);
        
        mostrarVuelos(vuelos);

    } catch (error) {
        console.error('Error al cargar los vuelos:', error);
    }
}

function mostrarVuelos(vuelos) {
    const contenedorVuelos = document.getElementById('contenedor_vuelos');
    
    contenedorVuelos.innerHTML = '';

    vuelos.forEach(vuelo => {
        
    let textoEscalas;

    if (vuelo.escalas === 0) {
        textoEscalas = "Sin escalas";

    } else `${vuelo.escalas} escalas`;

        contenedorVuelos.innerHTML += `
            <div class="card_vuelo">
                <div class="img_vuelo">
                    <img src="../../media/vuelos-card-madrid.jpg" alt="${vuelo.destino}">
                </div>

                <div class="info_vuelo">
                    <p><strong>${vuelo.origen} → ${vuelo.destino}</strong></p>
                    <hr class="separador">
                    <p>${vuelo.hora_vuelo} - ${vuelo.llegada_estimada}</p>
                    <p>Duración: ${vuelo.duracion_estimada}</p>
                    <p>${textoEscalas}</p>
                    <p>Precio Total: ${vuelo.precio_total_usd} USD</p>
                    <p>Aerolínea: ${vuelo.aerolinea}</p>
                    <button><a href="../resultados_busqueda/resultados.html">Comprar</a></button>
                </div>
            </div>`;
    });
}

inicializarVuelos();