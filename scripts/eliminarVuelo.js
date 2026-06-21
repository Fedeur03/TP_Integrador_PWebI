const botonCancelar = document.getElementById('cancelar-reserva');
botonCancelar.addEventListener('click', function (e) {
    let codigoReserva = e.target.getAttribute('data-codigo');

    let vueloModificar = JSON.parse(localStorage.getItem('reservaSeleccionada'));
    console.log(vueloModificar)
    let asientosRecuperar = vueloModificar.asientosElegidos;
    console.log(asientosRecuperar);

        if(vueloModificar.codigo_reserva == codigoReserva) {
            vueloModificar.asientos.forEach(asiento => {
                asientosRecuperar.forEach(asientoRecuperar => {
                    if(asiento.id === asientoRecuperar.id) {
                        asiento.estado = 'disponible';
                    }
                })
            })
        }

    let usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

    usuario.vuelos = usuario.vuelos.filter(vuelo => vuelo.codigo_reserva !== codigoReserva);

    let vuelosTotal = JSON.parse(localStorage.getItem('vuelos'));

    vuelosTotal = vuelosTotal.filter(vuelo => vuelo.codigo_reserva !== codigoReserva);

    vuelosTotal.push(vueloModificar);

    localStorage.setItem('vuelos', JSON.stringify(vuelosTotal));

    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));

    alert('Reserva cancelada satisfactoriamente')
     window.location.href = '/vistas/mis_reservas/mis_reservas.html';
})