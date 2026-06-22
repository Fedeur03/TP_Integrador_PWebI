const form = document.getElementById("formLogin");
const mensajeError = document.getElementById("mensajeError");
const olvidoBoton = document.getElementById('olvido-contrasena');

olvidoBoton.addEventListener('click', function () {
    console.log(olvidoBoton);
    mensajeError.textContent = "Te hemos enviado un correo para restablecer tu contraseña";
    mensajeError.style.color = "green";
})

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
        mensajeError.textContent = "Correo electrónico y/o contraseña incorrectos";
        return;
    }
    mensajeError.textContent = "";

    localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));

    window.location.href = "/index.html";
});