import { limitesExploracao } from "./config/bounds.js";

export function criarMapa() {
  const mapa = L.map("mapa").setView([-8.891, -36.289], 14);

  mapa.setMinZoom(13);
  mapa.setMaxZoom(18);

  mapa.setMaxBounds(limitesExploracao);
  mapa.fitBounds(limitesExploracao);

  // Trava a câmera dentro do limite estipulado
  mapa.on("drag", () => {
    mapa.panInsideBounds(limitesExploracao, { animate: false });
  });

  // Camada base do OSM
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(mapa);

  // Ponto fixo central
  L.marker([-8.891, -36.289])
    .addTo(mapa)
    .bindPopup("<b>EcoAngelim</b><br>Centro da cidade.");

  return mapa;
}
