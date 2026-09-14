export function processarPontosHeatmap(ocorrencias) {
  return ocorrencias.map(ocorrencia => {
    let intensidade = 0.00;
    switch (ocorrencia.nivel) {
      case "Baixo": intensidade = 0.25; break;
      case "Médio": intensidade = 0.45; break;
      case "Alto": intensidade = 0.70; break;
      case "Crítico": intensidade = 1.0; break;
    }
    return [ocorrencia.latitude, ocorrencia.longitude, intensidade];
  });
}

export const opcoesHeatmap = {
  radius: 45,
  blur: 35,
  maxZoom: 18,
  max: 1.0,
  minOpacity: 0.2,
  gradient: {
    0.00: "rgba(67, 160, 71, 0)",
    0.25: "#F6FF75",
    0.45: "#FDD835",
    0.70: "#FB8C00",
    1.00: "#E53935"
  }
};
