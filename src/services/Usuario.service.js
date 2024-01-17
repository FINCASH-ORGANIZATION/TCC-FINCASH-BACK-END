//RESPONSAVEL POR CRIAR A CONEXÃO DOS DADOS COM O BANCO DE DADOS MONGODB, PEGA OS DADOS JSON INSERIDOS NO BODY E DEVOLVE NA VARIAVEL CREATE,
//QUE POR SUA VEZ ARMAZENA OS VALORES DO USUARIO

const Usuario = require("../models/Usuario"); //FAZ A IMPORTAÇÃO DO MODULO QUE RECEBE AS INFORMAÇÕES DO USUARIO

const criarUsu = (body) => Usuario.create(body); //Cria o usuario com base no modelo importado contendo as informações do mesmo no banco
const pesUsuService = () => Usuario.find(); //Pesquisa o usuario no banco
const pesUsuIdService = (id) => Usuario.findById(id); // Pesquisa o ID do usuario no banco
const UsuUpdateService = (id, nome, senha, email, telefone) => Usuario.findOneAndUpdate(
    { _id: id },
    { nome, senha, email, telefone });

module.exports = {
    criarUsu,
    pesUsuService,
    pesUsuIdService,
    UsuUpdateService
};