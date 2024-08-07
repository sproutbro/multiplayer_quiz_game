const express = require("express");
const router = express.Router();
const kakao = require("./provider/kakao.js");
const executeQuery = require("../../lib/db.js");

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
    return;
  }

  // 쿠키확인
  const access_token_cookie = req.cookies["access_token"];
  if (!access_token_cookie) return;

  // 세션확인
  if (!req.session.access_token) {
    req.session.access_token = access_token_cookie;
  }

  // 유저정보조회
  try {
    const user_info = await kakao.userInfo(
      req.session.access_token.access_token
    );

    let result;
    result = await executeQuery(
      `
        select 
          * 
        from 
          account a 
        where 
          a.provider = $1 
          and 
          a.provideraccountid = $2;
      `,
      ["kakao", user_info.id]
    );

    // db에 유저정보가 있는경우
    if (result.rowCount) {
      return res.send({ username: user_info.properties.nickname });
    }

    // db에 유저정보가 없는경우
    result = await executeQuery(
      `
        insert into 
          account 
        values 
          ($1, $2);
      `,
      ["kakao", user_info.id]
    );
    res.send({ username: user_info.properties.nickname });
    
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
