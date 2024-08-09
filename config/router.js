const indexRouter = require("../routes/index");
const callbackRouter = require("../routes/auth/callback");
const loginRouter = require("../routes/auth/login");

module.exports = (app) => {
  app.use("/", indexRouter);
  app.use("/auth/login", loginRouter);
  app.use("/auth/callback", callbackRouter);
};
