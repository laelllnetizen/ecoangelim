/* ' CHAVE DO LOCALSTORAGE ' */
const CHAVE_OCORRENCIAS = "ecoangelim_ocorrencias";

/* ' CARREGAR OCORRÊNCIAS ' */
function carregarOcorrencias() {
  const dados = localStorage.getItem(CHAVE_OCORRENCIAS);

  if (dados) {
    try {
      return JSON.parse(dados);
    } catch (erro) {
      console.error("Erro ao carregar ocorrências:", erro);
      return [];
    }
  }

  return [];
}

/* ' SALVAR TODAS AS OCORRÊNCIAS ' */
function salvarOcorrencias(ocorrencias) {
  localStorage.setItem(CHAVE_OCORRENCIAS, JSON.stringify(ocorrencias));
}

/* ' ADICIONAR NOVA OCORRÊNCIA ' */
function adicionarOcorrencia(ocorrencia) {
  const ocorrencias = carregarOcorrencias();
  ocorrencias.push(ocorrencia);
  salvarOcorrencias(ocorrencias);
}

/* ' BUSCAR OCORRÊNCIA PELO ID ' */
function buscarOcorrencia(id) {
  const ocorrencias = carregarOcorrencias();
  return ocorrencias.find(ocorrencia => ocorrencia.id === id);
}

/* ' REMOVER OCORRÊNCIA ' */
function removerOcorrencia(id) {
  let ocorrencias = carregarOcorrencias();
  ocorrencias = ocorrencias.filter(ocorrencia => ocorrencia.id !== id);
  salvarOcorrencias(ocorrencias);
}

/* ' ATUALIZAR OCORRÊNCIA ' */
function atualizarOcorrencia(ocorrenciaAtualizada) {
  const ocorrencias = carregarOcorrencias();
  const indice = ocorrencias.findIndex(
    ocorrencia => ocorrencia.id === ocorrenciaAtualizada.id
  );

  if (indice !== -1) {
    ocorrencias[indice] = ocorrenciaAtualizada;
    salvarOcorrencias(ocorrencias);
  }
}

/* ' APOIAR OCORRÊNCIA ' */
function apoiarOcorrencia(id) {
  const ocorrencias = carregarOcorrencias();
  const ocorrencia = ocorrencias.find(ocorrencia => ocorrencia.id === id);

  if (ocorrencia) {
    ocorrencia.apoios++;
    salvarOcorrencias(ocorrencias);
  }
}
