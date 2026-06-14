const cupones = {
    "FLYWAY10": 10,
    "VERANO20": 20,
    "PROMO5": 5,
};

const vuelo   = JSON.parse(localStorage.getItem("vueloSeleccionado"));
const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

// Usamos como BASE el precioFinal que ya viene multiplicado por los pasajeros
const precioBase = vuelo.precioFinal; 

// Llenamos los datos del usuario
document.getElementById("nombre").value   = usuario.nombre;
document.getElementById("apellido").value = usuario.apellido;
document.getElementById("email").value    = usuario.email;
document.getElementById("numero-documento").value = usuario.dni;

document.getElementById("tipo-documento").addEventListener("change", function () {
    if (this.value === "DNI") {
        document.getElementById("numero-documento").value = usuario.dni;

    } else {
        document.getElementById("numero-documento").value = usuario.pasaporte[0];
    }
});

// Llenamos los datos del vuelo
document.getElementById("vuelo-ruta").textContent      = vuelo.origen + " → " + vuelo.destino;
document.getElementById("vuelo-fecha").textContent     = vuelo.fecha_vuelo;
document.getElementById("vuelo-hora").textContent      = vuelo.hora_vuelo;
document.getElementById("vuelo-duracion").textContent = vuelo.duracion_estimada;

// Mostramos el precio total inicial
document.getElementById("precio-total").textContent = "$ " + precioBase.toFixed(2);

// ── EVENTO CUPÓN ────────────────────────────────────────────────────────────
let cuponAplicado = false;

document.querySelector(".aplicar_cupon").addEventListener("click", function () {

    const codigo = document.getElementById("input-cupon").value.toUpperCase();

    if (cuponAplicado) {
        document.getElementById("mensaje-cupon").textContent = "Ya aplicaste un cupón";
        document.getElementById("mensaje-cupon").style.color = "red";
        return;
    }

    if (cupones[codigo]) {
        const porcentaje = cupones[codigo];
        
        // TRUCO: Calculamos el % de descuento sobre el precioFinal acumulado actual
        const descuento  = vuelo.precioFinal * porcentaje / 100;
        const nuevo      = vuelo.precioFinal - descuento;

        if (nuevo < 0) {
            document.getElementById("precio-total").textContent = "$ 0.00";
            vuelo.precioFinal = 0;
        } else {
            document.getElementById("precio-total").textContent = "$ " + nuevo.toFixed(2);
            vuelo.precioFinal = parseFloat(nuevo.toFixed(2));
        }
    
        document.getElementById("mensaje-cupon").textContent = "Cupón aplicado: " + porcentaje + "% de descuento";
        document.getElementById("mensaje-cupon").style.color = "green";
        cuponAplicado = true;

    } else {
        document.getElementById("mensaje-cupon").textContent = "Cupón inválido";
        document.getElementById("mensaje-cupon").style.color = "red";
    }
});


// ── SUBMIT FORMULARIO ────────────────────────────────────────────────────────
document.getElementById("form-checkout").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const credito = document.getElementById("radio-credito").checked;
    const debito  = document.getElementById("radio-debito").checked;
    const tarjeta = document.querySelector("input[name='numero_tarjeta']").value;
    const titular = document.querySelector("input[name='nombre_titular']").value;
    const vence   = document.querySelector("input[name='fecha_vencimiento']").value;
    const cvv     = document.getElementById("cvv").value;

    const error = document.getElementById("mensaje-error");

    if (!credito && !debito) {
        error.textContent = "Seleccioná un método de pago";
        return;
    }

    if (!tarjeta || !titular || !vence || !cvv) {
        error.textContent = "Completá todos los datos de la tarjeta";
        return;
    }

    const fechaVencimiento = new Date(vence);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaVencimiento <= hoy) {
        error.textContent = "Tarjeta vencida";
        return;
    }

    if (cvv < 100 || cvv > 9999) {
        error.textContent = "El CVV debe tener 3 o 4 dígitos";
        return; 
    }

    usuario.vuelos.push(vuelo);
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

   let asientosElegidos = JSON.parse(localStorage.getItem('asientoElegido'));

    asientosElegidos.forEach(function(asiento) {
        vuelo.asientos.forEach(function(asientoVuelo) {
            if (asiento.id === asientoVuelo.id) {
                asientoVuelo.estado = 'ocupado';
            }
        });
    });

    localStorage.setItem('vueloSeleccionado', JSON.stringify(vuelo));

    let todosLosVuelos = JSON.parse(localStorage.getItem('vuelos'));
    let vuelosActualizados = todosLosVuelos.map(function(cadaVuelo) {
        if (vuelos.id === vuelo.id) {
            return vuelo;
        }
        return cadaVuelo;
    });

    localStorage.setItem('vuelos', JSON.stringify(vuelosActualizados));

    window.location.href = "/vistas/reserva_confirmada/reserva_confirmada.html";
});