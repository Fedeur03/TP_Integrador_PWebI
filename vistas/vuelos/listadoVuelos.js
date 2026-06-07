let todosLosVuelos = [];
let cantidadVuelosMostrados = 9; 

async function inicializarVuelos() {
    try {
        const response = await fetch('../../database/listadoVuelos.json');
        
        if (!response.ok) {
            throw new Error(`No se pudo cargar el JSON. Estado: ${response.status}`);
        }

        todosLosVuelos = await response.json();
        console.log('Vuelos cargados con éxito:', todosLosVuelos);
        
        mostrarVuelos();

    } catch (error) {
        console.error('Error al cargar los vuelos:', error);
    }
}

function mostrarVuelos() {
    const contenedorVuelos = document.getElementById('contenedor_vuelos');
    
    contenedorVuelos.innerHTML = '';

    const vuelosAFiltrar = todosLosVuelos.slice(0, cantidadVuelosMostrados);

    vuelosAFiltrar.forEach(vuelo => {

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
                <p>${vuelo.escalas.length || 0} Escalas</p>
                <p>Precio Total: ${vuelo.precio_total_usd} USD</p>
                <p>Aerolínea: ${vuelo.aerolinea}</p>
                <button class="boton_comprar" data-codigovuelo="${vuelo.id}">Comprar</button>
            </div>
        </div>`;
    });

    const botonCargarMas = document.getElementById('cargarMasVuelos');
    if (cantidadVuelosMostrados >= todosLosVuelos.length) {
        botonCargarMas.style.display = 'none'; 
    }
}


const botonCargarMas = document.getElementById('cargarMasVuelos');
botonCargarMas.addEventListener('click', () => {
    cantidadVuelosMostrados += 9;
    mostrarVuelos();
});


inicializarVuelos();


const contenedorVuelos = document.getElementById('contenedor_vuelos');

contenedorVuelos.addEventListener('click', (evento) => {

    if (evento.target.classList.contains('boton_comprar')) {
        const codigoVueloComprado = evento.target.getAttribute('data-codigovuelo');
        
        
        localStorage.setItem('vueloComprado', JSON.stringify(buscarVuelo(codigoVueloComprado)));
        
       window.location.href = '/vistas/detalles_del_vuelo/detalles_del_vuelo.html';
    }
});


function buscarVuelo(idVuelo) {
    if (!idVuelo) return null;
    

    const vueloEncontrado = todosLosVuelos.find(vuelo => vuelo.id === parseInt(idVuelo, 10));
    
    if (vueloEncontrado) {
        console.log('Vuelo encontrado:', vueloEncontrado);
        return vueloEncontrado;
    } else {
        console.warn('No se encontró ningún vuelo con el ID:', idVuelo);
        return null;
    }
}