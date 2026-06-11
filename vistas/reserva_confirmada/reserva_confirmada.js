const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));

if (!vuelo) {
    window.location.href = "/index.html";
    
} else {
    document.getElementById("ruta").textContent = vuelo.origen + " → " + vuelo.destino;
    document.getElementById("precio").textContent = "$ " + vuelo.precioFinal + " USD";
    document.getElementById("fecha").textContent = vuelo.fecha_vuelo;
    document.getElementById("hora").textContent = vuelo.hora_vuelo + " - " + vuelo.llegada_estimada;
    document.getElementById("codigo").textContent = vuelo.codigo_reserva;

    if (vuelo.escalas === 0) {
        document.getElementById("label-escalas").textContent = "Sin escalas";
        document.getElementById("escalas").textContent = "";
    
    } else {
        document.getElementById("label-escalas").textContent = "Escalas: ";
        document.getElementById("escalas").textContent = vuelo.escalas;
    }
}