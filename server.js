require("dotenv").config();

const http = require("http");
const createApp = require("./config/app.js");
const setupSocket = require("./config/socket.js");

const app = createApp();
const server = http.createServer(app);
setupSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
