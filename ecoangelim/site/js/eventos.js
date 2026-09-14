/* =========================================================
   ECOANGELIM - js/eventos.js
========================================================= */

import {
  obterEcoCoins,
  salvarEcoCoins,
  obterChaves,
  salvarChaves,
  atualizarElementosNaTela
} from "./moedasService.js";

/* =========================================================
   ESTADO EM MEMÓRIA (Sincronizado com o moedasService)
========================================================= */

function obterDataAtual() {
  return new Date().toISOString().split("T")[0];
}

const estado = {
  // Sincronização reativa com o moedasService.js
  get chaves() {
    return obterChaves();
  },
  set chaves(valor) {
    salvarChaves(valor);
  },

  get ecocoins() {
    return obterEcoCoins();
  },
  set ecocoins(valor) {
    salvarEcoCoins(valor);
  },

  mutirao: {
    anuncioNovo: true
  },

  desafio: {
    registros: 5,
    meta: 5,
    recompensaDisponivel: true,
    recompensaRecebida: false,
    ultimaDataVisto: null
  },

  passe: {
    progresso: 3,
    progressoMaximo: 10,
    recompensasRecebidas: []
  },

  sorteio: {
    ultimoPremio: null
  }
};

/* =========================================================
   ELEMENTOS
========================================================= */

const modal = document.getElementById("modal");
const detalhe = document.getElementById("detalhe-evento");
const fecharModal = document.getElementById("fechar-modal");
const saldoChaves = document.getElementById("saldo-chaves");

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {
  atualizarSaldo();
  atualizarRedDots();

  document.querySelectorAll(".evento-card").forEach(card => {
    card.addEventListener("click", () => {
      abrirEvento(card.dataset.evento);
    });
  });

  if (fecharModal) {
    fecharModal.addEventListener("click", fechar);
  }

  const overlay = document.querySelector(".modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", fechar);
  }
}

/* =========================================================
   RED DOTS
========================================================= */

function eventoTemRedDot(tipo) {
  const hoje = obterDataAtual();

  switch (tipo) {
    case "mutirao":
      return estado.mutirao.anuncioNovo;

    case "desafio":
      const jaViuHoje = estado.desafio.ultimaDataVisto === hoje;
      return !jaViuHoje || (estado.desafio.recompensaDisponivel && !estado.desafio.recompensaRecebida);

    case "passe":
      return obterRecompensasDisponiveis().length > 0;

    case "sorteio":
      return estado.chaves >= 1;

    default:
      return false;
  }
}

function atualizarRedDots() {
  document.querySelectorAll(".evento-card").forEach(card => {
    const tipo = card.dataset.evento;
    const dot = card.querySelector(".evento-dot");
    if (!dot) return;

    const ativo = eventoTemRedDot(tipo);
    dot.classList.toggle("visivel", ativo);
  });
}

function atualizarSaldo() {
  atualizarElementosNaTela();
}

/* =========================================================
   MODAL E NAVEGAÇÃO
========================================================= */

function abrirEvento(tipo) {
  switch (tipo) {
    case "mutirao":
      renderizarMutirao();
      break;

    case "desafio":
      estado.desafio.ultimaDataVisto = obterDataAtual();
      atualizarRedDots();
      renderizarDesafio();
      break;

    case "passe":
      renderizarPasse();
      break;

    case "sorteio":
      renderizarSorteio();
      break;
  }

  if (modal) {
    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden", "false");
  }
}

function fechar() {
  if (modal) {
    modal.classList.remove("aberto");
    modal.setAttribute("aria-hidden", "true");
  }
}

/* =========================================================
   ANIMAÇÃO DE RECOMPENSA (PARTÍCULAS + PULSO DO SALDO)
========================================================= */

function animarRecompensa(elementoOrigem, textoIcone = "🔑") {
  if (saldoChaves) {
    saldoChaves.animate([
      { transform: "scale(1)" },
      { transform: "scale(1.4)", color: "#2e7d32" },
      { transform: "scale(1)" }
    ], {
      duration: 400,
      easing: "ease-out"
    });
  }

  const rect = elementoOrigem ? elementoOrigem.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
  const centroX = rect.left + rect.width / 2;
  const centroY = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const particula = document.createElement("div");
    particula.textContent = textoIcone;
    particula.style.cssText = `
      position: fixed;
      left: ${centroX}px;
      top: ${centroY}px;
      font-size: 20px;
      pointer-events: none;
      z-index: 9999;
      transition: all 0.7s cubic-bezier(0.1, 0.8, 0.3, 1);
      opacity: 1;
    `;

    document.body.appendChild(particula);

    const angulo = (Math.PI * 2 * i) / 8;
    const distancia = 50 + Math.random() * 40;
    const destinoX = centroX + Math.cos(angulo) * distancia;
    const destinoY = centroY + Math.sin(angulo) * distancia - 30;

    requestAnimationFrame(() => {
      particula.style.transform = `translate(${destinoX - centroX}px, ${destinoY - centroY}px) scale(1.3)`;
      particula.style.opacity = "0";
    });

    setTimeout(() => particula.remove(), 700);
  }
}

/* =========================================================
   MUTIRÃO VERDE
========================================================= */

function renderizarMutirao() {
  estado.mutirao.anuncioNovo = false;
  atualizarRedDots();

  detalhe.innerHTML = `
    <div class="detalhe-hero" style="background: linear-gradient(135deg, #eaf6e8, #f7fbf4);">
      <div class="icone">🌱</div>
      <h2>Mutirão Verde</h2>
      <div class="detalhe-subtitulo">Uma ação coletiva pela cidade</div>
    </div>

    <div class="detalhe-info">
      <div class="info-item">
        <span>📅</span>
        <small>Data</small>
        <strong>30 OUT</strong>
      </div>
      <div class="info-item">
        <span>🕐</span>
        <small>Horário</small>
        <strong>08:00</strong>
      </div>
      <div class="info-item">
        <span>📍</span>
        <small>Local</small>
        <strong>Praça Central</strong>
      </div>
    </div>

    <p class="detalhe-texto">
      Participe do mutirão comunitário e ajude a transformar um espaço verde da nossa cidade.
    </p>
  `;
}

/* =========================================================
   DESAFIO VERDE
========================================================= */

function renderizarDesafio() {
  const progresso = Math.min(estado.desafio.registros, estado.desafio.meta);

  detalhe.innerHTML = `
    <div class="detalhe-hero" style="background: linear-gradient(135deg, #e8f3fa, #f7fbff);">
      <div class="icone">♻️</div>
      <h2>Desafio Verde</h2>
      <div class="detalhe-subtitulo">Registre problemas ambientais</div>
    </div>

    <p class="detalhe-texto">
      Faça registros verdes pelo aplicativo. Ao atingir a meta, você desbloqueia duas chaves.
    </p>

    <div class="recompensa-box">
      <span class="recompensa-label">PROGRESSO</span>
      <div class="recompensa-valor">${progresso} / ${estado.desafio.meta}</div>

      <div style="height:8px; margin:15px 0; background:#dce9ee; border-radius:10px; overflow:hidden;">
        <div style="width:${(progresso / estado.desafio.meta) * 100}%; height:100%; background:#4f8fc4; border-radius:10px; transition:.3s;"></div>
      </div>

      <div class="recompensa-valor">+2 🔑</div>

      <button id="receber-desafio" class="acao-principal"
        ${!estado.desafio.recompensaDisponivel || progresso < estado.desafio.meta ? "disabled" : ""}>
        ${!estado.desafio.recompensaDisponivel ? "✓ RECOMPENSA RECEBIDA" : progresso >= estado.desafio.meta ? "RECEBER RECOMPENSA" : "CONTINUE REGISTRANDO"}
      </button>
    </div>
  `;

  const btn = document.getElementById("receber-desafio");
  if (btn) btn.addEventListener("click", (e) => receberDesafio(e.currentTarget));
}

function receberDesafio(elementoBotao) {
  if (!estado.desafio.recompensaDisponivel || estado.desafio.registros < estado.desafio.meta) return;

  estado.chaves += 2;
  estado.desafio.recompensaDisponivel = false;
  estado.desafio.recompensaRecebida = true;

  animarRecompensa(elementoBotao, "🔑");
  adicionarProgressoPasse(1);
  atualizarSaldo();
  atualizarRedDots();
  renderizarDesafio();
}

/* =========================================================
   PASSE ECOANGELIM
========================================================= */

const tiers = [
  { nivel: 1, progresso: 1, icone: "🪙", nome: "+10 EcoCoins", tipo: "ecocoins", quantidade: 10 },
  { nivel: 2, progresso: 2, icone: "🔑", nome: "+1 Chave", tipo: "chaves", quantidade: 1 },
  { nivel: 3, progresso: 3, icone: "🌱", nome: "Badge Verde", tipo: "badge", quantidade: 0 },
  { nivel: 4, progresso: 4, icone: "🪙", nome: "+20 EcoCoins", tipo: "ecocoins", quantidade: 20 },
  { nivel: 5, progresso: 5, icone: "🔑", nome: "+2 Chaves", tipo: "chaves", quantidade: 2 },
  { nivel: 6, progresso: 6, icone: "🌳", nome: "Badge Floresta", tipo: "badge", quantidade: 0 },
  { nivel: 7, progresso: 7, icone: "🪙", nome: "+30 EcoCoins", tipo: "ecocoins", quantidade: 30 },
  { nivel: 8, progresso: 8, icone: "🔑", nome: "+3 Chaves", tipo: "chaves", quantidade: 3 }
];

function obterRecompensasDisponiveis() {
  return tiers.filter(tier =>
    estado.passe.progresso >= tier.progresso &&
    !estado.passe.recompensasRecebidas.includes(tier.nivel)
  );
}

function renderizarPasse() {
  const disponiveis = obterRecompensasDisponiveis();
  const porcentagem = Math.min(estado.passe.progresso / estado.passe.progressoMaximo, 1) * 100;

  let html = `
    <div class="passe-header">
      <div class="icone">🎟️</div>
      <h2>Passe EcoAngelim</h2>
      <p>Cada ação verde faz você avançar.</p>
    </div>

    <div class="passe-status">
      <strong>${estado.passe.progresso} / ${estado.passe.progressoMaximo}</strong>
      <span>progresso</span>
    </div>

    <div class="passe-progresso">
      <div class="progresso-track">
        <div class="progresso-preenchido" style="width:${porcentagem}%;"></div>
  `;

  tiers.forEach(tier => {
    const desbloqueado = estado.passe.progresso >= tier.progresso;
    const recebido = estado.passe.recompensasRecebidas.includes(tier.nivel);
    const disponivel = desbloqueado && !recebido;

    html += `
      <div class="passe-tier ${desbloqueado ? "desbloqueado" : ""} ${disponivel ? "disponivel" : ""} ${recebido ? "recebido" : ""}">
        <span class="tier-numero">${tier.nivel}</span>
        <div class="tier-recompensa">${tier.icone}</div>
        <span class="tier-nome">${tier.nome}</span>
        <button class="tier-claim ${recebido ? "recebido" : ""}" data-tier="${tier.nivel}" ${!disponivel ? "disabled" : ""}>
          ${recebido ? "✓" : "RECEBER"}
        </button>
      </div>
    `;
  });

  html += `
      </div>
    </div>

    <p class="detalhe-texto">
      ${disponiveis.length
        ? `Você tem <strong>${disponiveis.length} recompensa(s)</strong> esperando.`
        : `Continue realizando ações verdes para desbloquear novas recompensas.`
      }
    </p>
  `;

  detalhe.innerHTML = html;

  document.querySelectorAll(".tier-claim:not(:disabled)").forEach(botao => {
    botao.addEventListener("click", (e) => {
      receberRecompensaPasse(Number(botao.dataset.tier), e.currentTarget);
    });
  });
}

function receberRecompensaPasse(nivel, elementoBotao) {
  const tier = tiers.find(item => item.nivel === nivel);
  if (!tier || estado.passe.recompensasRecebidas.includes(nivel) || estado.passe.progresso < tier.progresso) return;

  estado.passe.recompensasRecebidas.push(nivel);

  if (tier.tipo === "ecocoins") estado.ecocoins += tier.quantidade;
  if (tier.tipo === "chaves") estado.chaves += tier.quantidade;

  animarRecompensa(elementoBotao, tier.icone);
  atualizarSaldo();
  atualizarRedDots();
  renderizarPasse();
}

function adicionarProgressoPasse(quantidade) {
  estado.passe.progresso = Math.min(estado.passe.progresso + quantidade, estado.passe.progressoMaximo);
  atualizarRedDots();
}

/* =========================================================
   SORTEIO COM ANIMAÇÃO DE SELEÇÃO E CONFIRMAÇÃO
========================================================= */

const premios = [
  { id: 0, nome: "Semente nativa", icone: "🌱" },
  { id: 1, nome: "Muda ornamental", icone: "🪴" },
  { id: 2, nome: "Kit Verde", icone: "🎒" },
  { id: 3, nome: "Benefício local", icone: "☕" },
  { id: 4, nome: "Árvore especial", icone: "🌳" },
  { id: 5, nome: "Prêmio lendário", icone: "🏆" }
];

function renderizarSorteio() {
  detalhe.innerHTML = `
    <div class="sorteio-header">
      <div class="icone">🎁</div>
      <h2>Sorteio</h2>
      <p>Troque suas chaves por recompensas.</p>
    </div>

    <div class="premios-grid" id="premios-grid">
      ${premios.map(premio => `
        <div class="premio" data-id="${premio.id}">
          <span class="premio-icon">${premio.icone}</span>
          <small>${premio.nome}</small>
        </div>
      `).join("")}
    </div>

    <div class="sorteio-acao">
      <div class="chaves">
        🔑 <span>${estado.chaves} chaves</span>
      </div>

      <button id="botao-girar" class="girar" ${estado.chaves < 1 ? "disabled" : ""}>
        GIRAR 🎲
      </button>
    </div>

    ${estado.sorteio.ultimoPremio ? `
      <div class="resultado-sorteio" style="margin-top: 15px; text-align: center;">
        Último prêmio ganho: <strong>${estado.sorteio.ultimoPremio}</strong>
      </div>
    ` : ""}
  `;

  const btnGirar = document.getElementById("botao-girar");
  if (btnGirar) btnGirar.addEventListener("click", (e) => executarSorteioAnimado(e.currentTarget));
}

function executarSorteioAnimado(elementoBotao) {
  if (estado.chaves < 1) return;

  estado.chaves--;
  atualizarSaldo();
  atualizarRedDots();

  elementoBotao.disabled = true;
  if (fecharModal) fecharModal.style.pointerEvents = "none";

  const cards = document.querySelectorAll("#premios-grid .premio");
  const premioSorteadoIndex = Math.floor(Math.random() * premios.length);
  
  let indiceAtual = 0;
  let voltasTotais = 0;
  const minimoVoltas = 3;
  let tempoTroca = 80;

  function animarPasso() {
    cards.forEach(card => card.classList.remove("ativo"));
    cards[indiceAtual].classList.add("ativo");

    const concluiuVoltas = voltasTotais >= minimoVoltas;
    const chegouNoDestino = indiceAtual === premioSorteadoIndex;

    if (concluiuVoltas && chegouNoDestino) {
      setTimeout(() => {
        const premioRecebido = premios[premioSorteadoIndex];
        estado.sorteio.ultimoPremio = `${premioRecebido.icone} ${premioRecebido.nome}`;
        
        adicionarProgressoPasse(1);

        if (fecharModal) fecharModal.style.pointerEvents = "auto";

        exibirModalConfirmacao(premioRecebido, elementoBotao);
      }, 300);
      return;
    }

    indiceAtual = (indiceAtual + 1) % premios.length;
    if (indiceAtual === 0) voltasTotais++;

    if (voltasTotais >= minimoVoltas - 1) {
      tempoTroca += 25;
    }

    setTimeout(animarPasso, tempoTroca);
  }

  animarPasso();
}

function exibirModalConfirmacao(premio, elementoBotao) {
  const overlay = document.createElement("div");
  overlay.className = "confirmacao-overlay";

  overlay.innerHTML = `
    <div class="confirmacao-card">
      <div class="confirmacao-icone">${premio.icone}</div>
      <h3 style="margin: 5px 0 10px 0;">Parabéns!</h3>
      <p style="color: #666; margin-bottom: 20px;">Você recebeu: <strong>${premio.nome}</strong></p>
      <button id="btn-confirmar-resgate" class="acao-principal">CONFIRMAR</button>
    </div>
  `;

  document.body.appendChild(overlay);

  const btnConfirmar = overlay.querySelector("#btn-confirmar-resgate");
  btnConfirmar.addEventListener("click", () => {
    overlay.remove();
    animarRecompensa(elementoBotao, premio.icone);
    renderizarSorteio();
  });
}
