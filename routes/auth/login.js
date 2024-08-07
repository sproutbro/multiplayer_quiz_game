const express = require("express");
const router = express.Router();
const path = require("path");
const kakao = require("./provider/kakao.js");

// /auth/login/:provider
router.get("/:provider", (req, res) => {
  // 제공자에 맞는 uri 경로생성 후 리다이렉트
  const provider = req.params.provider;
  let authorization_uri;
  if (provider === "kakao") {
    authorization_uri = kakao.authorization();
  }
  res.redirect(authorization_uri);
});

// /auth/login/
router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "login.html");
  res.sendFile(filePath);
});

// 비회원로그인기능
router.post("/", (req, res) => {
  res.cookie("non_member", req.body);
  res.redirect("/");
});

module.exports = router;
