# 🍵 Convite Web & Lista de Presentes — Chá de Cozinha

Um convite digital interativo e responsivo desenvolvido com **HTML, CSS e JavaScript puro (Vanilla JS)** integrado ao **Firebase Firestore** para gerenciamento de lista de presentes em tempo real.

O objetivo deste projeto é permitir que os convidados visualizem as informações do evento e reservem os presentes diretamente pelo navegador (especialmente via celular/WhatsApp), **bloqueando automaticamente** os itens já escolhidos para evitar presentes repetidos.

---

## ✨ Funcionalidades

- **Design Responsivo (Mobile-First):** Adaptado perfeitamente para telas de smartphones, tablets e desktops.
- **Atualização em Tempo Real:** Assim que um convidado escolhe um item, o botão muda instantaneamente para *"Já escolhido ✓"* na tela de todos os outros usuários conectados, sem precisar recarregar a página.
- **Trava Anti-Duplicidade (Transações Atômicas):** Utiliza `runTransaction` do Firestore e regras de segurança no servidor para impedir que duas pessoas reservem o mesmo presente no exato mesmo segundo.
- **Privacidade:** O nome do convidado fica registrado apenas no banco de dados para controle dos anfitriões, mantendo a discrição na lista pública.
- **Cadastro em Lote:** Inclui uma função auxiliar via console do navegador para popular toda a lista de presentes de uma só vez.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** (Estrutura semântica e meta tags Open Graph para pré-visualização no WhatsApp)
- **CSS3** (Variáveis CSS, Flexbox, CSS Grid e Media Queries)
- **JavaScript (ES6+ Modules)**
- **Firebase Firestore** (Banco de dados NoSQL em tempo real)

---

## 📂 Estrutura de Pastas

```text
convite-cha-de-cozinha/
├── img/
│   ├── Fundo.jpg       # Imagem de fundo texturizada
│   ├── bule.png        # Ilustração decorativa superior
│   └── xicara.png      # Ilustração decorativa inferior
├── index.html          # Estrutura do convite, lista e modal de reserva
├── style.css           # Estilização e responsividade
├── script.js           # Lógica de integração com o Firebase
└── README.md           # Documentação do projeto
```

---

## 🚀 Como Usar Este Template (Passo a Passo)

### 1. Clonar ou baixar o projeto
Faça um fork deste repositório ou baixe os arquivos para o seu computador:
```bash
git clone https://github.com/SEU-USUARIO/convite-cha-de-cozinha.git
```

### 2. Configurar o Banco de Dados no Firebase
Este projeto não precisa de um servidor backend próprio; toda a persistência é feita gratuitamente pelo **Firebase Firestore**.

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e clique em **Criar um projeto**.
2. Na tela inicial do projeto, clique no ícone da Web (**`</>`**) para registrar um novo aplicativo, dê um apelido a ele e copie o objeto `firebaseConfig`.
3. No menu lateral esquerdo, vá em **Criação > Firestore Database** e clique em **Criar banco de dados**.
4. Escolha a localização mais próxima (ex: `southamerica-east1`) e inicie em **modo de teste**.
5. Vá até a aba **Regras (Rules)** dentro do Firestore Database, substitua o conteúdo pelas regras abaixo e clique em **Publicar**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /presentes/{presenteId} {
      // Permite que os convidados visualizem a lista e que a carga inicial seja feita
      allow read, create: if true;
      
      // Garante que um presente só possa ser atualizado se ainda NÃO estiver reservado
      allow update: if resource.data.reservado == false 
                    && request.resource.data.reservado == true;
                    
      // Impede que convidados excluam itens pelo navegador
      allow delete: if false;
    }
  }
}
```

### 3. Conectar o Firebase ao Código
Abra o arquivo `script.js` e substitua o objeto `firebaseConfig` pelas credenciais copiadas no passo anterior:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

### 4. Personalizar o Convite e Cadastrar os Presentes
1. No arquivo `index.html`, altere os nomes, a data, o horário e o `[Endereço]` do evento.
2. Substitua as imagens na pasta `img/` caso queira aplicar a sua própria identidade visual.
3. No arquivo `script.js`, edite o array `itens` dentro da função `cadastrarListaInicial` com os presentes desejados.
4. Abra o `index.html` usando um servidor local (como a extensão **Live Server** no VS Code).
5. Abra o Console do navegador (**F12** > aba **Console**), digite o comando abaixo e pressione **Enter** para enviar todos os itens automaticamente para o Firestore:
   ```javascript
   cadastrarListaInicial()
   ```
6. *(Recomendado)* Após confirmar no painel do Firebase que todos os itens foram criados, remova a função `cadastrarListaInicial` do `script.js` antes de publicar.

---

## 🌐 Como Publicar Gratuitamente (GitHub Pages)

1. Suba os arquivos atualizados para o seu repositório no GitHub.
2. Acesse **Settings** (Configurações) > **Pages** no menu lateral do repositório.
3. Em **Branch**, selecione `main` (ou `master`), deixe a pasta como `/ (root)` e clique em **Save**.
4. Aguarde cerca de 2 minutos e o link oficial do seu convite estará disponível no topo da página!

---

## 💡 Como Gerenciar Reservas (Para os Anfitriões)

- **Ver quem escolheu cada item:** Acesse o painel do **Firestore Database** no Firebase. Cada documento da coleção `presentes` exibe os campos `nome`, `reservado` (`true`/`false`), `convidado` e `dataReserva`.
- **Liberar um presente escolhido por engano:** Basta abrir o documento correspondente no painel do Firebase e alterar o campo `reservado` de `true` para `false` (e limpar o campo `convidado`). O item voltará a ficar disponível instantaneamente no site.

---

Feito com 💚 para celebrar momentos especiais. Sinta-se à vontade para usar, adaptar e compartilhar este template!
https://vickt01.github.io/convitechadecozinha/
