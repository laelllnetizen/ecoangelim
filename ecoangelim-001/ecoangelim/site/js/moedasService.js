/* ' ECOANGELIM - js/moedasService.js ' */

const CHAVE_ECOCOINS = "ecoangelim_ecocoins";
const CHAVE_EVENTO_KEYS = "ecoangelim_chaves";

export function obterEcoCoins() {
  const saldo = localStorage.getItem(CHAVE_ECOCOINS);
  return saldo !== null ? parseInt(saldo, 10) : 245;
}

export function salvarEcoCoins(valor) {
  const novoSaldo = Math.max(0, parseInt(valor, 10) || 0);
  localStorage.setItem(CHAVE_ECOCOINS, novoSaldo);
  atualizarElementosNaTela();
  return novoSaldo;
}

export function gastarEcoCoins(quantidade) {
  const atual = obterEcoCoins();
  if (atual < quantidade) return false;
  salvarEcoCoins(atual - quantidade);
  return true;
}

export function adicionarEcoCoins(quantidade) {
  const atual = obterEcoCoins();
  return salvarEcoCoins(atual + quantidade);
}

/* ' SALDO EXCLUSIVO DE CHAVES DE EVENTOS ' */
export function obterChaves() {
  const chaves = localStorage.getItem(CHAVE_EVENTO_KEYS);
  return chaves !== null ? parseInt(chaves, 10) : 5;
}

export function salvarChaves(valor) {
  const novoValor = Math.max(0, parseInt(valor, 10) || 0);
  localStorage.setItem(CHAVE_EVENTO_KEYS, novoValor);
  atualizarElementosNaTela();
  return novoValor;
}

export function gastarChaves(quantidade) {
  const atual = obterChaves();
  if (atual < quantidade) return false;
  salvarChaves(atual - quantidade);
  return true;
}

export function adicionarChaves(quantidade) {
  const atual = obterChaves();
  return salvarChaves(atual + quantidade);
}

export function atualizarElementosNaTela() {
  const saldoFormatado = new Intl.NumberFormat("pt-BR").format(obterEcoCoins());
  const chavesFormatadas = new Intl.NumberFormat("pt-BR").format(obterChaves());

  document.querySelectorAll("#ecocoins, #saldo-ecocoins").forEach(el => {
    el.textContent = saldoFormatado;
  });

  document.querySelectorAll("#saldo-chaves").forEach(el => {
    el.textContent = chavesFormatadas;
  });
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", atualizarElementosNaTela);
}

export function reiniciarMoedas(ecocoinsPadrao = 245, chavesPadrao = 5) {
  salvarEcoCoins(ecocoinsPadrao);
  salvarChaves(chavesPadrao);
}

