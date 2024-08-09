const express = require("express");
const path = require("path");

function createApp() {
  const app = express();

  // View Engine Setup (EJS)
  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "ejs");

  // 미들웨어 설정
  require("./middleware.js")(app);

  // 라우터 설정
  require('./router')(app);
  
  return app;
}

module.exports = createApp;
