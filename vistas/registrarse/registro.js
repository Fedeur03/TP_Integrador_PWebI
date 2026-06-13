const form = document.getElementById("formRegistro");

form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    document.querySelectorAll(".error").forEach(function (error) {
        error.textContent = "";
        error.style.display = "none";
    });

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

    if (dni.length !== 8) {
        document.getElementById("errorDni").textContent = "El DNI debe tener 8 dígitos";
        errorDni.style.display = "block";
        return;
    }

    const fechaNacimiento = new Date(nacimiento).getFullYear();
    const fechaActual = new Date().getFullYear();

    if (fechaActual - fechaNacimiento < 18) {
        document.getElementById("errorNacimiento").textContent = "Debes ser mayor de 18 años";
        errorNacimiento.style.display = "block";
        return;
    }

    if (pasaporte !== "" && pasaporte.length < 9) {
        document.getElementById("errorPasaporte").textContent = "El pasaporte debe tener mínimo 9 caracteres";
        errorPasaporte.style.display = "block";
        return;
    }

    if (usuarioExistente) {
        document.getElementById("errorEmail").textContent = "Ya existe una cuenta con ese correo";
        errorEmail.style.display = "block";
        return;
    }

    const nuevoUsuario = {
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        nacimiento: nacimiento,
        pasaporte: [],
        telefono: null,
        direccion: null,
        email: email,
        password: password,
        vuelos: []
    };

    if (pasaporte !== "") {
        nuevoUsuario.pasaporte.push(pasaporte);
    }

    usuarios.push(nuevoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioLogueado", JSON.stringify(nuevoUsuario));

    alert("Usuario registrado correctamente");

    window.location.href = "../../index.html";
});