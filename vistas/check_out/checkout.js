const cupones = {
    "FLYWAY10": 10,
    "VERANO20": 20,
    "PROMO5": 5,
};

const vuelo   = JSON.parse(localStorage.getItem("vueloSeleccionado"));
const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

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
document.getElementById("vuelo-ruta").textContent     = vuelo.origen + " → " + vuelo.destino;
document.getElementById("vuelo-fecha").textContent    = vuelo.fecha_vuelo;
document.getElementById("vuelo-hora").textContent     = vuelo.hora_vuelo;
document.getElementById("vuelo-duracion").textContent = vuelo.duracion_estimada;

let precioBase = vuelo.precioFinal;
document.getElementById("precio-total").textContent = "$ " + precioBase;

const millasDisponibles = usuario.millas;
document.getElementById("millas-disponibles").textContent += millasDisponibles;
document.getElementById("input-millas").max = millasDisponibles;


document.getElementById("input-millas").addEventListener("input", function () {

    if (this.value > millasDisponibles) {
        this.value = millasDisponibles;
    }

    if (this.value < 0) {
        this.value = 0;
    }

    const millasUsadas = parseInt(this.value) || 0;
    const nuevo = precioBase - (millasUsadas * 0.01);

    if (nuevo < 0) {
        document.getElementById("precio-total").textContent = "$ 0.00";
    } else {
        document.getElementById("precio-total").textContent = "$ " + nuevo.toFixed(2);
    }
});

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
        const descuento  = precioBase * porcentaje / 100;
        const nuevo      = precioBase - descuento;

        if (nuevo < 0) {
            document.getElementById("precio-total").textContent = "$ 0.00";

        } else {
            document.getElementById("precio-total").textContent = "$ " + nuevo.toFixed(2);
        }
    
        document.getElementById("mensaje-cupon").textContent = "Cupón aplicado: " + porcentaje + "% de descuento";
        document.getElementById("mensaje-cupon").style.color = "green";
        cuponAplicado = true;

    } else {
        document.getElementById("mensaje-cupon").textContent = "Cupón inválido";
        document.getElementById("mensaje-cupon").style.color = "red";
    }
});


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

    window.location.href = "/vistas/reserva_confirmada/reserva_confirmada.html";
});