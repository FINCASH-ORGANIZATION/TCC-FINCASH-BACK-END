//ROTAS PARA USUÁRIOS
const rota = require('express').Router(); //Define a variavel "rota" como o router, que permite criar rotas fora do principal
const usuarioController = require('../controllers/usuario.controller');

//DEFINE A ROTA COMO POST E ADICIONA A MESMA NO USUARIO CONTROLLER
rota.post("/", usuarioController.criarUsu);
rota.get("/", usuarioController.pesUsu)
rota.get("/:id", usuarioController.pesUsuId)
rota.patch("/:id", usuarioController.UsuUpdate)

//EXPORTA A ROTA PARA SER CHAMADA PELO CONTROLLER
module.exports = rota;