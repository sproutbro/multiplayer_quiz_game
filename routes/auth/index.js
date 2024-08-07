const express = require("express");
const router = express.Router();
const kakao = require("./provider/kakao.js");

const loginRouter = require("./login");
router.use("/login", loginRouter);

const callbackRouter = require("./callback");
router.use("/callback", callbackRouter);

// /auth
router.use("/", async (req, res) => {
  // 로그인 확인

  // 비회원로그인확인
  const non_member = req.cookies["non_member"];
  if (non_member) {
    res.send(non_member);
  }

  // 쿠키확인
  const access_token_cookie = req.cookies["access_token"];
  if (!access_token_cookie) return;

  // 세션확인
  if (!req.session.access_token) {
    req.session.access_token = access_token_cookie;
  }

  // 유저정보가져와서 닉네임 넘기기
  try {
    const user_info = await kakao.userInfo(
      req.session.access_token.access_token
    );
    res.send({ username: user_info.properties.nickname });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
