const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname)); // serve index.html and script.js

// Store last 100 messages
const messageHistory = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send message history to the newly connected client
  socket.emit('message history', messageHistory);

  // When a message is received
  socket.on('chat message', (msg) => {
    const message = { text: msg, time: new Date().toLocaleTimeString() };

    // Add to history and limit to 100 messages
    messageHistory.push(message);
    if (messageHistory.length > 100) messageHistory.shift();

    // Broadcast the message to everyone
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
