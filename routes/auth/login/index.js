const express = require("express");
const router = express.Router();
const kakao = require("../../../lib/provider/kakao.js");

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/:provider", (req, res) => {
  // 제공자에 맞는 uri 경로생성 후 리다이렉트
  const provider = req.params.provider;
  let authorization_uri;
  if (provider === "kakao") {
    authorization_uri = kakao.authorization();
  }
  res.redirect(authorization_uri);
});

// 비회원로그인기능
router.post("/", (req, res) => {
  res.cookie("nickname", req.body.username);
  res.redirect("/");
});

module.exports = router;
