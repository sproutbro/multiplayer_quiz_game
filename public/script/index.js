const player_section = document.getElementById("player");
const questionElement = document.getElementById("quiz");
const chatElement = document.getElementById("chat");
const inputElement = document.getElementById("input");

let player = {};

// 소켓시작
const socket = io();

// 플레이어 정보
socket.on("setPlayer", (data) => {
  setPlayer(data);
});

// 서버로부터 특정 메시지 수신
socket.on("privateMessage", (data) => {
  console.log(`Message from ${data.from}: ${data.message}`);
});

inputElement.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const answer = e.currentTarget.answer.value;
  socket.emit("answer", { answer: answer });
  e.currentTarget.answer.value = "";
});

socket.on("chat message", (data) => {
  const newChatElement = document.createElement("div");
  newChatElement.textContent = data;
  chatElement.appendChild(newChatElement);
});

socket.on("question", (data) => {
  questionElement.textContent = data.question;
});

// 플레이어 등록
function setPlayer(player) {
  player_section.innerHTML = "";
  for (let key in player) {
    const value = player[key];
    const playerScoreElement = document.getElementById(key);
    if (!playerScoreElement) {
      const newScoreElement = document.createElement("div");
      newScoreElement.id = key;
      newScoreElement.textContent = `${value.player}: ${value.score}`;

      if (value.avatar) {
        const newAvatarElement = document.createElement("div");
        newAvatarElement.classList.add("avatar");
        newAvatarElement.style.display = "none";
        if (value.avatar.hair_style) {
          const newImgElement = document.createElement("img");
          newImgElement.src = value.avatar.hair_style;
          newImgElement.alt = "hair";

          newAvatarElement.appendChild(newImgElement);
        }

        if (value.avatar.clothing) {
          const newImgElement = document.createElement("img");
          newImgElement.src = value.avatar.clothing;
          newImgElement.alt = "clothing";

          newAvatarElement.appendChild(newImgElement);
        }

        if (value.avatar.skin_tone) {
          const newImgElement = document.createElement("img");
          newImgElement.src = value.avatar.skin_tone;
          newImgElement.alt = "skin";

          newAvatarElement.appendChild(newImgElement);
        }

        if (value.avatar.accessories) {
          const newImgElement = document.createElement("img");
          newImgElement.src = value.avatar.accessories;
          newImgElement.alt = "accessories";

          newAvatarElement.appendChild(newImgElement);
        }
        newScoreElement.appendChild(newAvatarElement);
      }

      player_section.appendChild(newScoreElement);
    }
  }
}

player_section.addEventListener("click", (e) => {
  const avatar = e.target.querySelector(".avatar");
  if (avatar.style.display === "block") {
    avatar.style.display = "none";
  } else {
    avatar.style.display = "block";
  }
});
