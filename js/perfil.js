/* ' ECOANGELIM - js/perfil.js ' */
import { obterEcoCoins, atualizarElementosNaTela } from "./moedasService.js";
import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/* ELEMENTOS DO DOM */
const telaPerfil = document.getElementById("tela-perfil");
const telaConfiguracoes = document.getElementById("tela-configuracoes");
const abrirConfig = document.getElementById("abrir-config");
const voltarPerfil = document.getElementById("voltar-perfil");
const listaMimos = document.getElementById("lista-mimos");
const contadorMimos = document.getElementById("contador-mimos");

/* DADOS DO PERFIL */
const perfil = {
  nome: "Anya",
  nivel: "🌱 Cidadã Verde",
  estatisticas: {
    problemas: 12,
    conquistas: 8
  },
  mimos: [
    { nome: "Sorvete", icone: "🍨", desbloqueado: true },
    { nome: "Kit Skincare", icone: "👝", desbloqueado: true },
    { nome: "Squeeze", icone: "🧴", desbloqueado: true },
    { nome: "Caneca", icone: "☕", desbloqueado: true },
    { nome: "Ecobag", icone: "🛍️", desbloqueado: true },
    { nome: "Chaveiro", icone: "🔑", desbloqueado: true },
    { nome: "Cultivador", icone: "🪴", desbloqueado: true },
    { nome: "Par de Brincos", icone: "⭐", desbloqueado: true }
  ]
};

/* INICIALIZAÇÃO */
document.addEventListener("DOMContentLoaded", iniciarPerfil);

function iniciarPerfil() {
  atualizarElementosNaTela();
  carregarDados();
  renderizarMimos();
}

function carregarDados() {
  const elNome = document.getElementById("nome-usuario");
  const elNivel = document.querySelector(".nivel-usuario");
  const elProblemas = document.getElementById("problemas");
  const elEcocoins = document.getElementById("ecocoins");
  const elConquistas = document.getElementById("conquistas");

  if (elNome) elNome.textContent = perfil.nome;
  if (elNivel) elNivel.textContent = perfil.nivel;
  if (elProblemas) elProblemas.textContent = perfil.estatisticas.problemas;
  if (elEcocoins) elEcocoins.textContent = formatarNumero(obterEcoCoins());
  if (elConquistas) elConquistas.textContent = perfil.estatisticas.conquistas;
}

function renderizarMimos() {
  if (!listaMimos) return;
  listaMimos.innerHTML = "";

  perfil.mimos.forEach(mimo => {
    const elemento = document.createElement("div");
    elemento.className = mimo.desbloqueado ? "mimo" : "mimo bloqueado";

    elemento.innerHTML = `
      <span class="mimo-icone">${mimo.icone}</span>
      <span class="mimo-nome">${mimo.nome}</span>
    `;

    elemento.title = mimo.nome;
    listaMimos.appendChild(elemento);
  });

  atualizarContadorMimos();
}

function atualizarContadorMimos() {
  if (!contadorMimos) return;
  const total = perfil.mimos.length;
  const desbloqueados = perfil.mimos.filter(mimo => mimo.desbloqueado).length;
  contadorMimos.textContent = `${desbloqueados}/${total}`;
}

/* EVENTOS DE NAVEGAÇÃO ENTRE TELAS */
if (abrirConfig) {
  abrirConfig.addEventListener("click", () => {
    telaConfiguracoes.removeAttribute("hidden");
    telaPerfil.setAttribute("hidden", "true");
    window.scrollTo(0, 0);
  });
}

if (voltarPerfil) {
  voltarPerfil.addEventListener("click", () => {
    telaConfiguracoes.setAttribute("hidden", "true");
    telaPerfil.removeAttribute("hidden");
    window.scrollTo(0, 0);
  });
}

function formatarNumero(numero) {
  return new Intl.NumberFormat("pt-BR").format(numero);
}

import { reiniciarMoedas } from "./moedasService.js";

// Vincule a um botão no seu HTML de configurações
const btnReset = document.getElementById("btn-resetar-saldo");
if (btnReset) {
  btnReset.addEventListener("click", () => {
    if (confirm("Deseja reiniciar a quantia de moedas para o padrão de apresentação?")) {
      reiniciarMoedas();
    }
  });
}

/* Cofiguração de Logout */
const btnLogout = document.getElementById("btn-logout");

if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    const confirmar = window.confirm("Deseja realmente sair da sua conta?");
    if (!confirmar) return;

    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (erro) {
      console.error("Erro ao encerrar sessão:", erro);
      alert("Não foi possível desconectar no momento.");
    }
  });
}
