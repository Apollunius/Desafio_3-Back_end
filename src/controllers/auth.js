const User = require("../repositories/usuarios");
const Password = require("../utils/password");
const jwt = require("jsonwebtoken");
const response = require("../utils/response");

require("dotenv").config();
const verificarUser = async (ctx) => {
  email = ctx.request.body.email;
  password = ctx.request.body.password;
  ctx.body = await User.obterEmail(casa, visita);
};
const autenticar = async (ctx) => {
  const { email = null, password = null } = ctx.request.body;

  if (!email || !password) {
    return response(ctx, 400, { mensagem: "Pedido mal-formatado" });
  }

  const usuario = await User.obterEmail(email);
  if (usuario) {

    const comparision = await Password.check(password, usuario.senha);

    if (comparision) {
      const token = await jwt.sign(
        { email: usuario.email },
        process.env.JWT_SECRET || "cubosacademy",
		{ expiresIn: "1h" }
		
	  );
	
      return response(ctx, 200, { token });
    }
  }
  return response(ctx, 200, { mensagem: "Email ou senha incorreto!" });
};

module.exports = { autenticar, verificarUser };
