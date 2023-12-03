const rota = require('express').Router();
const usuarioController = require('../controllers/usuario.controller');

rota.get("/", usuarioController.soma);


module.exports = rota;