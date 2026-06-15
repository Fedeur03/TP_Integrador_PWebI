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
                    <input type="text" id="per-nombre-apellido" value="${usuarioActual.nombre} ${usuarioActual.apellido}" disabled>
                    <p class="label">Correo Electrónico:</p>
                    <input type="text" id="per-email" value="${usuarioActual.email}" disabled>
                    <p class="label">Teléfono:</p>
                    <input type="text" id="per-telefono" value="${usuarioActual.telefono || 'No agregó teléfono'}" disabled>
                </div>

                <div class="row">
                    <p class="label">Dirección:</p>
                    <input type="text" id="per-direccion" value="${usuarioActual.direccion || 'No agregó dirección'}" disabled>
                    <p class="label">Fecha de Nacimiento:</p>
                    <input type="date" id="per-nacimiento" value="${usuarioActual.nacimiento}" disabled>
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
            const nombreCompleto = document.getElementById("per-nombre-apellido").value.split(" ");
            usuarioActual.nombre = nombreCompleto[0] || "";
            usuarioActual.apellido = nombreCompleto.slice(1).join(" ") || "";
            usuarioActual.email = document.getElementById("per-email").value;
            usuarioActual.telefono = document.getElementById("per-telefono").value;
            usuarioActual.direccion = document.getElementById("per-direccion").value;
            usuarioActual.nacimiento = document.getElementById("per-nacimiento").value;

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
                    usuarioActual.documento[docIndex] = {
                        tipo: tarjetaDocumento.querySelector(".doc-tipo").value,
                        nro: tarjetaDocumento.querySelector(".doc-nro").value,
                        vencimiento: tarjetaDocumento.querySelector(".doc-vencimiento").value,
                        expedicion: tarjetaDocumento.querySelector(".doc-expedicion").value,
                        paisEmision: tarjetaDocumento.querySelector(".doc-paisEmision").value,
                        paisResidencia: tarjetaDocumento.querySelector(".doc-paisResidencia").value
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

            const documento = {
                tipo: document.getElementById("tipo-documento").value,
                nro: document.getElementById("nro-documento").value,
                vencimiento: document.getElementById("vencimiento").value,
                expedicion: document.getElementById("expedicion").value,
                paisEmision: document.getElementById("pais-emision").value,
                paisResidencia: document.getElementById("pais-residencia").value
            };

            usuarioActual.documento.push(documento);
            localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioActual));
            window.location.reload();
        });
    }
});