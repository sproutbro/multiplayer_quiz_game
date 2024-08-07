const kakao = {
  authorization: function () {
    const url = new URL("https://kauth.kakao.com/oauth/authorize");
    const params = new URLSearchParams({
      client_id: process.env.AUTH_KAKAO_ID,
      redirect_uri: process.env.PUBLIC_ORIGIN + "/auth/callback/kakao",
      response_type: "code",
      prompt: "select_accoun",
      // state: Math.random().toString(),
    });
    url.search = params;
    return url.href;
  },
  callback: async function (code) {
    const url = "https://kauth.kakao.com/oauth/token";
    const option = {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.AUTH_KAKAO_ID,
        client_secret: process.env.AUTH_KAKAO_SECRET,
        redirect_uri: process.env.PUBLIC_ORIGIN + "/auth/callback/kakao",
        code,
      }),
    };

    try {
      const response = await fetch(url, option);
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  userInfo: async function (access_token) {
    const url = "https://kapi.kakao.com/v2/user/me";
    const option = {
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${access_token}`,
      },
    };
    try {
      const response = await fetch(url, option);
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = kakao;
