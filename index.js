const form = document.getElementById("formBusqueda");
const mensajeError = document.getElementById("mensajeError");

const tipoVuelo = document.getElementById("tipo-vuelo");
const esSoloIda = document.getElementById('vuelta');

tipoVuelo.addEventListener('change', function () {
    if (esSoloIda.checked) {
        const fechaVuelta = document.getElementById("fechaVuelta").toggleAttribute("disabled", false);
    } else {
        const fechaVuelta = document.getElementById("fechaVuelta").toggleAttribute("disabled");
    }
})

form.addEventListener("submit", function (evento) {
    evento.preventDefault();


    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
    const fechaIda = document.getElementById("fechaIda").value;
    const fechaVuelta = document.getElementById("fechaVuelta").value;
    const pasajeros = document.getElementById("pasajeros").value;
    const clase = document.getElementById("clase").value;
    const tipoDeVuelo = document.getElementById("tipo-vuelo").value;

    mensajeError.textContent = "";

    if (origen.toLowerCase() === destino.toLowerCase()) {
        mensajeError.textContent = "El origen y destino no pueden ser iguales";
        return;
    }

    const hoy = new Date();
    const fechaIdaIngresada = new Date(fechaIda);

    if (fechaIdaIngresada < hoy) {
        mensajeError.textContent = "La fecha de ida no puede ser anterior a la fecha actual";
        return;
    }
    if (esSoloIda.checked) {


        if (fechaVuelta < fechaIda) {
            mensajeError.textContent = "La fecha de vuelta debe ser posterior a la ida";
            return;
        }
    }

    const busqueda = {
        origen: origen,
        destino: destino,
        fecha_ida: fechaIda,
        fecha_vuelta: fechaVuelta,
        cantidad_pasajeros: pasajeros,
        clase: clase,
        tipoDeVuelo: tipoDeVuelo,
    };

    if(esSoloIda.checked){
        localStorage.setItem('requiereVuelta', true)
    }else{
        localStorage.setItem('requiereVuelta', false)
    }

    localStorage.setItem("busquedaVuelo", JSON.stringify(busqueda));

    fetch('/database/listadoVuelos.json')
        .then(response => response.json())
        .then(todosLosVuelos => {
            const vuelosFiltrados = todosLosVuelos.filter(vuelo =>
                vuelo.origen.toLowerCase().includes(origen.toLowerCase()) &&
                vuelo.destino.toLowerCase().includes(destino.toLowerCase())
            );

            localStorage.setItem("vuelosFiltrados", JSON.stringify(vuelosFiltrados));
            window.location.href = "/vistas/resultados_busqueda/resultados.html";
        })
        .catch(error => {
            console.error('Error al cargar vuelos:', error);
            mensajeError.textContent = "Error al buscar vuelos. Intentá de nuevo.";
        });

    localStorage.setItem("pasajeros", document.getElementById("pasajeros").value);
});