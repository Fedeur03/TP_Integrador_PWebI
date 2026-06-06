const navbar = document.getElementById('navbar');

navbar.innerHTML = `<div class="nav-left">
            <ul class="nav-list">
                <a href="../index_logueado/index.html"><img src="../../media/flyway_logo.png" class="nav-logo" /></a>
                <div class="vistas">
                    <li><a href="../index_logueado/index.html">Inicio</a></li>
                    <li><a href="../vuelos/vuelos.html">Vuelos</a></li>
                    <li><a href="../contacto/contacto.html">Contacto</a></li>
                </div>

            </ul>
        </div>
        <div class="nav-right">
            <ul class="nav-list">
                <div class="usuario">
                    <li class="log-in"><a href="../usuario/usuario.html">Juan Perez ▼</a></li>
                    <li class="log-in"><a href="../mis_reservas/mis_reservas.html">Mis Reservas</a></li>
                </div>
            </ul>
        </div>`;