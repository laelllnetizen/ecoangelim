export function carregarOcorrencias() {
  return JSON.parse(
    localStorage.getItem("ecoangelim_ocorrencias") || "[]"
  );
}
