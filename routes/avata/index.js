const express = require("express");
const router = express.Router();
const executeQuery = require("../../lib/db.js");

// /avata
router.get("/", async (req, res) => {
  const params = [];
  const query = req.query;
  const user_info_cookie = req.cookies["user_info"];
  if (query.id) {
    params[0] = query.provider;
    params[1] = query.id;
  } else {
    params[0] = "kakao";
    params[1] = user_info_cookie.id;
  }

  try {
    const result = await executeQuery(
      `
      select * from avatar where provider = $1 and provideraccountid = $2;
      `,
      params
    );

    const avatar = {
      hair_style: result.rows[0].hair_style || "/img/hair00.png",
      clothing: result.rows[0].clothing || "/img/clothing00.png",
      accessories: result.rows[0].accessories || "/img/accessories00.png",
      skin_tone: result.rows[0].skin_tone || "/img/skin00.png",
    };

    if (query.id) {
      res.send(avatar);
    } else {
      res.render("avata", { avatar });
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await executeQuery(
      `
      select * from avatar where provider = $1 and provideraccountid = $2;
      `,
      ["kakao", userId]
    );

    const avatar = {
      hair_style: result.rows[0].hair_style || "/img/hair00.png",
      clothing: result.rows[0].clothing || "/img/clothing00.png",
      accessories: result.rows[0].accessories || "/img/accessories00.png",
      skin_tone: result.rows[0].skin_tone || "/img/skin00.png",
    };

    res.send("avata", avatar);
  } catch (error) {
    console.error(error);
  }
});

// 아바타 저장
router.post("/", async (req, res) => {
  const user_info_cookie = req.cookies["user_info"];

  try {
    await executeQuery(
      `
      UPDATE avatar
        SET 
          hair_style=$1, 
          clothing=$2, 
          accessories=$3, 
          skin_tone=$4, 
          updated_at=CURRENT_TIMESTAMP 
        where 
          provider = $5 and 
          provideraccountid = $6;
      `,
      [
        req.body.hair,
        req.body.clothing,
        req.body.accessories,
        req.body.skin,
        "kakao",
        user_info_cookie.id,
      ]
    );
  } catch (error) {
    console.error(error);
  }

  const avatar = {
    hair_style: req.body.hair || "/img/hair00.png",
    clothing: req.body.clothing || "/img/clothing00.png",
    accessories: req.body.accessories || "/img/accessories00.png",
    skin_tone: req.body.skin || "/img/skin00.png",
  };

  res.render("avata", { avatar });
});

module.exports = router;
