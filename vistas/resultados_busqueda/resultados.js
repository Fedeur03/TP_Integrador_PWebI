const contenedorResultados = document.getElementById("resultados");
const resultados = localStorage.getItem("vuelosFiltrados")

function mostrarResultados(resultados) {

    const vuelosFiltrados = JSON.parse(resultados);

    if (vuelosFiltrados.length === 0) {
        contenedorResultados.innerHTML = "<p>No se encontraron resultados para esa búsqueda</p>";
        return;
    }

    vuelosFiltrados.forEach(resultado => {
        contenedorResultados.innerHTML += `<div class="resultados">
                     <h4>${resultado.aerolinea}</h4>
                    <div class="resultado-aerolinea">
                        <div>
                            <p class="hora-y-ciudad">${resultado.hora_vuelo}</p>
                            <p class="hora-y-ciudad">${resultado.origen}</p>
                        </div>
                        <hr>
                        <i class="fa-solid fa-plane"></i>
                        <hr>
                        <div>
                            <p class="hora-y-ciudad">${resultado.llegada_estimada}</p>
                            <p class="hora-y-ciudad">${resultado.destino}</p>
                        </div>
                        <div class="acciones">
                            <button class="btn-seleccionar" data-vuelo="${JSON.stringify(resultado)}">SELECCIONAR</button>
                        </div>
                    </div>
                    <p class="duracion-escala">${resultado.escalas} escalas</p>
                </div>`
    })
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
elementoRange.addEventListener('change', function () {
    precioSeleccionado.textContent = ` $ ${elementoRange.value}`;
});
