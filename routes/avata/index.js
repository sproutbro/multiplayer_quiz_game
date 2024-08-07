const express = require("express");
const router = express.Router();
const path = require("path");
// const kakao = require("./provider/kakao.js");
// const executeQuery = require("../../lib/db.js");

// /auth/login/
router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "avata.html");
  res.sendFile(filePath);
});

module.exports = router;
