//RESPONSAVEL POR CRIAR A CONEXÃO DOS DADOS COM O BANCO DE DADOS MONGODB, PEGA OS DADOS JSON INSERIDOS NO BODY E DEVOLVE NA VARIAVEL CREATE,
//QUE POR SUA VEZ ARMAZENA OS VALORES DO USUARIO

const Usuario = require("../models/Usuario");

const create = (body) => Usuario.create(body);
const pesUsuService = () => Usuario.find();
const pesUsuIdService = (id) => Usuario.findById(id);
const UsuUpdateService = (id, nome, senha, email, telefone) => Usuario.findOneAndUpdate(
    { _id: id },
    { nome, senha, email, telefone });

module.exports = {
    create,
    pesUsuService,
    pesUsuIdService,
    UsuUpdateService
};