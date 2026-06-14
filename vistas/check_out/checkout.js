const cupones = {
    "FLYWAY10": 10,
    "VERANO20": 20,
    "PROMO5": 5,
};

const vuelos = JSON.parse(localStorage.getItem("vueloCompra")) || [];
const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));


if (vuelos.length === 0) {
    alert("Redirección automática: El carrito de compras está vacío en el LocalStorage ('vueloCompra').");
    window.location.href = "/index.html";
}

let precioBase = 0;

vuelos.forEach(function (vuelo) {
    precioBase += vuelo.precioFinal;
});


if (usuario) {
    document.getElementById("nombre").value = usuario.nombre || "";
    document.getElementById("apellido").value = usuario.apellido || "";
    document.getElementById("email").value = usuario.email || "";
    document.getElementById("numero-documento").value = usuario.dni || "";

    document.getElementById("tipo-documento").addEventListener("change", function () {
        if (this.value === "DNI") {
            document.getElementById("numero-documento").value = usuario.dni || "";
        } else {
            document.getElementById("numero-documento").value = (usuario.pasaporte && usuario.pasaporte[0]) || "";
        }
    });
}

const resumen = document.getElementById("resumen-vuelos");
let htmlResumen = "";

vuelos.forEach(function (vuelo, indice) {
    htmlResumen += `
        <div style="margin-bottom:15px;">
            <strong>${indice === 0 ? "Viaje de Ida: " : "Viaje de Vuelta: "}</strong>
            <p>${vuelo.origen} → ${vuelo.destino}</p>
            <p>Fecha: ${vuelo.fecha_vuelo}</p>
            <p>Hora: ${vuelo.hora_vuelo}</p>
            <p>Duración: ${vuelo.duracion_estimada}</p>
        </div>
    `;
});

if (resumen) {
    resumen.innerHTML = htmlResumen;
}


document.getElementById("precio-total").textContent = "$ " + precioBase.toFixed(2);

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
        

        const descuento = precioBase * porcentaje / 100;
        const nuevo = precioBase - descuento;
        precioBase = parseFloat(nuevo.toFixed(2));


        vuelos.forEach(function (vuelo) {
            const descuentoVuelo = vuelo.precioFinal * porcentaje / 100;
            vuelo.precioFinal = parseFloat((vuelo.precioFinal - descuentoVuelo).toFixed(2));
        });


        document.getElementById("precio-total").textContent = "$ " + precioBase.toFixed(2);
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
    const debito = document.getElementById("radio-debito").checked;
    const tarjeta = document.querySelector("input[name='numero_tarjeta']").value;
    const titular = document.querySelector("input[name='nombre_titular']").value;
    const vence = document.querySelector("input[name='fecha_vencimiento']").value;
    const cvv = document.getElementById("cvv").value;
    const error = document.getElementById("mensaje-error");

    error.textContent = "";

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

    if (cvv < 100 || cvv > 999) {
        error.textContent = "El CVV debe tener 3 dígitos";
        return;
    }


    const asientosElegidos = JSON.parse(localStorage.getItem("asientoElegido")) || [];

    vuelos.forEach(function (vuelo) {

        vuelo.asientosElegidos = asientosElegidos;
        

        if (!usuario.vuelos) {
            usuario.vuelos = [];
        }
        
  
        usuario.vuelos.push(vuelo);
    });

    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));


    vuelos.forEach(function (vuelo) {
        if (vuelo.asientos) {
            asientosElegidos.forEach(function (asiento) {
                vuelo.asientos.forEach(function (asientoVuelo) {
                    if (asiento.id === asientoVuelo.id) {
                        asientoVuelo.estado = "ocupado";
                    }
                });
            });
        }
    });

    // ACTUALIZAR VUELOS GENERALES
    let todosLosVuelos = JSON.parse(localStorage.getItem("vuelos")) || [];

    let vuelosActualizados = todosLosVuelos.map(function (cadaVuelo) {
        const actualizado = vuelos.find(function (vuelo) {
            return vuelo.id === cadaVuelo.id;
        });
        return actualizado || cadaVuelo;
    });

    localStorage.setItem("vuelos", JSON.stringify(vuelosActualizados));

    localStorage.removeItem("asientoElegido");

    window.location.href = "../reserva_confirmada/reserva_confirmada.html";
});