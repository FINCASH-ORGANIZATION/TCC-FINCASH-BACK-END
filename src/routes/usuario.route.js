//ROTAS PARA USUÁRIOS
const rota = require('express').Router();
const usuarioController = require('../controllers/usuario.controller');

//DEFINE A ROTA COMO POST E ADICIONA A MESMA NO USUARIO CONTROLLER
rota.post("/", usuarioController.criarService);
rota.get("/", usuarioController.pesUsu)
rota.get("/:id", usuarioController.pesUsuId)

//EXPORTA A ROTA PARA SER CHAMADA PELO CONTROLLER
module.exports = rota;