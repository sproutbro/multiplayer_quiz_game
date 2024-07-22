const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let players = {};
let questions = [
  { question: "한국의 수도는 어디인가요?", answer: "서울" },
  {
    question:
      "한국의 전통 음식으로, 발효된 배추와 다양한 양념으로 만든 음식은 무엇인가요?",
    answer: "김치",
  },
  {
    question:
      "한국의 전통 무술로, 올림픽 종목에도 포함된 이 무술은 무엇인가요?",
    answer: "태권도",
  },
  {
    question:
      "한국의 대표적인 강으로, 서울을 가로지르는 강의 이름은 무엇인가요?",
    answer: "한강",
  },
  {
    question: "조선시대의 과학자로, 측우기를 발명한 사람은 누구인가요?",
    answer: "장영실",
  },
  { question: "한글을 창제한 조선의 왕은 누구인가요?", answer: "세종대왕" },
  {
    question:
      "한국의 전통 놀이로, 명절에 널리 즐기는 놀이 중 하나는 무엇인가요?",
    answer: "윷놀이",
  },
  {
    question:
      "세계적으로 유명한 한국의 아이돌 그룹으로, '방탄소년단'의 약자는 무엇인가요?",
    answer: "BTS",
  },
  { question: "대한민국의 공식 언어는 무엇인가요?", answer: "한국어" },
  {
    question:
      "한국의 전통 의상으로, 명절이나 결혼식 등 특별한 날에 입는 옷은 무엇인가요?",
    answer: "한복",
  },
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
        playerId: players[socket.id].username,
        score: players[socket.id].score,
      });
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      io.emit("question", questions[currentQuestionIndex]);
    } else {
      io.emit("chat message", `${players[socket.id].username}: ${data.answer}`);
    }
  });

  socket.emit("question", questions[currentQuestionIndex]);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
