window.addEventListener('load', function(event){
    const estaLogueado = localStorage.getItem('usuarioLogueado');

    if(!estaLogueado) {
        window.location.href = "../iniciar_sesion/login.html";
    }
})