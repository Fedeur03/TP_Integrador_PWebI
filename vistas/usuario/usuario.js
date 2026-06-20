document.addEventListener("DOMContentLoaded", function () {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (usuarioActual && !usuarioActual.documento) {
        usuarioActual.documento = [];
    }

    function formatearFechaParaInput(fechaString) {
        if (!fechaString) return "2026-01-01";
        if (fechaString.includes("T")) {
            return fechaString.split("T")[0];
        }
        if (fechaString.includes("/")) {
            const partes = fechaString.split("/");
            if (partes[0].length === 4) return `${partes[0]}-${partes[1].padStart(2, '0')}-${partes[2].padStart(2, '0')}`;
            return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        }
        if (fechaString.includes("-")) {
            const partes = fechaString.split("-");
            if (partes[0].length === 4) return fechaString;
            return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        }
        return fechaString;
    }

    const contenedorDatosUsuario = document.getElementById("datos-usuario");

    if (!contenedorDatosUsuario || !usuarioActual) {
        if (contenedorDatosUsuario) {
            contenedorDatosUsuario.innerHTML = `<h2>No se pudo cargar la información del usuario</h2>`;
        }
    } else {
        contenedorDatosUsuario.innerHTML = `
            <div class="datos_personales">
                <div class="row">
                    <p class="label">Nombre Completo:</p>
                    <input type="text" id="per-nombre-apellido" value="${usuarioActual.nombre} ${usuarioActual.apellido}".trim() disabled>
                    <p class="label">Correo Electrónico:</p>
                    <input type="text" id="per-email" value="${usuarioActual.email}" disabled>
                    <p class="label">Teléfono:</p>
                    <input type="text" id="per-telefono" value="${usuarioActual.telefono || ''}" placeholder="No agregó teléfono" disabled>
                </div>

                <div class="row">
                    <p class="label">Dirección:</p>
                    <input type="text" id="per-direccion" value="${usuarioActual.direccion || ''}" placeholder="No agregó dirección" disabled>
                    <p class="label">Fecha de Nacimiento:</p>
                    <input type="date" id="per-nacimiento" value="${usuarioActual.nacimiento}" disabled>
                    <p class="label">Contraseña:</p>
                    <input type="text" id="per-contrasena" value="${usuarioActual.password}" disabled>
                </div>
                
                <button class="boton-documento" id="guardar-datos-personales" style="display:none; color: white; width: 100%; margin-top: 10px;">Guardar Cambios</button>
            </div>`;
    }

    const botonEditarPerfil = document.getElementById("editar");
    if (botonEditarPerfil) {
        botonEditarPerfil.addEventListener("click", function () {
            const inputsPerfil = document.querySelectorAll(".datos_personales input");
            inputsPerfil.forEach(input => input.disabled = false);
            
            const btnGuardarPerfil = document.getElementById("guardar-datos-personales");
            if (btnGuardarPerfil) {
                btnGuardarPerfil.style.display = "block";
            }
        });
    }

    const btnGuardarPerfil = document.getElementById("guardar-datos-personales");
    if (btnGuardarPerfil) {
        btnGuardarPerfil.addEventListener("click", function () {
            const txtNombreApellido = document.getElementById("per-nombre-apellido").value.trim();
            const txtEmail = document.getElementById("per-email").value.trim();
            const txtTelefono = document.getElementById("per-telefono").value.trim();
            const txtDireccion = document.getElementById("per-direccion").value.trim();
            const txtNacimiento = document.getElementById("per-nacimiento").value;
            const txtContrasena = document.getElementById("per-contrasena").value;

            if (!txtNombreApellido) {
                alert("El nombre completo no puede quedar vacío.");
                return;
            }
            if (!txtEmail) {
                alert("El correo electrónico no puede quedar vacío.");
                return;
            }

            if(!txtContrasena){
                alert("La contraseña no puede quedar vacia.");
                return;
            }

            const regexDelEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!regexDelEmail.test(txtEmail)) {
                alert("El correo electrónico no es válido.");
                return;
            }

            if (!txtNacimiento) {
                alert("La fecha de nacimiento no puede quedar vacía.");
                return;
            }

            const partesNombre = txtNombreApellido.split(" ");
            usuarioActual.nombre = partesNombre[0] || "";
            usuarioActual.apellido = partesNombre.slice(1).join(" ") || "";
            usuarioActual.email = txtEmail;
            usuarioActual.telefono = txtTelefono;
            usuarioActual.direccion = txtDireccion;
            usuarioActual.nacimiento = txtNacimiento;
            usuarioActual.password = txtContrasena;

            localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioActual));
            window.location.reload();
        });
    }

    const contenedorDocumentos = document.getElementById("documentos");

    if (!contenedorDocumentos || !usuarioActual || !usuarioActual.documento || usuarioActual.documento.length === 0) {
        if (contenedorDocumentos) {
            contenedorDocumentos.innerHTML = `<h3>No posee documentos registrados</h3><br><hr>`;
        }
    } else {
        contenedorDocumentos.innerHTML = "";
        usuarioActual.documento.forEach(documento => {
            const fechaVencimientoFormateada = formatearFechaParaInput(documento.vencimiento);
            const fechaExpedicionFormateada = formatearFechaParaInput(documento.expedicion);

            contenedorDocumentos.innerHTML += `
                <div class="datos-documento" data-nro="${documento.nro}">
                    <div class="sector-datos">
                        <div class="row">
                            <p class="label">Tipo de Documento</p>
                            <input type="text" class="doc-tipo" value="${documento.tipo.toUpperCase()}" disabled>
                            <p class="label">Nro de Documento</p>
                            <input type="text" class="doc-nro" value="${documento.nro}" disabled>
                            <p class="label">Fecha de Vencimiento</p>
                            <input type="date" class="doc-vencimiento" value="${fechaVencimientoFormateada}" disabled>
                        </div>
                        <div class="row">
                            <p class="label">Fecha de Expedición</p>
                            <input type="date" class="doc-expedicion" value="${fechaExpedicionFormateada}" disabled>
                            <p class="label">País de Emisión</p>
                            <input type="text" class="doc-paisEmision" value="${documento.paisEmision}" disabled>
                            <p class="label">País de Residencia</p>
                            <input type="text" class="doc-paisResidencia" value="${documento.paisResidencia}" disabled>
                        </div>
                    </div>

                    <div class="editar-documento">
                        <button class="boton-documento boton-editar">Editar</button>
                        <button class="boton-documento boton-guardar-doc" style="display: none; background-color: #28a745; color: white;">Guardar</button>
                        <button class="boton-documento boton-eliminar-doc" data-codigo="${documento.nro}">Eliminar</button>
                    </div>
                </div>
                <hr>`;
        });
    }

    if (contenedorDocumentos) {
        contenedorDocumentos.addEventListener("click", function (evento) {
            const target = evento.target;
            const tarjetaDocumento = target.closest(".datos-documento");
            if (!tarjetaDocumento) return;

            const nroDocumentoOriginal = tarjetaDocumento.getAttribute("data-nro");
            const inputs = tarjetaDocumento.querySelectorAll(".sector-datos input");
            const btnEditar = tarjetaDocumento.querySelector(".boton-editar");
            const btnGuardar = tarjetaDocumento.querySelector(".boton-guardar-doc");

            if (target.classList.contains("boton-editar")) {
                inputs.forEach(input => input.disabled = false);
                if (btnEditar) btnEditar.style.display = "none";
                if (btnGuardar) btnGuardar.style.display = "block";
            }

            if (target.classList.contains("boton-guardar-doc")) {
                const docIndex = usuarioActual.documento.findIndex(d => d.nro === nroDocumentoOriginal);

                if (docIndex !== -1) {
                    const nuevoTipo = tarjetaDocumento.querySelector(".doc-tipo").value.trim();
                    const nuevoNro = tarjetaDocumento.querySelector(".doc-nro").value.trim();
                    const nuevoVencimiento = tarjetaDocumento.querySelector(".doc-vencimiento").value;
                    const nuevaExpedicion = tarjetaDocumento.querySelector(".doc-expedicion").value;
                    const nuevoPaisEmision = tarjetaDocumento.querySelector(".doc-paisEmision").value.trim();
                    const nuevoPaisResidencia = tarjetaDocumento.querySelector(".doc-paisResidencia").value.trim();


                    if (!nuevoTipo || !nuevoNro || !nuevoVencimiento || !nuevaExpedicion || !nuevoPaisEmision || !nuevoPaisResidencia) {
                        alert("Ningún campo del documento puede quedar vacío.");
                        return;
                    }

                    usuarioActual.documento[docIndex] = {
                        tipo: nuevoTipo,
                        nro: nuevoNro,
                        vencimiento: nuevoVencimiento,
                        expedicion: nuevaExpedicion,
                        paisEmision: nuevoPaisEmision,
                        paisResidencia: nuevoPaisResidencia
                    };

                    localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioActual));
                    window.location.reload();
                }
            }

            if (target.classList.contains("boton-eliminar-doc")) {
                const codigoDocumento = target.getAttribute("data-codigo");
                usuarioActual.documento = usuarioActual.documento.filter(doc => doc.nro !== codigoDocumento);
                localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioActual));
                window.location.reload();
            }
        });
    }

    const formulario = document.getElementById("form-documento");
    if (formulario) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const tipo = document.getElementById("tipo-documento").value.trim();
            const nro = document.getElementById("nro-documento").value.trim();
            const vencimiento = document.getElementById("vencimiento").value;
            const expedicion = document.getElementById("expedicion").value;
            const paisEmision = document.getElementById("pais-emision").value.trim();
            const paisResidencia = document.getElementById("pais-residencia").value.trim();

            if (!tipo || !nro || !vencimiento || !expedicion || !paisEmision || !paisResidencia) {
                alert("Todos los campos son obligatorios para registrar el documento.");
                return;
            }

            const documento = { tipo, nro, vencimiento, expedicion, paisEmision, paisResidencia };

            usuarioActual.documento.push(documento);
            localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioActual));
            window.location.reload();
        });
    }
});