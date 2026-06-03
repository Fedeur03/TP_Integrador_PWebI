async function cargarPaises() {
  const response = await fetch('paises.json');
  const paises = await response.json();

  const grilla = document.getElementById('grilla-paises');

  paises.forEach(pais => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="https://flagcdn.com/w80/${pais.codigo}.png" alt="Bandera de ${pais.pais}">
      <p>${pais.pais}</p>
    `;

    card.addEventListener('click', () => abrirPopup(pais));
    grilla.appendChild(card);
  });
}

function abrirPopup(pais) {
  document.getElementById('popup-nombre').textContent = pais.pais;
  document.getElementById('popup-bandera').src = `https://flagcdn.com/w160/${pais.codigo}.png`;
  document.getElementById('popup-grupo').textContent = `Grupo ${pais.grupo}`;

  // Genera la lista de compañeros de grupo
  const lista = pais.compañeros.map(c => `<li>${c}</li>`).join('');
  document.getElementById('popup-companeros').innerHTML = lista;

  document.getElementById('popup').classList.add('visible');
}

function cerrarPopup() {
  document.getElementById('popup').classList.remove('visible');
}

cargarPaises();