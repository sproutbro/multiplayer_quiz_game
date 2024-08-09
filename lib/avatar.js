const executeQuery = require("./db.js");

// 아바타가져오기
async function getAvatar(provider, providerId) {
  try {
    const result = await executeQuery(
      `
        select * from avatar where provider = $1 and provideraccountid = $2;
    `,
      [provider, providerId]
    );
    console.log("아바타가져오기", provider, providerId);
    return result.rows[0];
  } catch (error) {
    console.error(error);
  }
}

module.exports = getAvatar;
