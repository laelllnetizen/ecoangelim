import { criarItem } from './cartaoItem.js';

export function criarLojinha(loja, onComprar) {
  const section = document.createElement("section");
  section.className = "lojinha";
  section.dataset.lojaId = loja.id;

  const header = document.createElement("div");
  header.className = "lojinha-header";

  const identidade = document.createElement("div");
  identidade.className = "lojinha-identidade";

  const logo = document.createElement("div");
  logo.className = "lojinha-logo";
  logo.textContent = loja.logo;

  const nome = document.createElement("div");
  nome.className = "lojinha-nome";

  const titulo = document.createElement("strong");
  titulo.textContent = loja.nome;

  const categoria = document.createElement("span");
  categoria.textContent = loja.categoria;

  nome.appendChild(titulo);
  nome.appendChild(categoria);

  identidade.appendChild(logo);
  identidade.appendChild(nome);

  const mapa = document.createElement("a");
  mapa.className = "ver-mapa";
  mapa.href = loja.localizacao;
  mapa.target = "_blank";
  mapa.rel = "noopener noreferrer";
  mapa.innerHTML = `
    Ver no mapa
    <span class="seta">›</span>
  `;

  header.appendChild(identidade);
  header.appendChild(mapa);

  const grid = document.createElement("div");
  grid.className = "lojinha-itens";

  loja.itens.forEach(item => {
    const card = criarItem(item, loja, onComprar);
    grid.appendChild(card);
  });

  section.appendChild(header);
  section.appendChild(grid);

  return section;
}

export function renderizarLojaVazia(container) {
  const vazio = document.createElement("div");
  vazio.className = "loja-vazia";
  vazio.innerHTML = `
    <div class="icone">🪙</div>
    <strong>A loja está vazia</strong>
    <span>Em breve, novas recompensas aparecerão aqui.</span>
  `;
  container.appendChild(vazio);
}
