let tipoEquipaje = "ninguno";

const contenedorResultados = document.getElementById("resultados");

const vueloIdeal = JSON.parse(localStorage.getItem("busquedaVuelo"));
const vueloIda = JSON.parse(localStorage.getItem("vueloSeleccionado"));
const todosLosVuelos = JSON.parse(localStorage.getItem("vuelos")) || [];


if (!vueloIdeal || !vueloIda) {
    console.error("No se encontró información del vuelo.");
    window.location.href = "/index.html";
}

const fechaVuelta = new Date(vueloIdeal.fecha_vuelta);

const vuelosFiltrados = todosLosVuelos.filter(vuelo => {

    const coincideTrayecto =
        vuelo.origen === vueloIda.destino &&
        vuelo.destino === vueloIda.origen;

    const fechaVuelo = new Date(vuelo.fecha_vuelo);

    const coincideFecha = fechaVuelo >= fechaVuelta;


    return coincideTrayecto && coincideFecha;
});

console.log("vuelosFiltrados:", vuelosFiltrados);

function mostrarResultados(vuelos) {

    console.log("mostrarResultados recibió:", vuelos);

    if (vuelos.length === 0) {
        console.warn("No hay vuelos para mostrar");
        contenedorResultados.innerHTML =
            "<p>No se encontraron resultados para esa búsqueda</p>";
        return;
    }

    let htmlAcumulado = "";

    vuelos.forEach(function (resultado) {

        let precio = resultado.precio_total_usd;

        if (tipoEquipaje === "mano") precio += 25;
        if (tipoEquipaje === "bodega") precio += 75;

        htmlAcumulado += `
        <div class="resultados">
            <h4>${resultado.aerolinea} - ${resultado.fecha_vuelo}</h4>

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
                    <p class="precio-vuelo">$ ${precio} USD</p>

                    <button
                        class="btn-seleccionar botonSeleccionar"
                        type="button"
                        data-vuelo='${JSON.stringify(resultado)}'>
                        SELECCIONAR
                    </button>
                </div>

            </div>

            <p class="duracion-escala">
                ${resultado.duracion_estimada} ·
                ${resultado.escalas === 0
                    ? "Sin escalas"
                    : resultado.escalas + " escala(s)"}
            </p>

        </div>`;
    });

    contenedorResultados.innerHTML = htmlAcumulado;

    console.log("HTML generado correctamente");
}


function aplicarFiltros() {

    console.log("Aplicando filtros");

    const precioMin = parseInt(document.getElementById("rango-min").value);
    const precioMax = parseInt(document.getElementById("rango-max").value);

    const esDirecto = document.getElementById("esDirecto").checked;
    const tieneEscala = document.getElementById("esConEscala").checked;

    const esArgentina = document.getElementById("esAerolineaArgentina").checked;
    const esAmerican = document.getElementById("esAerolineaAmerican").checked;
    const esFlybondi = document.getElementById("esAerolineaFlybondi").checked;
    const esEmirates = document.getElementById("esAerolineaEmirates").checked;

    let arrayFiltrado = [...vuelosFiltrados];

    console.log("Inicial:", arrayFiltrado.length);


    let soloPrecio = [];

    for (let i = 0; i < arrayFiltrado.length; i++) {

        let precioConEquipaje = arrayFiltrado[i].precio_total_usd;

        if (tipoEquipaje === "mano") {
            precioConEquipaje += 25;
        }

        if (tipoEquipaje === "bodega") {
            precioConEquipaje += 75;
        }

        if (
            precioConEquipaje >= precioMin &&
            precioConEquipaje <= precioMax
        ) {
            soloPrecio.push(arrayFiltrado[i]);
        }
    }

    arrayFiltrado = soloPrecio;

    console.log("Luego precio:", arrayFiltrado.length);


    if (esDirecto || tieneEscala) {

        let soloTipo = [];

        for (let i = 0; i < arrayFiltrado.length; i++) {

            if (
                esDirecto &&
                arrayFiltrado[i].escalas === 0
            ) {
                soloTipo.push(arrayFiltrado[i]);
            }

            if (
                tieneEscala &&
                arrayFiltrado[i].escalas > 0
            ) {
                soloTipo.push(arrayFiltrado[i]);
            }
        }

        arrayFiltrado = soloTipo;
    }

    console.log("Luego escalas:", arrayFiltrado.length);


    if (
        esArgentina ||
        esAmerican ||
        esFlybondi ||
        esEmirates
    ) {

        let soloAerolineas = [];

        for (let i = 0; i < arrayFiltrado.length; i++) {

            if (
                esArgentina &&
                arrayFiltrado[i].aerolinea === "Aerolíneas Argentinas"
            ) {
                soloAerolineas.push(arrayFiltrado[i]);
            }

            if (
                esAmerican &&
                arrayFiltrado[i].aerolinea === "American Airlines"
            ) {
                soloAerolineas.push(arrayFiltrado[i]);
            }

            if (
                esFlybondi &&
                arrayFiltrado[i].aerolinea === "Flybondi"
            ) {
                soloAerolineas.push(arrayFiltrado[i]);
            }

            if (
                esEmirates &&
                arrayFiltrado[i].aerolinea === "Emirates"
            ) {
                soloAerolineas.push(arrayFiltrado[i]);
            }
        }

        arrayFiltrado = soloAerolineas;
    }

    console.log("Luego aerolíneas:", arrayFiltrado.length);

    mostrarResultados(arrayFiltrado);
}

aplicarFiltros();



document.getElementById("equipaje-mano")
    .addEventListener("change", function () {

        tipoEquipaje = "mano";
        console.log("Equipaje mano");

        aplicarFiltros();
    });

document.getElementById("equipaje-bodega")
    .addEventListener("change", function () {

        tipoEquipaje = "bodega";
        console.log("Equipaje bodega");

        aplicarFiltros();
    });



document.getElementById("botonFiltrado")
    .addEventListener("click", function (evento) {

        evento.preventDefault();
        console.log("Botón aplicar filtros");

        aplicarFiltros();
    });



contenedorResultados.addEventListener("click", function (evento) {

    const botonSeleccionado =
        evento.target.closest(".botonSeleccionar");

    if (botonSeleccionado) {

        const dataVuelo =
            botonSeleccionado.getAttribute("data-vuelo");

        console.log("Botón seleccionar presionado");

        if (dataVuelo) {

            const vueloSeleccionado =
                JSON.parse(dataVuelo);

            console.log("Vuelo seleccionado:", vueloSeleccionado);

            if (tipoEquipaje === "mano") {

                vueloSeleccionado.equipaje =
                    "Equipaje de mano";

                vueloSeleccionado.precio_total_usd += 25;

            } else if (tipoEquipaje === "bodega") {

                vueloSeleccionado.equipaje =
                    "Equipaje en bodega";

                vueloSeleccionado.precio_total_usd += 75;

            } else {

                vueloSeleccionado.equipaje =
                    "Sin equipaje";
            }

            localStorage.setItem(
                "vueloSeleccionado",
                JSON.stringify(vueloSeleccionado)
            );

            window.location.href =
                "/vistas/detalles_del_vuelo/detalles_del_vuelo.html";
        }
    }
});


function actualizarSlider() {

    const min =
        parseInt(document.getElementById("rango-min").value);

    const max =
        parseInt(document.getElementById("rango-max").value);

    const minPos =
        (min - 100) / (2500 - 100) * 100;

    const maxPos =
        (max - 100) / (2500 - 100) * 100;

    document.querySelector(".slider-container").style.background =
        `linear-gradient(to right,
        #ddd ${minPos}%,
        #642E2E ${minPos}%,
        #642E2E ${maxPos}%,
        #ddd ${maxPos}%)`;
}

document.getElementById("rango-min")
    .addEventListener("input", function () {

        document.getElementById("precio-min").textContent =
            this.value;

        actualizarSlider();
    });

document.getElementById("rango-max")
    .addEventListener("input", function () {

        document.getElementById("precio-max").textContent =
            this.value;

        actualizarSlider();
    });

actualizarSlider();