const vuelo = JSON.parse(localStorage.getItem("vueloSeleccionado"));

if (!vuelo) {
    window.location.href = "/index.html";
    
} else {
    document.getElementById("ruta").textContent    = vuelo.origen + " → " + vuelo.destino;
    document.getElementById("precio").textContent  = "$ " + vuelo.precio_total_usd + " USD";
    document.getElementById("fecha").textContent   = vuelo.fecha_vuelo;
    document.getElementById("hora").textContent    = vuelo.hora_vuelo + " - " + vuelo.llegada_estimada;
    document.getElementById("escalas").textContent = vuelo.escalas === 0 ? "Directo" : vuelo.escalas;
    document.getElementById("codigo").textContent  = vuelo.codigo_reserva;
}