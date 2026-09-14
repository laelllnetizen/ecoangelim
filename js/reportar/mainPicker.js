/* ' ECOANGELIM - js/reportar/mainPicker.js ' */
import { 
  criarMapaSeletor, 
  posicionarMarcador, 
  removerMarcador, 
  validarAreaClique 
} from "./pickerMap.js";
import { obterEnderecoPorCoordenadas } from "./services/geocoding.js";
import { 
  atualizarCamposLocalizacao, 
  exibirCarregandoEndereco, 
  extrairDadosFormulario, 
  resetarFormulario,
  alternarTipoFormulario,
  configurarPreviewImagem
} from "./formUI.js";

import { db, auth } from "../firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const mapa = criarMapaSeletor();

const botoesTipo = document.querySelectorAll(".btn-tipo");
botoesTipo.forEach(botao => {
  botao.addEventListener("click", () => {
    botoesTipo.forEach(b => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    alternarTipoFormulario(botao.dataset.tipo);
  });
});

mapa.on("click", async (evento) => {
  const { lat, lng } = evento.latlng;
  const area = validarAreaClique(evento.latlng);

  if (!area.valida) {
    alert("Por favor, selecione um ponto dentro das áreas destacadas (Centro ou Quatro Bocas).");
    return;
  }

  posicionarMarcador(mapa, lat, lng);

  if (area.isQuatroBocas) {
    const enderecoFixo = "Estrada Quatro Bocas, Angelim, Pernambuco, Região Nordeste, Brasil";
    atualizarCamposLocalizacao(lat, lng, enderecoFixo);
    return;
  }

  exibirCarregandoEndereco();
  const resultadoEndereco = await obterEnderecoPorCoordenadas(lat, lng);

  if (typeof resultadoEndereco === "object" && resultadoEndereco.erro) {
    atualizarCamposLocalizacao(
      lat, 
      lng, 
      resultadoEndereco.coordenadas, 
      resultadoEndereco.fallbackTexto
    );
  } else {
    atualizarCamposLocalizacao(lat, lng, resultadoEndereco);
  }
});

const formulario = document.getElementById("formOcorrencia");

if (formulario) {
  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dados = extrairDadosFormulario();

    if (!dados.latitude || !dados.longitude) {
      alert("Selecione o local no mapa.");
      return;
    }

    const eProblema = dados.tipo === "problema";
    const inputFoto = document.getElementById("foto");
    const urlFoto = inputFoto ? inputFoto.value.trim() : "";

    try {
      await addDoc(collection(db, "posts"), {
        tipo: eProblema ? "denuncia" : "acao",
        categoria: dados.categoria,
        descricao: dados.descricao,
        localizacao: dados.localizacao,
        latitude: Number(dados.latitude),
        longitude: Number(dados.longitude),
        foto: urlFoto,
        nivel: eProblema ? (dados.nivel || "Baixo") : null,
        impacto: !eProblema ? (dados.impacto || "Geral") : null,
        status: eProblema ? "Aberta" : "Registrada",
        autor: auth.currentUser ? auth.currentUser.email : "Cidadão Anônimo",
        criadoEm: new Date(),
        apoios: 0
      });

      const mensagemSucesso = eProblema 
        ? "Ocorrência registrada com sucesso!" 
        : "Ação positiva registrada com sucesso! Obrigado por contribuir.";

      alert(mensagemSucesso);
      resetarFormulario();
      removerMarcador(mapa);
      
      window.location.href = "comunidade.html";
    } catch (error) {
      console.error("Erro ao salvar ocorrência:", error);
      alert("Erro ao enviar post. Verifique sua conexão.");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarPreviewImagem();
});
