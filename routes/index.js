const express = require("express");
const router = express.Router();

// /auth
const authRouter = require("./auth/index.js");
router.use("/auth", authRouter);

module.exports = router;
