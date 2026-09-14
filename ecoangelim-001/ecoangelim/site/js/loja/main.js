/* ' ECOANGELIM - js/loja/main.js ' */
import { estadoLoja } from './data/estadoLoja.js';
import { formatarNumero } from './utils/formatadores.js';
import { mostrarMensagem } from './utils/toast.js';
import { criarLojinha, renderizarLojaVazia } from './components/lojinha.js';
import { obterEcoCoins, gastarEcoCoins, atualizarElementosNaTela } from '../moedasService.js';

const listaLojinhas = document.getElementById("lista-lojinhas");

document.addEventListener("DOMContentLoaded", iniciarLoja);

function iniciarLoja() {
  atualizarElementosNaTela();
  renderizarLojinhas();
}

function renderizarLojinhas() {
  if (!listaLojinhas) return;

  listaLojinhas.innerHTML = "";

  if (estadoLoja.lojas.length === 0) {
    renderizarLojaVazia(listaLojinhas);
    return;
  }

  estadoLoja.lojas.forEach(loja => {
    const elemento = criarLojinha(loja, comprarItem);
    listaLojinhas.appendChild(elemento);
  });
}

function comprarItem(item, loja) {
  if (item.quantidade <= 0) {
    mostrarMensagem("Esse item está esgotado.", "erro");
    return;
  }

  const saldoAtual = obterEcoCoins();

  if (saldoAtual < item.preco) {
    mostrarMensagem("Você não possui EcoCoins suficientes.", "erro");
    return;
  }

  const confirmar = window.confirm(
    `Trocar ${item.preco} EcoCoins por "${item.nome}"?`
  );

  if (!confirmar) return;

  if (gastarEcoCoins(item.preco)) {
    item.quantidade--;
    renderizarLojinhas();
    mostrarMensagem(`Você trocou EcoCoins por ${item.nome}! 🌱`);
  } else {
    mostrarMensagem("Erro ao processar a troca.", "erro");
  }
}
