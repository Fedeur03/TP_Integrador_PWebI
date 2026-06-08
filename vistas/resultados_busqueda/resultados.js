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
                    <h4>Aerolíneas Argentinas</h4>
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

botonFiltro.addEeventListener('click', function (evento) {
    evento.preventDefault();
    window.reload();
})