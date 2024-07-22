const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/"));

let players = {};
let questions = [
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is 2 + 2?", answer: "4" },
  { question: "What is the capital of Japan?", answer: "Tokyo" },
];

let currentQuestionIndex = 0;

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  players[socket.id] = { score: 0, username: "Player " + socket.id };

  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
    delete players[socket.id];
    io.emit("scoreboardUpdate", players);
  });

  socket.on("setUsername", (data) => {
    if (players[socket.id]) {
      players[socket.id].username = data.username;
      io.emit("scoreboardUpdate", players);
    }
  });

  socket.on("answer", (data) => {
    if (
      data.answer.toLowerCase() ===
      questions[currentQuestionIndex].answer.toLowerCase()
    ) {
      players[socket.id].score += 1;
      io.emit("correctAnswer", {
        playerId: socket.id,
        score: players[socket.id].score,
      });
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      io.emit("question", questions[currentQuestionIndex]);
    }
  });

  socket.emit("question", questions[currentQuestionIndex]);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
