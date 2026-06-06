const footer = document.getElementById('footer');

footer.innerHTML = `
     <div class="contenedor_footer">
            <section class="social">
                <img src="../../media/footer_logo.png">
                <div class="social-brands">
                    <i class="fa-brands fa-square-instagram"></i>
                    <i class="fa-brands fa-square-facebook"></i>
                    <i class="fa-brands fa-x-twitter"></i>
                    <i class="fa-brands fa-linkedin"></i>
                </div>

            </section>

            <section class="informacion">
                <p>Información</p>
                <hr class="division">
                <div class="lista">
                    <span><a href="/vistas/preguntas_frecuentes/preguntas_frecuentes.html">Preguntas Frecuentes</a></span>
                    <span><a href="/vistas/terminos_y_condiciones/terminos.html">Términos y Condiciones</a></span>
                    <span><a href="/vistas/privacidad/privacidad.html">Privacidad</a></span>
                </div>

            </section>

            <section class="enlaces">
                <p>Enlaces Útiles</p>
                <hr class="division">
                <div class="lista">
                    <span><a href="/index.html">Inicio</a></span>
                    <span><a href="/vistas/vuelos/vuelos.html">Vuelos</a></span>
                    <span><a href="/vistas/contacto/contacto.html">Contacto</a></span>
                </div>
            </section>

            <section class="contacto">
                <p>Contacto</p>
                <hr class="division">
                <div class="lista">
                    <span>Villanueva 123, CABA, Argentina</span>
                    <span>flyway@customerservice.com</span>
                    <span>(+54) 11 2345-6789</span>
                    <span>Lun a Vie: 9:00 a 18:00</span>
                </div>
            </section>
        </div>
        <hr>
        <div class="copyright">
            <p>&copy; 2026 Mi página web. Todos los derechos reservados.</p>
        </div>`;