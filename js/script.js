//registrando usuário
let username = "";
let nome = {};
let userRegistration;
function userReg(){
  username = prompt("Insira o seu nome:");
  nome = {
    name: username
  };
  userRegistration = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nome);
  userRegistration.then(fixOn);
  userRegistration.catch(userReg);
}
loadPage();
const all = `
  <li>
    <div class="flex">
      <span class="button-send"></span>
      <span class="all">Todos</span>
    </div>
    <span class=""></span>
  </li>
`;
//lendo o enter
let input = document.querySelector(".footer input");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("submitbtn").click();
        input.value = "";
    }
});
//menu lateral (participantes)
function showPeople() {
  document.querySelector(".show-people").classList.toggle("show");
  document.querySelector(".alpha").classList.toggle("show");
  loadUsers();
}
//mantendo a conexão
function fixOn(){
  setInterval(function(){
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nome)
  }, 5000);
}
//atualizando o chat
function loadPage(){
  axios.get("https://mock-api.driven.com.br/api/v4/uol/messages").then(pullMessages);
  setInterval(function(){
    axios.get("https://mock-api.driven.com.br/api/v4/uol/messages").then(pullMessages);
  }, 3000);
  userReg();
}
//enviando mensagem
function sendMsg(){
  let msg = document.querySelector(".footer input");
  let mensagem = {
    from: username,
    to: "Todos",
    text: msg.value,
    type: "message"
  };
  let testinho = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", mensagem);
  testinho.catch(attPage);
}

function attPage(){
  window.location.reload();
  /* loadPage(); */
  userReg();
}
//ATUALIZANDO LISTA USUÁRIOS
const intervalUsers = setInterval(loadUsers, 10000);
//FUNÇÃO P/ IMPRIMIR CHAT
function pullMessages(resposta) {
  document.querySelector(".chat ul").innerHTML = "";
  for(let i = 0; i < resposta.data.length; i++) {
    document.querySelector(".chat ul").innerHTML += `
    <li class="${resposta.data[i].type}">
      <span class="time light">(${resposta.data[i].time})</span> <span class="name-user bold">${resposta.data[i].from}</span> ${resposta.data[i].text}
    </li>
    `;
  }
  let lastMessage = document.querySelector(".chat ul").children[99];
  lastMessage.scrollIntoView();
  console.log("atualizei");
}
//Buscando usuários e imprimindo
function loadUsers(){
  const pullUsers = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
  pullUsers.then(printUsers);
  function printUsers(resposta){
    document.querySelector(".users ul").innerHTML = all;
    for(let i = 0; i < resposta.data.length; i++) {
      document.querySelector(".users ul").innerHTML += `
        <li>
          <div class="flex">
            <span class="button-send"></span>
            <span class="user">${resposta.data[i].name}</span>
          </div>
          <span class=""></span>
        </li>
      `;
    }
  }
}