//RESPONSAVEL POR CRIAR A CONEXÃO DOS DADOS COM O BANCO DE DADOS MONGODB, PEGA OS DADOS JSON INSERIDOS NO BODY E DEVOLVE NA VARIAVEL CREATE,
//QUE POR SUA VEZ ARMAZENA OS VALORES DO USUARIO

const Usuario = require("../models/Usuario");

const create = (body) => Usuario.create(body);
const pesUsuService = () => Usuario.find();
const pesUsuIdService = (id) => Usuario.findById(id);

module.exports = {
    create,
    pesUsuService,
    pesUsuIdService
};