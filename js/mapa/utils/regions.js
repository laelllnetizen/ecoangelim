import { 
  limitesCentro, 
  limitesQuatroBocas, 
  configCentro, 
  configQuatroBocas 
} from "../config/bounds.js";

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

export function obterIdentificadorRegiao(lat, lng) {
  const ponto = L.latLng(lat, lng);

  if (limitesCentro.contains(ponto)) {
    return calcularRegiaoNaGrade(lat, lng, limitesCentro, configCentro.linhas, configCentro.colunas, configCentro.inicioNum);
  }
  
  if (limitesQuatroBocas.contains(ponto)) {
    return calcularRegiaoNaGrade(lat, lng, limitesQuatroBocas, configQuatroBocas.linhas, configQuatroBocas.colunas, configQuatroBocas.inicioNum);
  }

  return "Área Externa (Sem Região)";
}
