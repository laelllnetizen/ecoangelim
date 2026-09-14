/* MAPA */
function corIAS(valor) {
  if (valor <= 3) {
    return "#43A047";
  }
  if (valor <= 7) {
    return "#FDD835";
  }
  if (valor <= 12) {
    return "#FB8C00";
  }
  return "#E53935";
}

const mapa = L.map("mapa").setView([-8.891, -36.289], 14);

mapa.setMinZoom(13);
mapa.setMaxZoom(18);

/* ==========================================
   LIMITES DO MUNICÍPIO (ÁREA DE EXPLORAÇÃO)
========================================== */
// Retângulo maior externo (limita o movimento da câmera)
const limitesExploracao = L.latLngBounds(
  [-8.945, -36.306], // sudoeste
  [-8.865, -36.250]  // nordeste
);

mapa.setMaxBounds(limitesExploracao);
mapa.fitBounds(limitesExploracao);

// (Visualização gráfica da borda externa foi removida)

/* ==========================================
   ÁREAS DAS GRADES (CENTRO E QUATRO BOCAS)
   Lógica matemática mantida, renderização visual removida
========================================== */

// 1. Área central (Grade original 3x4 -> Regiões 1 a 12)
const limitesCentro = L.latLngBounds(
  [-8.905, -36.303],
  [-8.878, -36.270] 
);

// 2. Área Estrada Quatro Bocas 
const limitesQuatroBocas = L.latLngBounds(
  [-8.942, -36.300], // Sudoeste da estrada
  [-8.930, -36.286]  // Nordeste da estrada
);

// Configurações das subdivisões
const configCentro = { linhas: 3, colunas: 4, inicioNum: 1 };
const configQuatroBocas = { linhas: 1, colunas: 2, inicioNum: 13 }; // Regiões ao longo da estrada

/* IDENTIFICA EM QUAL REGIÃO O USUÁRIO CLICOU */
function obterIdentificadorRegiao(lat, lng) {
  const ponto = L.latLng(lat, lng);

  // Verifica se o clique foi na grade invisível do Centro
  if (limitesCentro.contains(ponto)) {
    return calcularRegiaoNaGrade(lat, lng, limitesCentro, configCentro.linhas, configCentro.colunas, configCentro.inicioNum);
  }
  
  // Verifica se o clique foi na grade invisível da Estrada de Quatro Bocas
  if (limitesQuatroBocas.contains(ponto)) {
    return calcularRegiaoNaGrade(lat, lng, limitesQuatroBocas, configQuatroBocas.linhas, configQuatroBocas.colunas, configQuatroBocas.inicioNum);
  }

  return "Área Externa (Sem Região)";
}

// Função auxiliar matemática para calcular a região baseada nos limites de um retângulo
function calcularRegiaoNaGrade(lat, lng, limites, qtdLinhas, qtdColunas, numeroInicial) {
  const latMin = limites.getSouth();
  const latMax = limites.getNorth();
  const lngMin = limites.getWest();
  const lngMax = limites.getEast();

  const percentualLat = (lat - latMin) / (latMax - latMin);
  const percentualLng = (lng - lngMin) / (lngMax - lngMin);

  let linha = Math.floor((1 - percentualLat) * qtdLinhas);
  let coluna = Math.floor(percentualLng * qtdColunas);

  linha = Math.max(0, Math.min(qtdLinhas - 1, linha));
  coluna = Math.max(0, Math.min(qtdColunas - 1, coluna));

  const numeroRegiao = numeroInicial + (linha * qtdColunas) + coluna;
  return "Região " + numeroRegiao;
}

// (Funções de renderização visual desenharGrades e renderizarGrade foram removidas)

/* ==========================================
   ÍCONES DE MARCADORES
========================================== */
const iconeVerde = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconeAmarelo = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconeLaranja = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconeVermelho = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function carregarOcorrencias() {
  return JSON.parse(
    localStorage.getItem("ecoangelim_ocorrencias") || "[]"
  );
}

const ocorrencias = carregarOcorrencias();

/* ==========================================
   CAMADA HEATMAP
========================================== */
const pontosHeat = [];
ocorrencias.forEach(function (ocorrencia) {
  let intensidade = 0.00; // Baixo
  switch (ocorrencia.nivel) {
    case "Baixo": intensidade = 0.25; break;
    case "Médio": intensidade = 0.45; break;
    case "Alto": intensidade = 0.70; break;
    case "Crítico": intensidade = 1.0; break;
  }
  pontosHeat.push([ocorrencia.latitude, ocorrencia.longitude, intensidade]);
});

const camadaHeat = L.heatLayer(
  pontosHeat,
  {
    radius: 45,
    blur: 35,
    maxZoom: 18,
    max: 1.0,
    minOpacity: 0.2,
    gradient: {
      0.00: "rgba(67, 160, 71, 0)",
      0.25: "#F6FF75", // Baixo
      0.45: "#FDD835", // Médio
      0.70: "#FB8C00", // Alto
      1.00: "#E53935"  // Crítico
    }
  }
).addTo(mapa);

// Camada de marcadores individuais
const camadaMarcadores = L.layerGroup().addTo(mapa);

/* CAMADA OPENSTREETMAP */
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(mapa);

/* MARCADOR CENTRAL */
L.marker([-8.891, -36.289])
  .addTo(mapa)
  .bindPopup("<b>EcoAngelim</b><br>Centro da cidade.");

/* CRIAÇÃO DOS MARCADORES DE OCORRÊNCIA */
ocorrencias.forEach(function (ocorrencia) {
  const texto =
    "<b>" + ocorrencia.categoria + "</b><br><br>" +
    ocorrencia.descricao + "<br><br>" +
    "<strong>Nível:</strong> " + ocorrencia.nivel + "<br>" +
    "<strong>Status:</strong> " + ocorrencia.status + "<br>" +
    "<strong>Apoios:</strong> " + ocorrencia.apoios;

  let icone;
  switch (ocorrencia.nivel) {
    case "Baixo": icone = iconeVerde; break;
    case "Médio": icone = iconeAmarelo; break;
    case "Alto": icone = iconeLaranja; break;
    case "Crítico": icone = iconeVermelho; break;
    default: icone = iconeVerde;
  }

  const marcador = L.marker([ocorrencia.latitude, ocorrencia.longitude], {
    icon: icone
  }).bindPopup(texto);

  camadaMarcadores.addLayer(marcador);
});

/* ==========================================
   INTERATIVIDADE NO HEATMAP (CLIQUE NO MAPA)
========================================== */
mapa.on("click", function (e) {
  const latClique = e.latlng.lat;
  const lngClique = e.latlng.lng;

  // A função ainda identifica a região corretamente de acordo com as coordenadas
  const nomeRegiao = obterIdentificadorRegiao(latClique, lngClique);

  if (nomeRegiao === "Área Externa (Sem Região)") return; // Ignora se clicar fora das grades lógicas

  const ocorrenciasDaRegiao = ocorrencias.filter(function (oc) {
    return obterIdentificadorRegiao(oc.latitude, oc.longitude) === nomeRegiao;
  });

  if (ocorrenciasDaRegiao.length > 0) {
    const ias = calcularIAS(ocorrenciasDaRegiao);
    const estado = estadoIAS(ias);
    abrirPainelIAS(nomeRegiao, ocorrenciasDaRegiao, ias, estado);
  }
});

// DIVULGAÇÃO PROGRESSIVA
function atualizarVisualizacao() {
  const zoom = mapa.getZoom();
  if (zoom < 16) {
    mapa.addLayer(camadaHeat);
    mapa.removeLayer(camadaMarcadores);
  } else {
    mapa.addLayer(camadaHeat);
    mapa.addLayer(camadaMarcadores);
  }
}

mapa.on("zoomend", atualizarVisualizacao);
atualizarVisualizacao();

/* ==========================================
   CONTROLES EXTRAS
========================================== */
const botaoTelaCheia = document.getElementById("fullscreen");
if (botaoTelaCheia) {
  botaoTelaCheia.onclick = async function () {
    if (!document.fullscreenElement) {
      await document.getElementById("mapa").requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
}

document.addEventListener("fullscreenchange", function () {
  setTimeout(function () {
    mapa.invalidateSize();
    mapa.fitBounds(limitesExploracao);
  }, 300);
});

// Restringe o arrasto do mapa para o limite maior
mapa.on("drag", function () {
  mapa.panInsideBounds(limitesExploracao, { animate: false });
});

/* PAINEL IAS */
function abrirPainelIAS(nomeRegiao, lista, ias, estado) {
  const painel = document.getElementById("painel-regiao");
  const conteudo = document.getElementById("conteudo-regiao");

  if(!painel || !conteudo) return;

  conteudo.innerHTML = `
    <h2>📍 ${nomeRegiao}</h2>
    <h3>IAS ${ias} • ${estado.texto}</h3>
    <p><strong>Ocorrências na região:</strong> ${lista.length}</p>
    <p><strong>Última atualização:</strong> ${new Date(lista[0].data).toLocaleDateString("pt-BR")}</p>
    <button onclick="location.href='comunidade.html'">
      Ver denúncias
    </button>
  `;

  painel.classList.add("ativo");
}

function fecharPainelIAS() {
  const painel = document.getElementById("painel-regiao");
  if(painel) painel.classList.remove("ativo");
}

const botaoFechar = document.getElementById("fecharSheet");
if(botaoFechar) botaoFechar.onclick = fecharPainelIAS;
