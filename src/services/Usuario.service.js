// RESPONSAVEL POR CRIAR A CONEXÃO DOS DADOS COM O BANCO DE DADOS MONGODB

const Usuario = require("../models/Usuario");

const create = (body) => Usuario.create(body);

module.exports = {
    create,
};