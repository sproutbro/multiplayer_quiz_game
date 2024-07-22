const socket = io();

const usernameForm = document.getElementById("usernameForm");
const usernameInput = document.getElementById("usernameInput");
const submitUsernameButton = document.getElementById("submitUsername");

const gameElement = document.getElementById("game");
const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const submitAnswerButton = document.getElementById("submitAnswer");
const scoreboard = document.getElementById("scoreboard");

submitUsernameButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit("setUsername", { username: username });
    usernameForm.style.display = "none";
    gameElement.style.display = "block";
  }
});

submitAnswerButton.addEventListener("click", () => {
  const answer = answerInput.value.trim();
  socket.emit("answer", { answer: answer });
  answerInput.value = "";
});

socket.on("question", (question) => {
  questionElement.textContent = question.question;
});

socket.on("correctAnswer", (data) => {
  const playerId = data.playerId;
  const score = data.score;
  updateScoreboard(playerId, score);
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
