//registrando usuário
let username = "";
let nome = {};
let userRegistration;
let message_to = "Todos";
let visibility = "message";
let visibilityInfo = "Público";
let intervalUser;
let intervalChat;
function userReg(){
  clearInterval(intervalUser);
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
    <div class="flex" onclick="messageTo(this)">
      <ion-icon class="all-icon" name="people" onclick="showPeople()"></ion-icon>
      <span class="all">Todos</span>
    </div>
    <ion-icon class="check" name="checkmark-sharp"></ion-icon>
  </li>
`;
//lendo o enter
let input = document.querySelector(".footer-group input");
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
  intervalUser = setInterval(function(){
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nome)
  }, 5000);
}
//atualizando o chat
function loadPage(){
  clearInterval(intervalChat);
  axios.get("https://mock-api.driven.com.br/api/v4/uol/messages").then(pullMessages);
  intervalChat = setInterval(function(){
    axios.get("https://mock-api.driven.com.br/api/v4/uol/messages").then(pullMessages);
  }, 3000);
  userReg();
  sendTo();
}
//enviando mensagem
function sendMsg(){
  let msg = document.querySelector(".footer-group input");
  let mensagem = {
    from: username,
    to: message_to,
    text: msg.value,
    type: visibility
  };
  let testinho = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", mensagem);
  msg.value = "";
  testinho.catch(attPage);
}

function attPage(){
  window.location.reload();
  userReg();
}
//ATUALIZANDO LISTA USUÁRIOS
let intervalUsers = setInterval(loadUsers, 10000);
//FUNÇÃO P/ IMPRIMIR CHAT
function pullMessages(resposta) {
  document.querySelector(".chat ul").innerHTML = "";
  for(let i = 0; i < resposta.data.length; i++) {
    if(resposta.data[i].type === "message"){
      document.querySelector(".chat ul").innerHTML += `
      <li class="message" data-identifier="message">
      <span class="time light">(${resposta.data[i].time})</span> 
      <span class="name-user bold">${resposta.data[i].from}</span> para <span class="name-user bold">${resposta.data[i].to}</span> ${resposta.data[i].text}
      </li>
      `;
    } else if(resposta.data[i].type === "private_message" && (resposta.data[i].from == username || resposta.data[i].to == username)){
      if(resposta.data[i].to == "Todos"){
        document.querySelector(".chat ul").innerHTML += `
        <li class="message" data-identifier="message">
        <span class="time light">(${resposta.data[i].time})</span> 
        <span class="name-user bold">${resposta.data[i].from}</span> para <span class="name-user bold">${"Todos"}</span> ${resposta.data[i].text}
        </li>
        `;
      } else {
        document.querySelector(".chat ul").innerHTML += `
        <li class="private_message" data-identifier="message">
        <span class="time light">(${resposta.data[i].time})</span> 
        <span class="name-user bold">${resposta.data[i].from}</span> para <span class="name-user bold">${resposta.data[i].to}</span> ${resposta.data[i].text}
        </li>
        `;
      }
    } else if(resposta.data[i].type === "status") {
      document.querySelector(".chat ul").innerHTML += `
      <li class="${resposta.data[i].type}" data-identifier="message">
      <span class="time light">(${resposta.data[i].time})</span> 
      <span class="name-user bold">${resposta.data[i].from}</span> ${resposta.data[i].text}
      </li>
      `;
    }
  }
  let lastMessage = document.querySelector(".chat ul").children[document.querySelector(".chat ul").children.length - 1];
  lastMessage.scrollIntoView();
}
//Buscando usuários e imprimindo
function loadUsers(){
  const pullUsers = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
  pullUsers.then(printUsers);
  function printUsers(resposta){
    document.querySelector(".users ul").innerHTML = all;
    for(let i = 0; i < resposta.data.length; i++) {
      document.querySelector(".users ul").innerHTML += `
        <li data-identifier="participant">
          <div class="flex" onclick="messageTo(this)">
            <ion-icon class="user-icon" name="person-circle"></ion-icon>
            <span class="user">${resposta.data[i].name}</span>
          </div>
          <ion-icon class="check" name="checkmark-sharp"></ion-icon>
        </li>
      `;
    }
    checkDisplay();
  }
}
function messageTo(element){
  if(element.children[1].innerHTML != username && element.children[1].innerHTML != message_to){
    message_to = element.children[1].innerHTML;
    document.querySelector(".users ul li .check.display").classList.remove("display");
    element.parentNode.children[1].classList.add("display");
    sendTo();
  }
}
function visibleTo(element){
  if(element.children[1].innerHTML == "Público"){
    visibility = "message";
    element.parentNode.children[1].classList.add("display");
    document.querySelector(".lock").parentNode.parentNode.children[1].classList.remove("display");
    visibilityInfo = "Público";
    sendTo();
  } else if(message_to != "Todos") {
    visibility = "private_message";
    element.parentNode.children[1].classList.add("display");
    document.querySelector(".unlock").parentNode.parentNode.children[1].classList.remove("display");
    visibilityInfo = "Reservadamente";
    sendTo();
  }
}
function checkDisplay() {
  let element = document.querySelectorAll(".users ul li");
  for(let i = 0; i < element.length; i++){
    if(element[i].children[0].children[1].innerHTML == message_to){
      element[i].children[1].classList.add("display");
    }
  }
}
function sendTo(){
  if(message_to == "Todos"){
    visibilityInfo = "Público";
    document.querySelector(".footer p").innerHTML = `Enviando para ${message_to} (${visibilityInfo})`;
  } else {
    document.querySelector(".footer p").innerHTML = `Enviando para ${message_to} (${visibilityInfo})`;
  }
}