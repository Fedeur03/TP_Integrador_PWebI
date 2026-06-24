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
    return vuelo.cuponAplicado === true;
});

if (cuponAplicado) {
    precioBase = 0;
    vuelos.forEach(function (vuelo) {
        precioBase += vuelo.precioFinal;
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
        vuelo.cuponAplicado = true;
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
        vuelo.cuponAplicado = false;
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

    const cantidadPasajeros = parseInt(localStorage.getItem('pasajeros')) || 1;
    const listaPasajeros = [];

    for (let i = 1; i <= cantidadPasajeros; i++) {
        const pasajero = {
            nombre: document.querySelector(`input[name='nombre_${i}']`).value,
            email: document.querySelector(`input[name='email_${i}']`).value,
            tipoDoc: document.querySelector(`select[name='tipo_doc_${i}']`).value,
            dni: document.querySelector(`input[name='dni_${i}']`).value,
            nacimiento: document.querySelector(`input[name='nacimiento_${i}']`).value
        };
        listaPasajeros.push(pasajero);
    }

    for (let i = 0; i < listaPasajeros.length; i++) {

        if (listaPasajeros[i].email) {
            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(listaPasajeros[i].email);
            if (!emailValido) {
                error.textContent = "El email del pasajero " + (i + 1) + " no es válido";
                return;
            }
        }

        for (let j = 0; j < i; j++) {
            if (listaPasajeros[i].email && listaPasajeros[i].email === listaPasajeros[j].email) {
                error.textContent = "El email del pasajero " + (i + 1) + " ya fue usado por otro pasajero";
                return;
            }
        }
    }

    if (!usuario.vuelos) {
        usuario.vuelos = [];
    }

    vuelos.forEach(function (vuelo) {
        vuelo.codigo_reserva = Math.random().toString(36).substring(2, 10).toUpperCase();
        vuelo.pasajeros = listaPasajeros;
        usuario.vuelos.push(vuelo);
    });

    localStorage.setItem("vueloCompra", JSON.stringify(vuelos));

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

const indiceUsuario = usuarios.findIndex(
    u => u.dni === usuario.dni
);

if (indiceUsuario !== -1) {
    usuarios[indiceUsuario] = usuario;
}

localStorage.setItem("usuarios", JSON.stringify(usuarios));
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

window.addEventListener("load", () => {
    const contenedorPasajeros = document.getElementById("pasajeros");
    const cantidadPasajeros = parseInt(localStorage.getItem('pasajeros')) || 1;
    const userLogueado = JSON.parse(localStorage.getItem("usuarioLogueado")) || {};
    const hoyStr = new Date().toISOString().split("T")[0];

    for (let i = 1; i <= cantidadPasajeros; i++) {
        const bloquePasajero = document.createElement("div");
        bloquePasajero.classList.add("tarjeta-pasajero");

        if (i === 1) {
            bloquePasajero.classList.add("abierto");
        }

        let nombreVal = "";
        let emailVal = "";
        let tipoDocVal = "DNI";
        let dniVal = "";
        let nacimientoVal = "";

        if (i === 1 && userLogueado && userLogueado.nombre) {
            nombreVal = userLogueado.nombre || "";
            emailVal = userLogueado.email || "";
            nacimientoVal = userLogueado.nacimiento || "";

            if (userLogueado.documento && userLogueado.documento.length > 0) {
                const primerDoc = userLogueado.documento[0];
                tipoDocVal = primerDoc.tipo ? primerDoc.tipo.toUpperCase() : "DNI";
                dniVal = primerDoc.nro || "";
            } else if (userLogueado.dni) {
                dniVal = userLogueado.dni;
            }
        }

        bloquePasajero.innerHTML = `
            <div class="barra-pasajero">
                <span><i class="fa fa-user" aria-hidden="true"></i> Pasajero ${i} ${i === 1 && userLogueado.nombre ? "(Tú)" : ""}</span>
                <i class="fa fa-chevron-down flecha" aria-hidden="true"></i>
            </div>
            <div class="datos-pasajero-ocultos">
                <div class="sub_contenido">
                    <div class="dos-columnas">
                        <label>Nombre Completo:</label>
                        <input type="text" name="nombre_${i}" placeholder="Ej. Juan Pérez" value="${nombreVal}" required>
                        <label>Email:</label>
                        <input type="email" name="email_${i}" placeholder="ejemplo@correo.com" value="${emailVal}">
                    </div>
                    <div class="documento">
                        <div>
                            <label>Tipo Doc:</label>
                            <select name="tipo_doc_${i}">
                                <option value="DNI" ${tipoDocVal === "DNI" ? "selected" : ""}>DNI</option>
                                <option value="Pasaporte" ${tipoDocVal === "PASAPORTE" ? "selected" : ""}>Pasaporte</option>
                            </select>
                        </div>
                        <div style="flex-grow: 1;">
                            <label>Nro Documento:</label>
                            <input type="text" name="dni_${i}" placeholder="12345678" value="${dniVal}" required style="width: 100% !important;">
                        </div>
                    </div>
                    <div>
                        <label>Fecha de Nacimiento:</label>
                        <input type="date" name="nacimiento_${i}" value="${nacimientoVal}" max="${hoyStr}" required>
                    </div>
                </div>
            </div>
        `;

        contenedorPasajeros.appendChild(bloquePasajero);
    }

    const barras = document.querySelectorAll(".barra-pasajero");

    barras.forEach(barra => {
        barra.addEventListener("click", () => {
            const tarjetaActual = barra.parentElement;

            document.querySelectorAll(".tarjeta-pasajero").forEach(tarjeta => {
                if (tarjeta !== tarjetaActual) {
                    tarjeta.classList.remove("abierto");
                }
            });

            tarjetaActual.classList.toggle("abierto");
        });
    });
});