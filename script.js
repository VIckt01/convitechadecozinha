import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  runTransaction,
  addDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. SUBSTITUA PELAS SUAS CREDENCIAIS DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAF6mvb3j-dUL1CPeC9TzAco_H56eXgwwM",
  authDomain: "presentes-be34a.firebaseapp.com",
  projectId: "presentes-be34a",
  storageBucket: "presentes-be34a.firebasestorage.app",
  messagingSenderId: "146306429044",
  appId: "1:146306429044:web:db3316a71e70fad6566121",
  measurementId: "G-WK3ZJCM403",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const presentesRef = collection(db, "presentes");

// Elementos da tela
const gridPresentes = document.getElementById("grid-presentes");
const modalReserva = document.getElementById("modal-reserva");
const modalNomePresente = document.getElementById("modal-nome-presente");
const inputNomeConvidado = document.getElementById("input-nome-convidado");
const btnCancelar = document.getElementById("btn-cancelar");
const btnConfirmar = document.getElementById("btn-confirmar");

let presenteSelecionadoId = null;

// 2. ESCUTA EM TEMPO REAL DA LISTA DE PRESENTES
const consultaOrdenada = query(presentesRef, orderBy("nome"));

onSnapshot(consultaOrdenada, (snapshot) => {
  gridPresentes.innerHTML = "";

  if (snapshot.empty) {
    gridPresentes.innerHTML = `<p class="carregando">Nenhum presente cadastrado ainda.</p>`;
    return;
  }

  snapshot.forEach((documento) => {
    const dados = documento.data();
    const id = documento.id;

    const card = document.createElement("div");
    card.className = `presente-item ${dados.reservado ? "indisponivel" : ""}`;

    const titulo = document.createElement("div");
    titulo.className = "presente-titulo";
    titulo.textContent = dados.nome;

    const botao = document.createElement("button");
    botao.className = "btn-escolher";
    botao.disabled = dados.reservado;
    botao.textContent = dados.reservado
      ? "Já escolhido ✓"
      : "Escolher presente";

    if (!dados.reservado) {
      botao.addEventListener("click", () => abrirModal(id, dados.nome));
    }

    card.appendChild(titulo);
    card.appendChild(botao);
    gridPresentes.appendChild(card);
  });
});

// 3. CONTROLE DO MODAL
function abrirModal(id, nome) {
  presenteSelecionadoId = id;
  modalNomePresente.textContent = nome;
  inputNomeConvidado.value = "";
  modalReserva.classList.add("ativo");
  inputNomeConvidado.focus();
}

function fecharModal() {
  modalReserva.classList.remove("ativo");
  presenteSelecionadoId = null;
}

btnCancelar.addEventListener("click", fecharModal);

modalReserva.addEventListener("click", (e) => {
  if (e.target === modalReserva) fecharModal();
});

// 4. CONFIRMAÇÃO SEGURA NO BANCO (EVITA PRESENTES REPETIDOS)
btnConfirmar.addEventListener("click", async () => {
  const nomeConvidado = inputNomeConvidado.value.trim();

  if (!nomeConvidado) {
    alert("Por favor, digite seu nome para confirmar.");
    inputNomeConvidado.focus();
    return;
  }

  btnConfirmar.disabled = true;
  btnConfirmar.textContent = "Salvando...";

  const docRef = doc(db, "presentes", presenteSelecionadoId);

  try {
    await runTransaction(db, async (transaction) => {
      const registro = await transaction.get(docRef);

      if (!registro.exists()) {
        throw "Este item não existe mais na lista.";
      }

      if (registro.data().reservado) {
        throw "Ops! Alguém acabou de escolher este presente segundos antes.";
      }

      transaction.update(docRef, {
        reservado: true,
        convidado: nomeConvidado,
        dataReserva: new Date().toISOString(),
      });
    });

    fecharModal();
    alert(
      `Obrigada, ${nomeConvidado}! Seu presente foi reservado com sucesso.`,
    );
  } catch (erro) {
    alert(erro);
    fecharModal();
  } finally {
    btnConfirmar.disabled = false;
    btnConfirmar.textContent = "Confirmar Escolha";
  }
});

// 5. FUNÇÃO AUXILIAR PARA CADASTRAR SUA LISTA PELO CONSOLE (F12)
window.cadastrarListaInicial = async () => {
  const itens = [
    "Jogo de panelas",
    "Peneira",
    "Lixeira de cozinha",
    "Escorredor de louça",
    "Lixeira de banheiro",
    "Prendedor de roupa",
    "Pano de prato",
    "Jogo de copos",
    "Cesto de roupa",
    "Tábua de carne",
    "Suporte de papel toalha",
    "Jarra de suco",
    "Coador de café",
    "Garrafa térmica",
    "Varal de roupa íntima",
    "Toalha de mesa pequena",
    "Tupperware",
    "Jogo de faca",
    "Organizador de talheres",
    "Liquidificador",
    "Jogo de tapete",
    "Fruteira",
    "Utensílios de cozinha (ex: Concha, Espumadeira etc...)",
    "Jogo de xícaras",
    "Porta tempero",
    "Descascador de legumes",
    "Saleiro",
    "Açucareiro",
    "Ralador",
    "Prato para bolo"
  ];

  for (const nome of itens) {
    await addDoc(presentesRef, {
      nome: nome,
      reservado: false,
      convidado: "",
    });
  }
  alert("Lista cadastrada com sucesso!");
};
