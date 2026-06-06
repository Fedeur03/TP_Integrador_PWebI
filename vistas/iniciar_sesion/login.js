const form = document.getElementById("formLogin");
const mensajeError = document.getElementById("mensajeError");

form.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let usuarioEncontrado = null;

    for (let i = 0; i < usuarios.length; i++) {

        if (usuarios[i].email === email && usuarios[i].password === password) {
            usuarioEncontrado = usuarios[i];
            break;
        }
    }

    if (usuarioEncontrado == null) {
        mensajeError.textContent = "Email o contraseña incorrectos";
        return;
    }

    mensajeError.textContent = "";

    localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));

    window.location.href = "/index.html";
});