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
  if (!access_token_cookie) return; //로그인안한회원
  const user_info_cookie = req.cookies["user_info"];
  if (user_info_cookie) return res.send(user_info_cookie);

  // 유저정보조회
  try {
    const user_info = await kakao.userInfo(access_token_cookie.access_token);
    res.cookie("user_info", user_info);

    let result;
    // DB확인
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

    // DB에 유저정보가 있는경우
    if (result.rowCount) {
      return res.send(user_info);
    }

    // DB에 유저정보가 없는경우
    await executeQuery(
      `
        insert into 
          account 
        values 
          ($1, $2);
      `,
      ["kakao", user_info.id]
    );

    await executeQuery(
      `
        INSERT INTO 
          public.avatar
            (provider, 
            provideraccountid)
        VALUES (
          $1, 
          $2);
      `,
      ["kakao", user_info.id]
    );

    res.send(user_info);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
