const express = require("express");
const router = express.Router();
const kakao = require("../../../lib/provider/kakao.js");
const executeQuery = require("../../../lib/db.js");

router.get("/:provider", async (req, res) => {
  const provider = req.params.provider;
  const code = req.query.code;

  let access_token = {};
  let user_info = {};
  let nickname = "";
  let providerId = "";

  if (provider === "kakao") {
    access_token = await kakao.callback(code);
    user_info = await kakao.userInfo(access_token.access_token);
    nickname = user_info.properties.nickname;
    providerId = user_info.id;
  }

  const player = await checkNewPlayer(provider, providerId);

  if (!player) {
    await registerNewPlayer(provider, providerId);
  }

  // 임시
  res.cookie("providerId", providerId);

  res.cookie("access_token", JSON.stringify(access_token));
  res.cookie("nickname", nickname);

  res.redirect("/");
});

module.exports = router;

// 신규 플레이어 확인
async function checkNewPlayer(provider, providerId) {
  try {
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
      [provider, providerId]
    );
    console.log("신규 플레이어 확인 :", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error(error);
  }
}

// 신규 플레이어 등록
async function registerNewPlayer(provider, providerId) {
  try {
    await executeQuery(
      `
          insert into 
            account 
          values 
            ($1, $2);
        `,
      [provider, providerId]
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
      [provider, providerId]
    );
    console.log("신규 플레이어 등록");
  } catch (error) {
    console.error(error);
  }
}
