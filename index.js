const Koa = require("koa");
const cors = require("@koa/cors")
const bodyparser = require ("koa-bodyparser");
const server = new Koa();
const router = require('./src/routes')
// const hello = require("./src/controllers/jogos")

server.use(cors());
server.use(bodyparser());
server.use(router.routes())


server.listen(8081, () => console.log("Running on 8081"));
