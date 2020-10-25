const jwt = require("jsonwebtoken");
const response = require("../utils/response");

require("dotenv").config();

const verify = async (ctx, next) => {
  const [bearer, token] = ctx.headers.authorization.split(" ");
  try{
 const verification = await jwt.verify(token, process.env.JWT_SECRET);

  ctx.state.userId = verification.id;
  ctx.state.email = verification.id;
  }catch(err){
	return response(ctx, 403, {mensagem: 'Ação Proibida'})
  }
 

  return next();
};

module.exports = { verify };
