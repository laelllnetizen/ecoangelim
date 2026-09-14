/* ' ECOANGELIM - Módulo de Cálculo IAS ' */

/* ' PESOS ' */
export const PESOS = {
  severidade: 0.35,
  frequencia: 0.20,
  recencia: 0.25,
  confiabilidade: 0.20
};

/* ' SEVERIDADE ' */
export function calcularSeveridade(lista) {
  if (!lista || lista.length === 0) return 0;
  let soma = 0;

  lista.forEach(function (o) {
    switch (o.nivel) {
      case "Baixo":
        soma += 1;
        break;
      case "Médio":
        soma += 2;
        break;
      case "Alto":
        soma += 4;
        break;
      case "Crítico":
        soma += 6;
        break;
    }
  });

  return Math.min(100, soma * 5);
}

/* ' FREQUÊNCIA ' */
export function calcularFrequencia(lista) {
  if (!lista || lista.length === 0) return 0;
  return Math.min(100, lista.length * 8);
}

/* ' RECÊNCIA ' */
export function calcularRecencia(lista) {
  if (!lista || lista.length === 0) return 0;
  let maior = 0;
  const hoje = new Date();

  lista.forEach(function (o) {
    // Trata caso a data seja um Timestamp do Firestore ou String
    const dataObj = o.data?.toDate ? o.data.toDate() : new Date(o.data || hoje);
    const dias = (hoje - dataObj) / 86400000;
    let valor = 0;

    if (dias <= 1) valor = 100;
    else if (dias <= 3) valor = 90;
    else if (dias <= 7) valor = 75;
    else if (dias <= 15) valor = 55;
    else if (dias <= 30) valor = 30;
    else valor = 10;

    if (valor > maior) maior = valor;
  });

  return maior;
}

/* ' CONFIABILIDADE ' */
export function calcularConfiabilidade(lista) {
  if (!lista || lista.length === 0) return 0;
  let soma = 0;

  lista.forEach(function (o) {
    let pontos = 0;

    if (o.foto) pontos += 30;
    pontos += Math.min((o.apoios || 0) * 5, 30);
    pontos += Math.min((o.confirmacoes || 0) * 10, 30);
    if (o.validada) pontos += 10;

    soma += Math.min(pontos, 100);
  });

  return soma / lista.length;
}

/* ' STATUS ' */
export function fatorStatus(lista) {
  if (!lista || lista.length === 0) return 0;
  let soma = 0;

  lista.forEach(function (o) {
    switch (o.status) {
      case "Aberta":
        soma += 1;
        break;
      case "Em análise":
        soma += 0.8;
        break;
      case "Em execução":
        soma += 0.6;
        break;
      case "Resolvida":
        soma += 0.2;
        break;
      default:
        soma += 1;
    }
  });

  return soma / lista.length;
}

/* ' CÁLCULO IAS ' */
export function calcularIAS(lista) {
  if (!lista || lista.length === 0) return 0;

  const s = calcularSeveridade(lista);
  const f = calcularFrequencia(lista);
  const r = calcularRecencia(lista);
  const c = calcularConfiabilidade(lista);
  const status = fatorStatus(lista);

  let ias = (
    s * PESOS.severidade +
    f * PESOS.frequencia +
    r * PESOS.recencia +
    c * PESOS.confiabilidade
  ) * status;

  return Math.round(Math.min(ias, 100));
}

/* ' ESTADO IAS ' */
export function estadoIAS(valor) {
  if (valor < 20) {
    return {
      texto: "Estável",
      cor: "#43A047"
    };
  }

  if (valor < 40) {
    return {
      texto: "Em Observação",
      cor: "#FDD835"
    };
  }

  if (valor < 60) {
    return {
      texto: "Atenção",
      cor: "#FB8C00"
    };
  }

  if (valor < 80) {
    return {
      texto: "Alerta",
      cor: "#E53935"
    };
  }

  return {
    texto: "Crítico",
    cor: "#8E24AA"
  };
}
