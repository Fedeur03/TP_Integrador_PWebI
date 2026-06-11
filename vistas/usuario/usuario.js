const usuarioActual = JSON.parse(localStorage.getItem("usuarioLogueado"));

const contenedorDatosUsuario = document.getElementById("datos-usuario");

if (contenedorDatosUsuario == 0 || !usuarioActual) {
    contenedorDatosUsuario.innerHTML = `<h2>No se pudo cargar la información del usuario</h2>`;
} else {
    contenedorDatosUsuario.innerHTML = `<div>
                        <img class="user-image" src="../../media/user_template.jpg"
                            alt="Imagen de perfil del usuario" />
                        <button class="boton-documento cambiar-imagen">Cambiar imagen</button>
                    </div>

                    <div class="datos_personales">
                        <div class="row">
                            <p class="label">Nombre Completo:</p>
                            <input type="text" value="${usuarioActual.nombre} ${usuarioActual.apellido}" disabled>
                            <p class="label">Correo Electrónico:</p>
                            <input type="text" value="${usuarioActual.email}" disabled>
                            <p class="label">Teléfono:</p>
                            <input type="text" value="${usuarioActual.telefono || 'No agregó teléfono'}" disabled>
                        </div>

                        <div class="row">

                            <p class="label">Dirección:</p>
                            <input type="text" value="${usuarioActual.direccion || 'No agregó dirección'}" disabled>
                            <p class="label">Fecha de Nacimiento:</p>
                            <input type="text" value="${usuarioActual.nacimiento}" disabled>
                        </div>
                    </div>`
}

const contenedorDocumentos = document.getElementById("documentos");

if (contenedorDocumentos == 0 || !usuarioActual) {
    contenedorDocumentos.innerHTML = `<h3>No posee documentos registrados</h3><br><hr>`;
} else {
    usuarioActual.documento.forEach(documento => {
        contenedorDocumentos.innerHTML += `<div class="datos-documento">
                    <div class="sector-imagen">
                        <img class="documento-imagen" src="../../media/assets/pasaporte.png"
                            alt="Imagen del documento del usuario" />
                    </div>

                    <div class="sector-datos">
                        <div class="row">
                            <p class="label">Tipo de Documento</p>
                            <input type="text" value="${documento.tipo.toUpperCase()}" disabled>
                            <p class="label">Nro de Documento</p>
                            <input type="text" value="${documento.nro}" disabled>
                            <p class="label">Fecha de Vencimiento</p>
                            <input type="date" value="${documento.vencimiento}" disabled>

                        </div>
                        <div class="row">
                            <p class="label">Fecha de Expedición</p>
                            <input type="date" value="${documento.expedicion}" disabled>
                            <p class="label">País de Emisión</p>
                            <input type="text" value="${documento.paisEmision}" disabled>
                            <p class="label">País de Residencia</p>
                            <input type="text" value="${documento.paisResidencia}" disabled>


                        </div>
                    </div>

                    <div class="editar-documento">

                        <button class="boton-documento">Editar</button>
                        <button class="boton-documento" id="eliminar-documento" data-codigo="${documento.nro}">Eliminar</button>

                    </div>
                </div>
            <hr>`
    })

}


const formulario = document.getElementById("form-documento");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const tipoDocumento = document.getElementById("tipo-documento").value;
    const nroDocumento = document.getElementById("nro-documento").value;
    const vencimiento = document.getElementById("vencimiento").value;
    const expedicion = document.getElementById("expedicion").value;
    const paisEmision = document.getElementById("pais-emision").value;
    const paisResidencia = document.getElementById("pais-residencia").value;

    const documento = {
        tipo: tipoDocumento,
        nro: nroDocumento,
        vencimiento: vencimiento,
        expedicion: expedicion,
        paisEmision: paisEmision,
        paisResidencia: paisResidencia
    }

    usuarioActual.documento.push(documento);
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioActual));
    window.location.reload();
});

const botonEliminar = document.getElementById("eliminar-documento");

botonEliminar.addEventListener("click", function (evento) {
    const codigoDocumento = evento.target.getAttribute("data-codigo");
    console.log(codigoDocumento);
    console.log(usuarioActual.documento);
    const nuevoArrayDocumentos = usuarioActual.documento.filter(documento => documento.nro !== codigoDocumento);
    usuarioActual.documento = nuevoArrayDocumentos;
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioActual));
    window.location.reload();
});
