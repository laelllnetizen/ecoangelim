/* ' ECOANGELIM - js/reportar/formUI.js ' */

export function alternarTipoFormulario(tipo) {
  const inputTipo = document.getElementById("tipoRegistro");
  const camposProblema = document.querySelectorAll(".campo-problema");
  const camposAcao = document.querySelectorAll(".campo-acao");
  const card = document.querySelector(".formulario-card");

  const labelDescricao = document.getElementById("labelDescricao");
  const btnSubmit = document.getElementById("btnSubmit");
  const textareaDescricao = document.getElementById("descricao");
  
  // Elementos do painel lateral
  const tituloPainel = document.getElementById("tituloPainel");
  const listaOrientacoes = document.getElementById("listaOrientacoes");

  if (inputTipo) inputTipo.value = tipo;

  if (tipo === "problema") {
    card?.classList.remove("modo-acao");
    camposProblema.forEach(el => el.classList.remove("escondido"));
    camposAcao.forEach(el => el.classList.add("escondido"));

    const catProb = document.getElementById("categoriaProblema");
    const catAcao = document.getElementById("categoriaAcao");
    if (catProb) catProb.required = true;
    if (catAcao) catAcao.required = false;

    if (labelDescricao) labelDescricao.innerText = "Descrição detalhada do problema";
    if (textareaDescricao) textareaDescricao.placeholder = "Descreva a situação encontrada com o máximo de detalhes...";
    if (btnSubmit) btnSubmit.innerText = "Enviar Ocorrência";

    if (tituloPainel) tituloPainel.innerText = "Antes de reportar";
    if (listaOrientacoes) {
      listaOrientacoes.innerHTML = `
        <li><span class="icone">📍</span><div><strong>Precisão:</strong> Marque o local com exatidão no mapa.</div></li>
        <li><span class="icone">📷</span><div><strong>Evidência:</strong> Insira o link de uma foto nítida para facilitar a verificação.</div></li>
        <li><span class="icone">📝</span><div><strong>Clareza:</strong> Seja objetivo e detalhado na sua descrição.</div></li>
        <li><span class="icone">🤝</span><div><strong>Cidadania:</strong> Registros verdadeiros ajudam a melhorar Angelim.</div></li>
      `;
    }
  } else {
    card?.classList.add("modo-acao");
    camposAcao.forEach(el => el.classList.remove("escondido"));
    camposProblema.forEach(el => el.classList.add("escondido"));

    const catAcao = document.getElementById("categoriaAcao");
    const catProb = document.getElementById("categoriaProblema");
    if (catAcao) catAcao.required = true;
    if (catProb) catProb.required = false;

    if (labelDescricao) labelDescricao.innerText = "Descrição da Ação Positiva";
    if (textareaDescricao) textareaDescricao.placeholder = "Conte como a ação foi realizada, quem participou ou os resultados obtidos...";
    if (btnSubmit) btnSubmit.innerText = "Registrar Ação Positiva";

    if (tituloPainel) tituloPainel.innerText = "Sobre as Ações Positivas";
    if (listaOrientacoes) {
      listaOrientacoes.innerHTML = `
        <li><span class="icone">🌱</span><div><strong>Inspirador:</strong> Suas ações motivam outros moradores de Angelim.</div></li>
        <li><span class="icone">📸</span><div><strong>Registre o momento:</strong> Insira o link de fotos do antes/depois ou da equipe.</div></li>
        <li><span class="icone">🪙</span><div><strong>Recompensa:</strong> Ações comunitárias valem EcoCoins bônus!</div></li>
      `;
    }
  }
}

export function atualizarCamposLocalizacao(lat, lng, endereco, resumoTexto) {
  const elLat = document.getElementById("latitude");
  const elLng = document.getElementById("longitude");
  const elLocal = document.getElementById("localizacao");
  const elCoord = document.getElementById("coordenadas");

  if (elLat) elLat.value = lat;
  if (elLng) elLng.value = lng;
  if (elLocal) elLocal.value = endereco;
  if (elCoord) elCoord.innerText = resumoTexto || endereco;
}

export function exibirCarregandoEndereco() {
  const elCoord = document.getElementById("coordenadas");
  if (elCoord) elCoord.innerText = "Obtendo endereço...";
}

export function resetarFormulario() {
  const formulario = document.getElementById("formOcorrencia");
  if (formulario) formulario.reset();

  const elCoord = document.getElementById("coordenadas");
  if (elCoord) {
    elCoord.innerText = "Clique no mapa para escolher a localização.";
  }

  // Oculta e limpa a área de pré-visualização da imagem
  const previewContainer = document.getElementById("previewContainer");
  const imgPreview = document.getElementById("imgPreview");
  const erroPreview = document.getElementById("erroPreview");

  if (previewContainer) previewContainer.style.display = "none";
  if (imgPreview) imgPreview.src = "";
  if (erroPreview) erroPreview.style.display = "none";

  const tipoAtual = document.getElementById("tipoRegistro")?.value || "problema";
  alternarTipoFormulario(tipoAtual);
}

export function extrairDadosFormulario() {
  const tipo = document.getElementById("tipoRegistro")?.value || "problema";

  const dados = {
    tipo: tipo,
    localizacao: document.getElementById("localizacao")?.value || "",
    latitude: document.getElementById("latitude")?.value || "",
    longitude: document.getElementById("longitude")?.value || "",
    descricao: document.getElementById("descricao")?.value || "",
    foto: document.getElementById("foto")?.value?.trim() || ""
  };

  if (tipo === "problema") {
    dados.categoria = document.getElementById("categoriaProblema")?.value || "";
    dados.nivel = document.getElementById("nivel")?.value || "Baixo";
  } else {
    dados.categoria = document.getElementById("categoriaAcao")?.value || "";
    dados.impacto = document.getElementById("impacto")?.value || "Geral";
  }

  return dados;
}

export function configurarPreviewImagem() {
  const inputFoto = document.getElementById("foto");
  const previewContainer = document.getElementById("previewContainer");
  const imgPreview = document.getElementById("imgPreview");
  const erroPreview = document.getElementById("erroPreview");
  const formulario = document.getElementById("formOcorrencia");

  if (!inputFoto || !previewContainer || !imgPreview) return;

  const ocultarPreview = () => {
    previewContainer.style.display = "none";
    imgPreview.src = "";
    if (erroPreview) erroPreview.style.display = "none";
  };

  inputFoto.addEventListener("input", () => {
    const url = inputFoto.value.trim();

    if (url) {
      previewContainer.style.display = "block";
      if (erroPreview) erroPreview.style.display = "none";
      imgPreview.style.display = "inline-block";
      imgPreview.src = url;

      imgPreview.onerror = () => {
        imgPreview.style.display = "none";
        if (erroPreview) erroPreview.style.display = "block";
      };

      imgPreview.onload = () => {
        imgPreview.style.display = "inline-block";
        if (erroPreview) erroPreview.style.display = "none";
      };
    } else {
      ocultarPreview();
    }
  });

  if (formulario) {
    formulario.addEventListener("reset", ocultarPreview);
  }
}
