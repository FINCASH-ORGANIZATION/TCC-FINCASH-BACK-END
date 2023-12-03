const rota = require('express').Router();
const usuarioController = require('../controllers/usuario.controller');

rota.post("/", usuarioController.criar);


module.exports = rota;