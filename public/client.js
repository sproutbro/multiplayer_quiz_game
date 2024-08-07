const socket = io();

const gameElement = document.getElementById("game");
const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const submitAnswerButton = document.getElementById("submitAnswer");
const scoreboard = document.getElementById("scoreboard");
const chat_container = document.querySelector(".chat_container");
const game_form = document.getElementById("game_form");
const login_button = document.getElementById("login_button");

checkLogin();

// 로그인 체크 기능
async function checkLogin() {
  try {
    const response = await fetch("/auth");
    if (!response.ok) return;
    const username = await response.json();
    socket.emit("setUsername", username);
    login_button.style.display = "none";
    gameElement.style.display = "block";
  } catch (error) {
    console.error(error);
  }
}

game_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const answer = answerInput.value.trim();
  socket.emit("answer", { answer: answer });
  answerInput.value = "";
});

// 스코어보드 세팅 기능
socket.on("scoreboardUpdate", (player) => {
  for (let key in player) {
    const value = player[key];

    const playerScoreElement = document.getElementById(value.username);
    if (!playerScoreElement) {
      const newScoreElement = document.createElement("div");
      newScoreElement.id = value.username;
      newScoreElement.textContent = `Player ${value.username}: ${value.score}`;
      scoreboard.appendChild(newScoreElement);
    }
  }
});

socket.on("question", (question) => {
  questionElement.textContent = question.question;
});

socket.on("correctAnswer", (data) => {
  const playerId = data.playerId;
  const score = data.score;
  updateScoreboard(playerId, score);
});

socket.on("chat message", (data) => {
  const newChatElement = document.createElement("div");
  newChatElement.textContent = data;
  chat_container.appendChild(newChatElement);
});

function updateScoreboard(playerId, score) {
  const playerScoreElement = document.getElementById(playerId);
  if (playerScoreElement) {
    playerScoreElement.textContent = `Player ${playerId}: ${score}`;
  } else {
    const newScoreElement = document.createElement("div");
    newScoreElement.id = playerId;
    newScoreElement.textContent = `Player ${playerId}: ${score}`;
    scoreboard.appendChild(newScoreElement);
  }
}
