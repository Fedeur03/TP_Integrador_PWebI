function verificarSiVueloDisponible(vuelo, asientosNecesarios) {
    let cantidadAsientosDisponibles = 0;
    vuelo.asientos.forEach(asiento => {
        if (asiento.estado === 'disponible') {
            cantidadAsientosDisponibles++;
        }
    })

    if (cantidadAsientosDisponibles >= asientosNecesarios) {
        return true;
    }
    return false;
}

let todosLosVuelos = [];
let cantidadVuelosMostrados = 9;

async function inicializarVuelos() {
    try {
        const response = await fetch('../../database/listadoVuelos.json');
            todosLosVuelos = await response.json();
            localStorage.setItem('vuelos', JSON.stringify(todosLosVuelos));
        const vuelosGuardados = JSON.parse(localStorage.getItem('vuelos'));

        if (vuelosGuardados) {
            todosLosVuelos = vuelosGuardados;

        } else {
            const response = await fetch('../../database/listadoVuelos.json');
            todosLosVuelos = await response.json();
            localStorage.setItem('vuelos', JSON.stringify(todosLosVuelos));
        }
        mostrarVuelos();
        
    } catch (error) {
        console.error('Error al cargar los vuelos:', error);
    }
}

function mostrarVuelos() {
    const contenedorVuelos = document.getElementById('contenedor_vuelos');
    contenedorVuelos.innerHTML = '';

    const vuelosAMostrar = todosLosVuelos.slice(0, cantidadVuelosMostrados);

    vuelosAMostrar.forEach(function (vuelo) {

        if (!verificarSiVueloDisponible(vuelo, 1)) {
            return;
        }
        contenedorVuelos.innerHTML += `
        <div class="card_vuelo">
            <div class="img_vuelo">
                <img src="${vuelo.ruta_imagen}" alt="${vuelo.destino}">
            </div>
            <div class="info_vuelo">
                <p><strong>${vuelo.origen} → ${vuelo.destino}</strong></p>
                <hr class="separador">
                <p>${vuelo.fecha_vuelo}</p>
                <p>${vuelo.hora_vuelo} - ${vuelo.llegada_estimada}</p>
                <p>Duración: ${vuelo.duracion_estimada}</p>
                <p>${vuelo.escalas === 0 ? 'Directo' : vuelo.escalas + ' escalas'} </p>
                <p>Precio: ${vuelo.precio_total_usd} USD</p>
                <p>Aerolínea: ${vuelo.aerolinea}</p>
                <button class="boton_comprar" data-codigovuelo="${vuelo.id}">Comprar</button>
            </div>
        </div>`;
    });

    const botonCargarMas = document.getElementById('cargarMasVuelos');
    if (cantidadVuelosMostrados >= todosLosVuelos.length) {
        botonCargarMas.style.display = 'none';
    } else {
        botonCargarMas.style.display = 'block';
    }
}

document.getElementById('cargarMasVuelos').addEventListener('click', function () {
    cantidadVuelosMostrados += 9;
    mostrarVuelos();
});

document.getElementById('contenedor_vuelos').addEventListener('click', function (evento) {
    if (evento.target.classList.contains('boton_comprar')) {

        localStorage.removeItem("pasajeros");

        const id = evento.target.getAttribute('data-codigovuelo');

        let vueloEncontrado = null;
        for (let i = 0; i < todosLosVuelos.length; i++) {
            if (todosLosVuelos[i].id === parseInt(id)) {
                vueloEncontrado = todosLosVuelos[i];
            }
        }

        localStorage.setItem('vueloSeleccionado', JSON.stringify(vueloEncontrado));
        window.location.href = '/vistas/detalles_del_vuelo/detalles_del_vuelo.html';
    }
});

function buscar() {
    const texto = document.getElementById("input-busqueda").value.toLowerCase().trim();

    if (texto === "") {
        alert("Ingresá un destino o aerolínea para buscar");
        return;
    }

    localStorage.removeItem("pasajeros");

    let hayCoincidencia = false;
    let vuelosFiltrados = [];

    for (let i = 0; i < todosLosVuelos.length; i++) {
        const vuelo = todosLosVuelos[i];
        if (vuelo.destino.toLowerCase().includes(texto) ||
            vuelo.origen.toLowerCase().includes(texto) ||
            vuelo.aerolinea.toLowerCase().includes(texto)) {
            hayCoincidencia = true;
            vuelosFiltrados.push(vuelo);
        }
    }

    if (!hayCoincidencia) {
        alert("No se encontraron vuelos para esa búsqueda");
        return;
    }

    localStorage.setItem("vuelosFiltrados", JSON.stringify(vuelosFiltrados));
    window.location.href = "/vistas/resultados_busqueda/resultados.html";
}

const busqueda = document.getElementById('icono-busqueda');
busqueda.addEventListener('click', buscar);

localStorage.removeItem('vueloCompra');
localStorage.removeItem('requiereVuelta');
inicializarVuelos();