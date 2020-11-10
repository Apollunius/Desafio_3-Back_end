const Router = require("koa-router");
const router = new Router();
const Jogos = require("./controllers/jogos");
const Auth = require("./controllers/auth");
const Session = require("./middlewares/session");

router.post("/auth", Auth.autenticar); // validaçao do email e senha onde é gerado o token

router.get("/jogos", Jogos.tabelaCompleta); // retorna a tabela completa
router.get("/jogos/:id", Jogos.tabelaPorRodada); // retorna a tabela por rodada
router.put("/jogos", Session.verify, Jogos.attTabela); // atualiza os gols da partida se caso o usuário estiver logado (localizado pelo id)
router.get("classificacao", Jogos.tabelaClassificada); // retorna a tabeça completa da classificação.




module.exports = router;
