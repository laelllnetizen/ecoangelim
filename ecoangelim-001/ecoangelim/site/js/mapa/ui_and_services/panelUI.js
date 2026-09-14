/* ' ECOANGELIM - js/ui_and_services/panelUI.js ' */
export function abrirPainelIAS(nomeRegiao, lista, ias, estado) {
  const painel = document.getElementById("painel-regiao");
  const conteudo = document.getElementById("conteudo-regiao");

  if (!painel || !conteudo) return;

  const primeiraOcorrencia = (lista && lista.length > 0) ? lista[0] : {};
  const dataBruta = primeiraOcorrencia.criadoEm || primeiraOcorrencia.data;
  
  let dataFormatada = "Data não informada";
  if (dataBruta) {
    const dataObj = dataBruta.toDate ? dataBruta.toDate() : new Date(dataBruta);
    if (!Number.isNaN(dataObj.getTime())) {
      dataFormatada = dataObj.toLocaleDateString("pt-BR");
    }
  }

  conteudo.innerHTML = `
    <h2>📍 ${nomeRegiao}</h2>
    <h3>IAS ${ias} • ${estado.texto}</h3>
    <p><strong>Ocorrências na região:</strong> ${lista.length}</p>
    <p><strong>Última atualização:</strong> ${dataFormatada}</p>
    <button onclick="location.href='comunidade.html'">
      Ver denúncias
    </button>
  `;

  painel.classList.add("ativo");
}

export function fecharPainelIAS() {
  const painel = document.getElementById("painel-regiao");
  if (painel) painel.classList.remove("ativo");
}

export function inicializarControesUI(mapa, limitesExploracao) {
  const botaoTelaCheia = document.getElementById("fullscreen");
  if (botaoTelaCheia) {
    botaoTelaCheia.onclick = async () => {
      if (!document.fullscreenElement) {
        await document.getElementById("mapa").requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    };
  }

  document.addEventListener("fullscreenchange", () => {
    setTimeout(() => {
      mapa.invalidateSize();
      mapa.fitBounds(limitesExploracao);
    }, 300);
  });

  const botaoFechar = document.getElementById("fecharSheet");
  if (botaoFechar) botaoFechar.onclick = fecharPainelIAS;
}
