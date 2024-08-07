const express = require("express");
const router = express.Router();

// /auth
const authRouter = require("./auth/index.js");
router.use("/auth", authRouter);

// /avata
const avataRouter = require("./avata/index.js");
router.use("/avata", avataRouter);

module.exports = router;
