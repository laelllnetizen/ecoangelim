/* ' ECOANGELIM - js/mainMapa.js ' */
import { criarMapa } from "./mapa.js";
import { limitesExploracao } from "./config/bounds.js";
import { obterIconePorNivel } from "./config/icons.js";
import { obterIdentificadorRegiao } from "./utils/regions.js";
import { processarPontosHeatmap, opcoesHeatmap} from "./ui_and_services/heatService.js";
import { calcularIAS, estadoIAS } from "../ias.js";
import { abrirPainelIAS, inicializarControesUI } from "./ui_and_services/panelUI.js";

// Importações do Firebase
import { db } from "../firebase-config.js";
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Otimiza e remove o aviso do getImageData para canvas criados pelo Leaflet
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (type, attributes) {
  if (type === "2d") {
    attributes = Object.assign({}, attributes, { willReadFrequently: true });
  }
  return originalGetContext.call(this, type, attributes);
};

// 1. Inicializar o Mapa e UI
const mapa = criarMapa();
inicializarControesUI(mapa, limitesExploracao);

const camadaMarcadores = L.layerGroup().addTo(mapa);
let camadaHeat = null;
let ocorrencias = [];

// Ícone padrão para Ações Verdes
const iconeAcaoVerde = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper para escapar caracteres speciais de HTML nos popups
function escaparHTML(valor) {
  return String(valor || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 2. Escutar Dados do Firestore em Tempo Real
const consulta = query(collection(db, "posts"), orderBy("criadoEm", "desc"));

onSnapshot(consulta, (snapshot) => {
  const todasOcorrencias = [];
  snapshot.forEach(doc => {
    todasOcorrencias.push({
      id: doc.id,
      ...doc.data()
    });
  });

  // Filtrar ocorrências ocultadas localmente pelo usuário
  const ocultos = JSON.parse(localStorage.getItem("posts_ocultos_ecoangelim") || "[]");
  ocorrencias = todasOcorrencias.filter(oc => !ocultos.includes(oc.id));

  // Atualizar Camada Heatmap
  if (camadaHeat) {
    mapa.removeLayer(camadaHeat);
  }
  const pontosHeat = processarPontosHeatmap(ocorrencias);
  camadaHeat = L.heatLayer(pontosHeat, opcoesHeatmap).addTo(mapa);

  // Limpar e recriar Marcadores
  camadaMarcadores.clearLayers();

  ocorrencias.forEach(ocorrencia => {
    const eAcaoVerde = ocorrencia.tipo === "acao";
    let textoPopup = "";
    let iconeMarcador;

    const fotoHTML = ocorrencia.foto 
      ? `<div style="margin: 8px 0;"><img src="${ocorrencia.foto}" alt="Foto" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 6px;" onerror="this.parentElement.style.display='none';"></div>`
      : "";

    if (eAcaoVerde) {
      textoPopup = `
        <div class="popup-dupla-face popup-acao" style="min-width: 180px;">
          <span style="background-color: #2e7d32; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold;">🌱 Ação Verde</span><br><br>
          <b>${escaparHTML(ocorrencia.categoria)}</b><br>
          <p style="margin: 6px 0; font-size: 0.9em;">${escaparHTML(ocorrencia.descricao)}</p>
          ${fotoHTML}
          ${ocorrencia.impacto ? `<strong>Impacto:</strong> ${escaparHTML(ocorrencia.impacto)}<br>` : ""}
          <strong>Apoios:</strong> 👍 ${ocorrencia.apoios || 0}
        </div>
      `;
      iconeMarcador = iconeAcaoVerde;
    } else {
      textoPopup = `
        <div class="popup-dupla-face popup-denuncia" style="min-width: 180px;">
          <span style="background-color: #c62828; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold;">⚠️ Denúncia</span><br><br>
          <b>${escaparHTML(ocorrencia.categoria)}</b><br>
          <p style="margin: 6px 0; font-size: 0.9em;">${escaparHTML(ocorrencia.descricao)}</p>
          ${fotoHTML}
          <strong>Nível:</strong> ${escaparHTML(ocorrencia.nivel || "Não informado")}<br>
          <strong>Status:</strong> ${escaparHTML(ocorrencia.status || "Aberta")}<br>
          <strong>Apoios:</strong> 👍 ${ocorrencia.apoios || 0}
        </div>
      `;
      iconeMarcador = obterIconePorNivel(ocorrencia.nivel);
    }

    if (ocorrencia.latitude && ocorrencia.longitude) {
      const lat = parseFloat(ocorrencia.latitude);
      const lng = parseFloat(ocorrencia.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        const marcador = L.marker([lat, lng], {
          icon: iconeMarcador
        }).bindPopup(textoPopup);

        camadaMarcadores.addLayer(marcador);
      }
    }
  });

  atualizarVisualizacao();
});

// 3. Interatividade de Zoom (Divulgação Progressiva)
function atualizarVisualizacao() {
  const zoom = mapa.getZoom();
  if (zoom < 16) {
    if (camadaHeat) mapa.addLayer(camadaHeat);
    mapa.removeLayer(camadaMarcadores);
  } else {
    if (camadaHeat) mapa.addLayer(camadaHeat);
    mapa.addLayer(camadaMarcadores);
  }
}

mapa.on("zoomend", atualizarVisualizacao);

// 4. Interatividade ao clicar nas regiões do Heatmap
mapa.on("click", (e) => {
  const { lat, lng } = e.latlng;
  const nomeRegiao = obterIdentificadorRegiao(lat, lng);

  if (nomeRegiao === "Área Externa (Sem Região)") return;

  const ocorrenciasDaRegiao = ocorrencias.filter(
    oc => obterIdentificadorRegiao(oc.latitude, oc.longitude) === nomeRegiao
  );

  if (ocorrenciasDaRegiao.length > 0 && typeof calcularIAS === "function") {
    const ias = calcularIAS(ocorrenciasDaRegiao);
    const estado = estadoIAS ? estadoIAS(ias) : "Regular";
    abrirPainelIAS(nomeRegiao, ocorrenciasDaRegiao, ias, estado);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const btnFeira = document.getElementById('btnFeira');
  const submenuFeira = document.getElementById('submenuFeira');

  if (btnFeira && submenuFeira) {
    btnFeira.addEventListener('click', (e) => {
      e.preventDefault();
      submenuFeira.classList.toggle('ativo');
    });

    document.addEventListener('click', (e) => {
      if (!btnFeira.contains(e.target) && !submenuFeira.contains(e.target)) {
        submenuFeira.classList.remove('ativo');
      }
    });
  }
});
