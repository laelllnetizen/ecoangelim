/* ' ECOANGELIM - js/comunidade.js ' */
import { db, auth } from "./firebase-config.js";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  increment,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const feed = document.getElementById("feed");
const filtros = document.querySelectorAll(".filtro");

let ocorrencias = [];
let filtroAtual = "todos";

const consulta = query(collection(db, "posts"), orderBy("criadoEm", "desc"));

// Escuta atualizações em tempo real no Firestore
onSnapshot(consulta, (snapshot) => {
  ocorrencias = [];
  snapshot.forEach((documento) => {
    ocorrencias.push({
      id: documento.id,
      ...documento.data()
    });
  });
  renderizarFeed();
});

function renderizarFeed() {
  feed.innerHTML = "";
  let lista = [...ocorrencias];

  // 1. Ocultar posts denunciados localmente pelo usuário
  const ocultos = JSON.parse(localStorage.getItem("posts_ocultos_ecoangelim") || "[]");
  lista = lista.filter((ocorrencia) => !ocultos.includes(ocorrencia.id));

  // 2. Aplicação dos Filtros
  const usuarioLogado = auth.currentUser ? auth.currentUser.email : null;

  if (filtroAtual === "minhas") {
    lista = lista.filter((o) => usuarioLogado && o.autor === usuarioLogado);
  } else if (filtroAtual === "acoes") {
    lista = lista.filter((o) => o.tipo === "acao");
  } else if (filtroAtual === "denuncias") {
    lista = lista.filter((o) => o.tipo === "denuncia" || o.tipo === "problema");
  } else if (filtroAtual !== "todos") {
    lista = lista.filter((o) => identificarCategoria(o) === filtroAtual);
  }

  // 3. Exibição de Estado Vazio
  if (lista.length === 0) {
    let mensagemVazia = "Ainda não existem registros nesta categoria.";
    if (filtroAtual === "minhas") {
      mensagemVazia = usuarioLogado 
        ? "Você ainda não fez nenhuma publicação." 
        : "Faça login para visualizar suas publicações.";
    }

    feed.innerHTML = `
      <div class="estado-vazio">
        <div class="icone">🌱</div>
        <strong>Nenhuma ocorrência encontrada</strong>
        <p>${mensagemVazia}</p>
      </div>
    `;
    return;
  }

  // 4. Renderizar cada Post no Feed
  lista.forEach((ocorrencia) => {
    const card = criarPost(ocorrencia);
    feed.appendChild(card);
  });
}

function criarPost(ocorrencia) {
  const card = document.createElement("article");
  const eAcaoVerde = ocorrencia.tipo === "acao";
  
  card.className = `post ${eAcaoVerde ? "post-acao" : "post-denuncia"}`;
  card.dataset.id = ocorrencia.id;

  const dataFormatada = formatarData(ocorrencia.criadoEm);
  const categoria = ocorrencia.categoria || "Ocorrência";
  const descricao = ocorrencia.descricao || "Nenhuma descrição informada.";
  const localizacao = ocorrencia.localizacao || "Localização não informada.";
  const nivelOuImpacto = eAcaoVerde 
    ? (ocorrencia.impacto || "Geral") 
    : (ocorrencia.nivel || "Não informado");
  
  const apoios = Number(ocorrencia.apoios || 0);
  const usuarioLogado = auth.currentUser ? auth.currentUser.email : null;
  const jaApioou = ocorrencia.apoiadores && ocorrencia.apoiadores.includes(usuarioLogado);

  const iconeCabecalho = eAcaoVerde ? "🌱" : obterIconeCategoria(categoria);
  const tagTipo = eAcaoVerde 
    ? `<span class="tag-tipo tag-acao">🌱 Ação Verde</span>`
    : `<span class="tag-tipo tag-denuncia">⚠️ Denúncia</span>`;

  const secaoFoto = ocorrencia.foto 
    ? `<div class="post-foto-container" style="margin: 10px 0;">
         <img src="${ocorrencia.foto}" alt="Evidência" style="max-width: 100%; border-radius: 8px; max-height: 300px; object-fit: cover;" onerror="this.parentElement.style.display='none';">
       </div>`
    : "";

  const eDono = usuarioLogado && ocorrencia.autor === usuarioLogado;

  card.innerHTML = `
    <div class="cabecalho-post">
      <div class="post-identidade">
        <div class="post-avatar">
          ${iconeCabecalho}
        </div>
        <div class="post-categoria">
          <div class="linha-titulo-post">
            <strong>${escaparHTML(categoria)}</strong>
            ${tagTipo}
          </div>
          <small>${dataFormatada} • ${escaparHTML(ocorrencia.autor || "Anônimo")}</small>
        </div>
      </div>

      <div class="menu-post">
        <button
          class="menu-btn"
          type="button"
          aria-label="Mais opções"
          onclick="window.abrirMenu('${ocorrencia.id}')"
        >
          ⋮
        </button>

        <div class="dropdown" id="menu-${ocorrencia.id}">
          <button type="button" onclick="window.denunciar('${ocorrencia.id}')">
            🚩 Denunciar publicação
          </button>
          ${eDono ? `<button type="button" class="btn-excluir" style="color: #d9534f;" onclick="window.excluirPost('${ocorrencia.id}')">🗑️ Excluir publicação</button>` : ''}
        </div>
      </div>
    </div>

    <p class="post-descricao">
      ${escaparHTML(descricao)}
    </p>

    ${secaoFoto}

    <div class="post-localizacao">
      <span>📍</span>
      <span>${escaparHTML(localizacao)}</span>
    </div>

    <span class="post-nivel">
      ${eAcaoVerde ? "✨ Impacto:" : "🚨 Nível:"} ${escaparHTML(nivelOuImpacto)}
    </span>

    <div class="acoes-post">
      <button
        class="botao-apoiar ${jaApioou ? 'apoiado' : ''}"
        type="button"
        onclick="window.apoiar('${ocorrencia.id}')"
        style="${jaApioou ? 'background-color: #e2f0d9; border-color: #5cb85c;' : ''}"
      >
        👍
        <span class="texto-apoio">${jaApioou ? 'Apoiado' : 'Apoiar'}</span>
        <span class="contador-apoio">${apoios}</span>
      </button>
    </div>
  `;

  return card;
}

// Controle de Apoio (1 apoio por usuário por post)
window.apoiar = async function(id) {
  if (!auth.currentUser) {
    alert("Você precisa estar logado para apoiar uma publicação.");
    return;
  }

  const usuarioEmail = auth.currentUser.email;
  const postRef = doc(db, "posts", id);
  const post = ocorrencias.find((p) => p.id === id);
  
  if (!post) return;

  const apoiadores = post.apoiadores || [];
  const jaApioou = apoiadores.includes(usuarioEmail);

  try {
    if (jaApioou) {
      await updateDoc(postRef, {
        apoios: increment(-1),
        apoiadores: arrayRemove(usuarioEmail)
      });
    } else {
      await updateDoc(postRef, {
        apoios: increment(1),
        apoiadores: arrayUnion(usuarioEmail)
      });
    }
  } catch (error) {
    console.error("Erro ao atualizar apoio:", error);
    alert("Não foi possível registrar o apoio. Verifique sua conexão.");
  }
};

// Exclusão de publicação pelo autor
window.excluirPost = async function(id) {
  if (confirm("Tem certeza de que deseja excluir esta publicação? Esta ação não pode ser desfeita.")) {
    try {
      await deleteDoc(doc(db, "posts", id));
      alert("Publicação excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      alert("Erro ao excluir a publicação.");
    }
  }
};

// Denunciar e ocultar localmente no navegador
window.denunciar = function(id) {
  alert("Denúncia registrada. A publicação foi ocultada do seu feed.");
  
  let ocultos = JSON.parse(localStorage.getItem("posts_ocultos_ecoangelim") || "[]");
  if (!ocultos.includes(id)) {
    ocultos.push(id);
    localStorage.setItem("posts_ocultos_ecoangelim", JSON.stringify(ocultos));
  }
  
  renderizarFeed();
};

window.abrirMenu = function(id) {
  document.querySelectorAll(".dropdown").forEach((menu) => {
    if (menu.id !== "menu-" + id) {
      menu.classList.remove("mostrar");
    }
  });

  const menu = document.getElementById("menu-" + id);
  if (menu) {
    menu.classList.toggle("mostrar");
  }
};

window.addEventListener("click", (event) => {
  if (!event.target.closest(".menu-post")) {
    document.querySelectorAll(".dropdown").forEach((menu) => {
      menu.classList.remove("mostrar");
    });
  }
});

filtros.forEach((filtro) => {
  filtro.addEventListener("click", () => {
    filtros.forEach((item) => item.classList.remove("ativo"));
    filtro.classList.add("ativo");
    filtroAtual = filtro.dataset.filtro;
    renderizarFeed();
  });
});

function identificarCategoria(ocorrencia) {
  const categoria = String(ocorrencia.categoria || "").toLowerCase();

  if (
    categoria.includes("ambient") ||
    categoria.includes("lixo") ||
    categoria.includes("resíduo") ||
    categoria.includes("arbor") ||
    categoria.includes("veget") ||
    categoria.includes("queimada") ||
    categoria.includes("plantio") ||
    categoria.includes("mutirão") ||
    categoria.includes("coleta") ||
    categoria.includes("revitalização") ||
    categoria.includes("educação")
  ) {
    return "ambiental";
  }

  if (
    categoria.includes("sanit") ||
    categoria.includes("água") ||
    categoria.includes("esgoto") ||
    categoria.includes("dengue") ||
    categoria.includes("poluição")
  ) {
    return "sanitario";
  }

  if (
    categoria.includes("urb") ||
    categoria.includes("rua") ||
    categoria.includes("calçada") ||
    categoria.includes("iluminação") ||
    categoria.includes("buraco") ||
    categoria.includes("outro")
  ) {
    return "urbano";
  }

  return "todos";
}

function obterIconeCategoria(categoria) {
  const tipo = identificarCategoria({ categoria: categoria });
  if (tipo === "ambiental") return "🌱";
  if (tipo === "sanitario") return "💧";
  if (tipo === "urbano") return "🏘️";
  return "📍";
}

function formatarData(dataFirestore) {
  if (!dataFirestore) return "Data não informada";
  const dataObj = dataFirestore.toDate ? dataFirestore.toDate() : new Date(dataFirestore);
  if (Number.isNaN(dataObj.getTime())) {
    return "Data não informada";
  }
  return dataObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function escaparHTML(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
