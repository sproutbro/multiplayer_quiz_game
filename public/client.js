const socket = io();

const usernameForm = document.getElementById("usernameForm");
const usernameInput = document.getElementById("usernameInput");
const submitUsernameButton = document.getElementById("submitUsername");

const gameElement = document.getElementById("game");
const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const submitAnswerButton = document.getElementById("submitAnswer");
const scoreboard = document.getElementById("scoreboard");
const chat_container = document.querySelector(".chat_container");

// submitUsernameButton.addEventListener("click", () => {
//   const username = usernameInput.value.trim();
//   if (username) {
//     socket.emit("setUsername", { username: username });
//     usernameForm.style.display = "none";
//     gameElement.style.display = "block";
//   }
// });

// submitAnswerButton.addEventListener("click", () => {
//   const answer = answerInput.value.trim();
//   socket.emit("answer", { answer: answer });
//   answerInput.value = "";
// });
const username_form = document.getElementById("username_form");
const game_form = document.getElementById("game_form");
game_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const answer = answerInput.value.trim();
  socket.emit("answer", { answer: answer });
  answerInput.value = "";
});

username_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit("setUsername", { username: username });
    usernameForm.style.display = "none";
    gameElement.style.display = "block";
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
