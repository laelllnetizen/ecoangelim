export function mostrarMensagem(texto, tipo = 'sucesso') {
  let container = document.getElementById('toast-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  
  const icone = tipo === 'erro' ? '⚠️' : '🪙';
  
  toast.innerHTML = `
    <span class="toast-icone">${icone}</span>
    <span class="toast-texto">${texto}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visivel'));

  setTimeout(() => {
    toast.classList.remove('visivel');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3500);
}
