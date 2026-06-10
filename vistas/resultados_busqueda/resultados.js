const contenedorResultados = document.getElementById("resultados");
const resultados = localStorage.getItem("vuelosFiltrados");

if (!resultados) {
    window.location.href = "/index.html";
}

function mostrarResultados(resultados) {
    if (!resultados) {
        contenedorResultados.innerHTML = "<p>No se encontraron resultados para esa búsqueda</p>";
        return;
    }

    const vuelosFiltrados = JSON.parse(resultados);

    let htmlAcumulado = "";
    vuelosFiltrados.forEach(resultado => {
        htmlAcumulado += `<div class="resultados">
        <h4>${resultado.aerolinea}</h4>
        <div class="resultado-aerolinea">
            <div>
                <p class="hora-y-ciudad">${resultado.hora_vuelo}</p>
                <p class="hora-y-ciudad">${resultado.origen}</p>
            </div>
            <hr>
            <i class="fa-solid fa-plane"></i>
            <hr>
            <div class="detalles-vuelo">
                <p class="hora-y-ciudad">${resultado.llegada_estimada}</p>
                <p class="hora-y-ciudad">${resultado.destino}</p>
            </div>
            <div class="acciones">
                <p class="precio-vuelo">$ ${resultado.precio_total_usd} USD</p>
                <button class="btn-seleccionar botonSeleccionar" type="button" data-vuelo='${JSON.stringify(resultado)}'>SELECCIONAR</button>
            </div>
        </div>
        <p class="duracion-escala">${resultado.duracion_estimada} · ${resultado.escalas === 0 ? "Sin escalas" : resultado.escalas + " escala(s)"}</p>
    </div>`;
    });

    contenedorResultados.innerHTML = htmlAcumulado;
}

mostrarResultados(resultados);

const botonFiltro = document.getElementById('botonFiltrado');
botonFiltro.addEventListener('click', function (evento) {
    evento.preventDefault();

    const precioBuscado = document.getElementById('rango-precio').value;
    const esDirecto = document.getElementById('esDirecto').checked;
    const tieneEscala = document.getElementById('esConEscala').checked;
    const esArgentina = document.getElementById('esAerolineaArgentina').checked;
    const esAmerican = document.getElementById('esAerolineaAmerican').checked;
    const esFlybondi = document.getElementById('esAerolineaFlybondi').checked;
    const esEmirates = document.getElementById('esAerolineaEmirates').checked;

    let arrayFiltrado = JSON.parse(resultados);

    let soloPrecio = [];
    for (let i = 0; i < arrayFiltrado.length; i++) {
        if (arrayFiltrado[i].precio_total_usd <= precioBuscado) {
            soloPrecio.push(arrayFiltrado[i]);
        }
    }
    arrayFiltrado = soloPrecio;

    if (esDirecto || tieneEscala) {
        let soloTipo = [];
        for (let i = 0; i < arrayFiltrado.length; i++) {
            if (esDirecto && arrayFiltrado[i].escalas === 0) {
                soloTipo.push(arrayFiltrado[i]);
            }
            if (tieneEscala && arrayFiltrado[i].escalas > 0) {
                soloTipo.push(arrayFiltrado[i]);
            }
        }
        arrayFiltrado = soloTipo;
    }

    if (esArgentina || esAmerican || esFlybondi || esEmirates) {
        let soloAerolineas = [];
        for (let i = 0; i < arrayFiltrado.length; i++) {
            if (esArgentina && arrayFiltrado[i].aerolinea === "Aerolíneas Argentinas") {
                soloAerolineas.push(arrayFiltrado[i]);
            }
            if (esAmerican && arrayFiltrado[i].aerolinea === "American Airlines") {
                soloAerolineas.push(arrayFiltrado[i]);
            }
            if (esFlybondi && arrayFiltrado[i].aerolinea === "Flybondi") {
                soloAerolineas.push(arrayFiltrado[i]);
            }
            if (esEmirates && arrayFiltrado[i].aerolinea === "Emirates") {
                soloAerolineas.push(arrayFiltrado[i]);
            }
        }
        arrayFiltrado = soloAerolineas;
    }

    mostrarResultados(JSON.stringify(arrayFiltrado));
});

const precioSeleccionado = document.getElementById('valor-range');
const elementoRange = document.getElementById('rango-precio');

precioSeleccionado.textContent = ` $ ${elementoRange.value}`;

elementoRange.addEventListener('input', function () {
    precioSeleccionado.textContent = ` $ ${elementoRange.value}`;
});

contenedorResultados.addEventListener('click', function (evento) {
    const botonSeleccionado = evento.target.closest('.botonSeleccionar');

    if (botonSeleccionado) {
        const dataVuelo = botonSeleccionado.getAttribute('data-vuelo');

        if (dataVuelo) {
            const vueloSeleccionado = JSON.parse(dataVuelo);
            localStorage.setItem('vueloSeleccionado', JSON.stringify(vueloSeleccionado));
            console.log(vueloSeleccionado);
            window.location.href = '/vistas/detalles_del_vuelo/detalles_del_vuelo.html';
        }
    }
});