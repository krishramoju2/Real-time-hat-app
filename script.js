const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Function to add a message to the chat list
function addMessage(msg) {
  const item = document.createElement('li');
  item.textContent = `[${msg.time}] ${msg.text}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

// Receive message history when connected
socket.on('message history', (history) => {
  messages.innerHTML = ''; // Clear existing
  history.forEach(addMessage);
});

// Listen for new incoming messages
socket.on('chat message', function (msg) {
  addMessage(msg);
});

// Send message on form submit
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});
