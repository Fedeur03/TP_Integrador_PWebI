const navbar = document.getElementById('navbar');

const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (usuarioLogueado) {

    navbar.innerHTML = `<div class="nav-left">
            <ul class="nav-list">
                <a href="/index.html"><img src="../../media/flyway_logo.png" class="nav-logo" /></a>
                <div class="vistas">
                    <li><a href="/index.html">Inicio</a></li>
                    <li><a href="/vistas/vuelos/vuelos.html">Vuelos</a></li>
                    <li><a href="/vistas/contacto/contacto.html">Contacto</a></li>
                </div>

            </ul>
        </div>
        <div class="nav-right">
            <ul class="nav-list">
                <div class="usuario">
                    <li class="log-in"><a href="/vistas/usuario/usuario.html">Juan Perez ▼</a></li>
                    <li class="log-in"><a href="/vistas/mis_reservas/mis_reservas.html">Mis Reservas</a></li>
                </div>
            </ul>
        </div>`;
}else{
    navbar.innerHTML = `
        <div class="nav-left">
            <ul class="nav-list">
                <a href="../../index.html"><img src="../../media/flyway_logo.png" class="nav-logo" /></a>
                <div class="vistas">
                    <li><a href="/index.html" >Inicio</a></li>
                    <li><a href="/vistas/vuelos/vuelos.html">Vuelos</a></li>
                    <li><a href="/vistas/contacto/contacto.html" class="contenido-seleccionado">Contacto</a></li>
                </div>

            </ul>
        </div>
        <div class="nav-right">
            <ul class="nav-list">
                <div class="usuario">

                    <li class="log-in"><a href="/vistas/iniciar_sesion/login.html">Acceder</a></li>
                    <li><a href="/vistas/registrarse/registro.html" class="sign-in">Comenzar ahora</a></li>
                </div>
            </ul>
        </div>`
}

