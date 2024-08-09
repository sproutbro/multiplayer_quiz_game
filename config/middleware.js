const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");

module.exports = (app) => {
  // 로그 미들웨어
  app.use(morgan("dev"));

  // 공용 고정 경로
  app.use(express.static("public"));

  // 바디 파서
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // 쿠키 파서
  app.use(cookieParser());

  // 세션 설정
  app.use(
    session({
      secret: process.env.SESSION_SECRET, // 세션 암호화에 사용될 비밀키 (필수 설정)
      resave: false, // 세션 데이터의 변경이 없어도 항상 저장할지 여부
      saveUninitialized: true, // 초기화되지 않은 세션도 저장할지 여부
      cookie: {
        secure: true, // HTTPS에서만 쿠키 전송 여부
        maxAge: 1000 * 60 * 60, // 세션의 유효 기간 (millisecond 단위)
      },
    })
  );
};
