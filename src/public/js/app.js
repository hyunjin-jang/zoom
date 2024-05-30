const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const form = welcome.querySelector("form");

let roomName;

room.hidden = true;

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#message input")
  const value = input.value
  socket.emit("new_message", value, roomName, ()=>{
    addMessage(`You: ${value}`)
  })
  input.value = ""
}

const handleNicknameSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#name input")
  const value = input.value
  socket.emit("nickname", value)
  input.value = ""
}

const showRoom = () => {
  welcome.hidden = true;
  room.hidden =false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`
  const messageForm = room.querySelector("#message");
  const nameForm = room.querySelector("#name");
  messageForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

const addMessage = (message) => {
  const ul = room.querySelector("ul")
  const li = document.createElement("li")
  li.innerText = message;
  ul.appendChild(li)
}

function handleRoomSubmit(event){
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount)=>{
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`
  addMessage(`${user} arrived!`);
})

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`
  addMessage(`${left} left ㅠㅠ`)
})

socket.on("new_message", addMessage)

socket.on("room_change", (rooms) => {
  roomList.innerHTML = ""
  if(rooms.length === 0){
    return
  }
  const roomList = welcome.querySelector("ul");
  rooms.forEach((room)=>{
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li)
  })
})