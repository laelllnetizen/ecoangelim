const baseIconConfig = {
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
};

export const iconeVerde = new L.Icon({
  ...baseIconConfig,
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
});

export const iconeAmarelo = new L.Icon({
  ...baseIconConfig,
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png"
});

export const iconeLaranja = new L.Icon({
  ...baseIconConfig,
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png"
});

export const iconeVermelho = new L.Icon({
  ...baseIconConfig,
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
});

export function obterIconePorNivel(nivel) {
  switch (nivel) {
    case "Baixo": return iconeVerde;
    case "Médio": return iconeAmarelo;
    case "Alto": return iconeLaranja;
    case "Crítico": return iconeVermelho;
    default: return iconeVerde;
  }
}
