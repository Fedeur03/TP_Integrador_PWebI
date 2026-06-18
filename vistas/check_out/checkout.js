const cupones = {
    "FLYWAY10": 10,
    "VERANO20": 20,
    "PROMO5": 5,
};

const vuelos = JSON.parse(localStorage.getItem("vueloCompra")) || [];
const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (vuelos.length === 0) {
    alert("Redirección automática, no posee vuelos.");
    window.location.href = "/index.html";
}

let precioBase = 0;

vuelos.forEach(function (vuelo) {
    if (!vuelo.precioOriginal) {
        vuelo.precioOriginal = vuelo.precioFinal;
    }
    precioBase += vuelo.precioOriginal;
});

let cuponAplicado = vuelos.some(function (vuelo) {
    return vuelo.precioFinal < vuelo.precioOriginal;
});

if (cuponAplicado) {
    precioBase = 0;
    vuelos.forEach(function (vuelo) {
        precioBase += vuelo.precioFinal;
    });
}

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
if (resumen) {
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
    resumen.innerHTML = htmlResumen;
}

document.getElementById("precio-total").textContent = "$ " + precioBase.toFixed(2);

const btnAplicar = document.querySelector(".aplicar_cupon");
const btnQuitar = document.querySelector(".quitar_cupon");
const mensajeCupon = document.getElementById("mensaje-cupon");

if (cuponAplicado) {
    btnAplicar.style.display = "none";
    btnQuitar.style.display = "inline-block";
    mensajeCupon.textContent = "Cupón ya aplicado";
    mensajeCupon.style.color = "green";
} else {
    btnQuitar.style.display = "none";
}

btnAplicar.addEventListener("click", function () {
    const codigo = document.getElementById("input-cupon").value.toUpperCase();

    if (!cupones[codigo]) {
        mensajeCupon.textContent = "Cupón inválido";
        mensajeCupon.style.color = "red";
        return;
    }

    const porcentaje = cupones[codigo];

    vuelos.forEach(function (vuelo) {
        vuelo.precioFinal = parseFloat((vuelo.precioOriginal * (1 - porcentaje / 100)).toFixed(2));
    });

    precioBase = 0;
    vuelos.forEach(function (vuelo) {
        precioBase += vuelo.precioFinal;
    });
    precioBase = parseFloat(precioBase.toFixed(2));

    localStorage.setItem("vueloCompra", JSON.stringify(vuelos));
    document.getElementById("precio-total").textContent = "$ " + precioBase.toFixed(2);
    mensajeCupon.textContent = "Cupón aplicado: " + porcentaje + "% de descuento";
    mensajeCupon.style.color = "green";

    btnAplicar.style.display = "none";
    btnQuitar.style.display = "inline-block";
});

btnQuitar.addEventListener("click", function () {
    vuelos.forEach(function (vuelo) {
        vuelo.precioFinal = vuelo.precioOriginal;
    });

    precioBase = 0;
    vuelos.forEach(function (vuelo) {
        precioBase += vuelo.precioFinal;
    });
    precioBase = parseFloat(precioBase.toFixed(2));

    localStorage.setItem("vueloCompra", JSON.stringify(vuelos));
    document.getElementById("precio-total").textContent = "$ " + precioBase.toFixed(2);
    document.getElementById("input-cupon").value = "";
    mensajeCupon.textContent = "";

    btnQuitar.style.display = "none";
    btnAplicar.style.display = "inline-block";
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

    if (!usuario.vuelos) {
        usuario.vuelos = [];
    }

    vuelos.forEach(function (vuelo) {
        vuelo.codigo_reserva = Math.random().toString(36).substring(2, 10).toUpperCase();
        usuario.vuelos.push(vuelo);
    });

    localStorage.setItem("vueloCompra", JSON.stringify(vuelos));
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

    vuelos.forEach(function (vuelo) {
        if (vuelo.asientos && vuelo.asientosElegidos) {
            vuelo.asientosElegidos.forEach(function (asiento) {
                vuelo.asientos.forEach(function (asientoVuelo) {
                    if (asiento.id === asientoVuelo.id) {
                        asientoVuelo.estado = "ocupado";
                    }
                });
            });
        }
    });

    let todosLosVuelos = JSON.parse(localStorage.getItem("vuelos")) || [];
    let vuelosActualizados = todosLosVuelos.map(function (cadaVuelo) {
        const actualizado = vuelos.find(function (vuelo) {
            return vuelo.id === cadaVuelo.id;
        });
        return actualizado || cadaVuelo;
    });

    localStorage.setItem("vuelos", JSON.stringify(vuelosActualizados));
    window.location.href = "../reserva_confirmada/reserva_confirmada.html";
});