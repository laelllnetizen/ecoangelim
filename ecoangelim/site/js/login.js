import { auth } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// --- SELETORES DOS ELEMENTOS ---
const btnLogin = document.getElementById("btnLogin");
const btnCadastro = document.getElementById("btnCadastro");
const loginForm = document.getElementById("loginForm");
const cadastroForm = document.getElementById("cadastroForm");

// --- CONTROLE DAS ABAS ---
btnLogin.addEventListener("click", () => {
  loginForm.style.display = "flex";
  cadastroForm.style.display = "none";
  btnLogin.classList.add("ativo");
  btnCadastro.classList.remove("ativo");
});

btnCadastro.addEventListener("click", () => {
  loginForm.style.display = "none";
  cadastroForm.style.display = "flex";
  btnCadastro.classList.add("ativo");
  btnLogin.classList.remove("ativo");
});

// --- AUTENTICAÇÃO: LOGIN ---
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  signInWithEmailAndPassword(auth, email, senha)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Erro ao entrar: " + error.message);
    });
});

// --- AUTENTICAÇÃO: CADASTRO ---
/*
cadastroForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("cad-email").value;
  const senha = document.getElementById("cad-senha").value;
  const confirmarSenha = document.getElementById("cad-confirmar-senha").value;

  // Validação para garantir que as senhas conferem
  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      alert("Conta criada com sucesso!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Erro ao cadastrar: " + error.message);
    });
});
*/
