const CHAVE_STORAGE = "ecoangelim_ocorrencias";

export function carregarOcorrencias() {
  return JSON.parse(localStorage.getItem(CHAVE_STORAGE) || "[]");
}

export function adicionarOcorrencia(dadosFormulario) {
  const ocorrencias = carregarOcorrencias();
  const eProblema = dadosFormulario.tipo === "problema";

  const novaOcorrencia = {
    id: Date.now(),
    data: new Date().toISOString(),
    tipo: dadosFormulario.tipo || "problema", // "problema" (Denúncia) ou "acao" (Ação Verde)
    localizacao: dadosFormulario.localizacao,
    latitude: Number(dadosFormulario.latitude),
    longitude: Number(dadosFormulario.longitude),
    categoria: dadosFormulario.categoria,
    descricao: dadosFormulario.descricao,
    foto: dadosFormulario.foto || "",
    // Campos específicos para Denúncia
    nivel: eProblema ? (dadosFormulario.nivel || "Baixo") : null,
    status: eProblema ? "Aberta" : "Registrada",
    // Campos específicos para Ação Verde
    impacto: !eProblema ? (dadosFormulario.impacto || "Geral") : null,
    apoios: 0
  };

  ocorrencias.push(novaOcorrencia);
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(ocorrencias));

  return novaOcorrencia;
}
