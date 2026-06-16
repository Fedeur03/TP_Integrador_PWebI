const navbar = document.getElementById('navbar');
const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (usuarioLogueado) {
    navbar.innerHTML = `
        <div class="nav-top-bar">
            <a href="/index.html"><img src="../../media/flyway_logo.png" class="nav-logo" /></a>
            <div class="usuario-container">
                <a class="user-name" href="/vistas/usuario/usuario.html">Mi Perfil</a>
                <a class="mis-reservas-btn" href="/vistas/mis_reservas/mis_reservas.html">Mis Reservas</a>
                <a class="log-out-icon" href="#" id="boton-salir"><i class="fa-solid fa-right-from-bracket"></i></a>
            </div>
        </div>
        <nav class="nav-navigation">
            <ul class="nav-list">
                <li><a class="contenido-navbar" href="/index.html">Inicio</a></li>
                <li><a class="contenido-navbar" href="/vistas/vuelos/vuelos.html">Vuelos</a></li>
                <li><a class="contenido-navbar" href="/vistas/contacto/contacto.html">Contacto</a></li>
            </ul>
        </nav>`;
} else {
    navbar.innerHTML = `
        <div class="nav-top-bar">
            <a href="/index.html"><img src="../../media/flyway_logo.png" class="nav-logo" /></a>
            <div class="usuario-container">
                <a class="login-link" href="/vistas/iniciar_sesion/login.html">Acceder</a>
                <a href="/vistas/registrarse/registro.html" class="sign-in-btn">Comenzar ahora</a>
            </div>
        </div>
        <nav class="nav-navigation">
            <ul class="nav-list">
                <li><a class="contenido-navbar" href="/index.html">Inicio</a></li>
                <li><a class="contenido-navbar" href="/vistas/vuelos/vuelos.html">Vuelos</a></li>
                <li><a class="contenido-navbar" href="/vistas/contacto/contacto.html">Contacto</a></li>
            </ul>
        </nav>`;
}

function marcarEnlaceActivo() {
    let rutaActual = window.location.pathname.split("/").pop();


    if (rutaActual === "") {
        rutaActual = "index.html";
    }

    const enlaces = document.querySelectorAll(".contenido-navbar");

    enlaces.forEach(enlace => {
        const hrefEnlace = enlace.getAttribute("href").split("/").pop();

        if (rutaActual === hrefEnlace) {
            enlace.classList.add("contenido-seleccionado");
        } else {
            enlace.classList.remove("contenido-seleccionado");
        }
    });
}
marcarEnlaceActivo();

const botonSalir = document.getElementById('boton-salir');

if (botonSalir) {
    botonSalir.addEventListener('click', function (e) {
        e.preventDefault();
        const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios"));

        const nuevoArrayUsuarios = listaUsuarios.filter(usuario => usuario.email !== usuarioLogueado.email);
        nuevoArrayUsuarios.push(usuarioLogueado);

        localStorage.setItem('usuarios', JSON.stringify(nuevoArrayUsuarios));
        localStorage.removeItem('usuarioLogueado');
        localStorage.removeItem('vueloSeleccionado');
        localStorage.removeItem('reservaSeleccionada');
        localStorage.removeItem('pasajeros');
        localStorage.removeItem('clase')
        localStorage.removeItem('vuelosFiltrados');
        localStorage.removeItem('busquedaVuelo');
        localStorage.removeItem('vueloCompra');
        
        window.location.href = '/index.html';
    });
}