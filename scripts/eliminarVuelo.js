const botonCancelar = document.getElementById('cancelar-reserva');
botonCancelar.addEventListener('click', function (e) {
    let codigoReserva = e.target.getAttribute('data-codigo');

    let usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    usuario.vuelos = usuario.vuelos.filter(vuelo => vuelo.codigo_reserva !== codigoReserva);
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
    alert('Reserva cancelada satisfactoriamente')
    window.location.href = '/vistas/mis_reservas/mis_reservas.html';
})