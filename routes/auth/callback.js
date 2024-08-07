const express = require("express");
const router = express.Router();
const kakao = require("./provider/kakao.js");

router.get("/:provider", async (req, res) => {
  const provider = req.params.provider;
  let access_token;
  if (provider === "kakao") {
    const code = req.query.code;
    access_token = await kakao.callback(code);
    res.cookie("access_token", access_token);
    req.session.access_token = access_token;
  }

  res.redirect("/");
});

module.exports = router;
