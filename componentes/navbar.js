const navbar = document.getElementById('navbar');
const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (usuarioLogueado) {
    navbar.innerHTML = `
        <div class="nav-left">
            <ul class="nav-list">
                <a href="/index.html"><img src="../../media/flyway_logo.png" class="nav-logo" /></a>
                <div class="vistas">
                    <li><a class="contenido-navbar" href="/index.html">Inicio</a></li>
                    <li><a class="contenido-navbar" href="/vistas/vuelos/vuelos.html">Vuelos</a></li>
                    <li><a class="contenido-navbar" href="/vistas/contacto/contacto.html">Contacto</a></li>
                </div>
            </ul>
        </div>
        <div class="nav-right">
            <ul class="nav-list">
                <div class="usuario">
                    <li class="log-in"><a class="contenido-navbar" href="/vistas/usuario/usuario.html">${usuarioLogueado.nombre} ${usuarioLogueado.apellido} ▼</a></li>
                    <li class="log-in"><a class="contenido-navbar" href="/vistas/mis_reservas/mis_reservas.html">Mis Reservas</a></li>
                    <li class="log-in"><a class="contenido-navbar" href="#" id="boton-salir"><i class="fa-solid fa-right-from-bracket"></i></a></li>
                </div>
            </ul>
        </div>`;
} else {
    navbar.innerHTML = `
        <div class="nav-left">
            <ul class="nav-list">
                <a href="/index.html"><img src="../../media/flyway_logo.png" class="nav-logo" /></a>
                <div class="vistas">
                    <li><a class="contenido-navbar" href="/index.html">Inicio</a></li>
                    <li><a class="contenido-navbar" href="/vistas/vuelos/vuelos.html">Vuelos</a></li>
                    <li><a class="contenido-navbar" href="/vistas/contacto/contacto.html">Contacto</a></li>
                </div>
            </ul>
        </div>
        <div class="nav-right">
            <ul class="nav-list">
                <div class="usuario">
                    <li class="log-in"><a class="contenido-navbar" href="/vistas/iniciar_sesion/login.html">Acceder</a></li>
                    <li><a href="/vistas/registrarse/registro.html" class="sign-in">Comenzar ahora</a></li>
                </div>
            </ul>
        </div>`;
}

function marcarEnlaceActivo() {
    // 1. Usamos window.location.pathname completo (ej: "/vistas/vuelos/vuelos.html")
    let rutaActual = window.location.pathname;
    
    // Si la ruta termina en barra o está vacía, asumimos que es el index
    if (rutaActual === "/" || rutaActual === "") {
        rutaActual = "/index.html";
    }

    // 2. Seleccionamos todos los enlaces con la clase correspondientes
    const enlaces = document.querySelectorAll('.contenido-navbar');

    enlaces.forEach(enlace => {
        const hrefEnlace = enlace.getAttribute('href');

        // 3. Comparamos la ruta completa de la URL con el href del enlace
        if (rutaActual === hrefEnlace) {
            enlace.classList.add('contenido-seleccionado'); 
        } else {
            enlace.classList.remove('contenido-seleccionado');
        }
    });
}

// Se ejecuta justo después de haber inyectado el HTML en el navbar
marcarEnlaceActivo();


const botonSalir = document.getElementById('boton-salir');

botonSalir.addEventListener('click', function () {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios"));

    const nuevoArrayUsuarios = listaUsuarios.filter(usuario => usuario.email !== usuarioLogueado.email);
    nuevoArrayUsuarios.push(usuarioLogueado);

    localStorage.setItem('usuarios', JSON.stringify(nuevoArrayUsuarios));
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('vueloSeleccionado');
    localStorage.removeItem('reservaSeleccionada');
    localStorage.removeItem('pasajeros');
    localStorage.removeItem('vuelosFiltrados');
    localStorage.removeItem('busquedaVuelo');
    localStorage.removeItem('vueloCompra');
    
    window.location.href = '/index.html';
})