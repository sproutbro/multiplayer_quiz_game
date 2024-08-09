const socketIO = require("socket.io");
const { parse, serialize } = require("cookie");

//
const getAvatar = require("../lib/avatar.js");

let players = {};
let question = newQuestion();

function setupSocket(server) {
  const io = socketIO(server);

  io.on("connection", async (socket) => {
    const cookies = getCookie(socket);

    if (cookies) {
      if (cookies.nickname) {
        player = cookies.nickname;
        registerPlayer(socket.id, player);
      }

      if (cookies.providerId) {
        const avatar = await getAvatar("kakao", cookies.providerId);
        players[socket.id].avatar = avatar;
      }

      io.emit("setPlayer", players);
    } else {
      io.to(socket.id).emit("setPlayer", players);
    }

    // 특정 클라이언트 메세지 전송
    socket.on("sendMessageToSpecificUser", (data) => {
      const targetSocketId = data.targetSocketId; // 메시지를 받을 클라이언트의 socket.id
      const message = data.message;

      // 특정 클라이언트에게만 메시지 전송
      io.to(targetSocketId).emit("privateMessage", {
        from: socket.id,
        message: message,
      });
    });

    // 퀴즈
    socket.emit("question", question);

    socket.on("answer", (data) => {
      console.log(data);
      console.log(question.answer);
      if (data.answer == question.answer) {
        players[socket.id].score += 1;
        io.emit("correctAnswer", {
          playerId: players[socket.id].username,
          score: players[socket.id].score,
        });
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        io.emit("question", questions[currentQuestionIndex]);
      } else {
        io.emit("chat message", `${players[socket.id].player}: ${data.answer}`);
      }
    });

    socket.on("disconnect", () => {
      delete players[socket.id];
      io.emit("setPlayer", players);
    });
  });

  return io;
}

module.exports = setupSocket;

//
function newQuestion() {
  let randomNumber = Math.floor(Math.random() * 20) + 1;
  let randomNumber2 = Math.floor(Math.random() * 20) + 1;

  return {
    question: `${randomNumber} * ${randomNumber2} =`,
    answer: randomNumber * randomNumber2,
  };
}

// 플레이어 등록
function registerPlayer(id, player) {
  players[id] = { score: 0, player };
  console.log("플레이어 등록 : ", player);
}

// 쿠키 가져오기
function getCookie(socket) {
  let cookies = socket.handshake.headers.cookie;
  if (cookies) cookies = parse(cookies);

  console.log("쿠키 가져오기 : ");
  return cookies;
}
