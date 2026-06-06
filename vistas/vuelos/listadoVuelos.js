// 1. Cambiamos el enfoque: la función asíncrona ahora coordina la carga y el renderizado
async function inicializarVuelos() {
    try {
        const response = await fetch('../../database/listadoVuelos.json');
        
        // Validación de seguridad por si el archivo no se encuentra
        if (!response.ok) {
            throw new Error(`No se pudo cargar el JSON. Estado: ${response.status}`);
        }

        const vuelos = await response.json();
        console.log('Vuelos cargados con éxito:', vuelos);
        
        // Ejecutamos la función de renderizado pasándole los datos reales ya obtenidos
        mostrarVuelos(vuelos);

    } catch (error) {
        console.error('Error al cargar los vuelos:', error);
    }
}

// 2. Función encargada exclusivamente de pintar las tarjetas en el HTML
function mostrarVuelos(vuelos) {
    const contenedorVuelos = document.getElementById('contenedor_vuelos');
    
    // Limpiamos el contenedor por si acaso quedaba contenido previo
    contenedorVuelos.innerHTML = '';

    vuelos.forEach(vuelo => {
        // Evaluamos dinámicamente si tiene escalas o no
        const textoEscalas = vuelo.escalas === 0 ? 'Sin escalas' : `${vuelo.escalas} escalas`;

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

// 3. Arrancamos el proceso automáticamente al cargar el script
inicializarVuelos();