import { 
  limitesExploracao, 
  limitesCentro, 
  limitesQuatroBocas, 
  estiloSelecionavel 
} from "../mapa/config/bounds.js";

let marcadorAtual = null;

export function criarMapaSeletor() {
  const mapa = L.map("mapa-localizacao").setView([-8.891, -36.289], 14);

  mapa.setMinZoom(13);
  mapa.setMaxZoom(18);

  mapa.setMaxBounds(limitesExploracao);
  mapa.fitBounds(limitesExploracao);

  // Restrição de arrasto
  mapa.on("drag", () => {
    mapa.panInsideBounds(limitesExploracao, { animate: false });
  });

  // Camada base
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(mapa);

  // Desenha retângulos indicativos visuais
  L.rectangle(limitesCentro, estiloSelecionavel).addTo(mapa);
  L.rectangle(limitesQuatroBocas, estiloSelecionavel).addTo(mapa);
  
  setTimeout(() => {
    mapa.invalidateSize();
  }, 200);

  return mapa;
}

export function posicionarMarcador(mapa, lat, lng) {
  if (marcadorAtual) {
    mapa.removeLayer(marcadorAtual);
  }
  marcadorAtual = L.marker([lat, lng]).addTo(mapa);
}

export function removerMarcador(mapa) {
  if (marcadorAtual) {
    mapa.removeLayer(marcadorAtual);
    marcadorAtual = null;
  }
}

export function validarAreaClique(ponto) {
  const noCentro = limitesCentro.contains(ponto);
  const naQuatroBocas = limitesQuatroBocas.contains(ponto);

  return {
    valida: noCentro || naQuatroBocas,
    isQuatroBocas: naQuatroBocas
  };
}
