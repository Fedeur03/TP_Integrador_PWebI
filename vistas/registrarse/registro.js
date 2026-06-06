const form = document.getElementById("formRegistro");

form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const dni = document.getElementById("dni").value;
    const nacimiento = document.getElementById("nacimiento").value;
    const pasaporte = document.getElementById("pasaporte").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  let usuarioExistente = false;

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email === email) {
            usuarioExistente = true;
        }
    }

    if (dni.length != 8) {
        mensajeError.textContent = "El DNI debe tener 8 dígitos";
        return;
    }

    if (usuarioExistente) {
        mensajeError.textContent = "Ya existe una cuenta con ese correo";
        return;
    }

    const nuevoUsuario = {
       nombre: nombre,
        apellido: apellido,
        dni: dni,
        nacimiento: nacimiento,
        pasaporte: pasaporte,
        email: email,
        password: password,
        vuelos: []
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario registrado correctamente");

    window.location.href = "../../index.html";
});