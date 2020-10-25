const database = require("../utils/database");

const obterEmail = async (email = null) => {
  if (!email) {
    return null;
  }
  const query = `SELECT * FROM users WHERE email = $1;`;
  const result = await database.query({
    text: query,
    values: [email]
  });
  return result.rows.shift();
};

module.exports = { obterEmail };
