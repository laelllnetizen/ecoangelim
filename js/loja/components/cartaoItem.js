import { formatarNumero } from '../utils/formatadores.js';

export function criarItem(item, loja, onComprar) {
  const card = document.createElement("article");
  card.className = "item-card";

  if (item.quantidade <= 0) {
    card.classList.add("esgotado");
  }

  const quantidade = document.createElement("span");
  quantidade.className = "item-quantidade";
  quantidade.textContent = item.quantidade > 0 ? `${item.quantidade} restantes` : "Esgotado";

  const imagem = document.createElement("div");
  imagem.className = "item-imagem";
  imagem.textContent = item.imagem;

  const nome = document.createElement("h3");
  nome.className = "item-nome";
  nome.textContent = item.nome;

  const footer = document.createElement("div");
  footer.className = "item-footer";

  const preco = document.createElement("span");
  preco.className = "item-preco";
  preco.textContent = formatarNumero(item.preco);

  const comprar = document.createElement("button");
  comprar.className = "item-comprar";
  comprar.type = "button";

  if (item.quantidade > 0) {
    comprar.textContent = "Trocar";
    comprar.addEventListener("click", () => onComprar(item, loja));
  } else {
    comprar.textContent = "Esgotado";
    comprar.disabled = true;
  }

  footer.appendChild(preco);
  footer.appendChild(comprar);

  card.appendChild(quantidade);
  card.appendChild(imagem);
  card.appendChild(nome);
  card.appendChild(footer);

  return card;
}
